import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAGE_TRANSITION_CONFIG, PAGE_META_MAP } from '../config/pageTransition';

/**
 * 判断事件目标是否位于：
 * 1. 带有 [data-scroll-paging-ignore] 属性的交互画布/拔丝台/横向卷轴（【B-2, B-3】强制解耦短路返回 true）
 * 2. 表单输入控件
 * 3. 尚未滚到边界的内部可滚动子容器（如 /archive 的 .archive-list-pane）
 * 确保内部作画、拔丝与局部滚动绝对不被换页器劫持
 */
export function isInsideActiveInnerScroller(target, deltaY, edgeTolerance) {
  if (!target || !(target instanceof Element)) return false;

  if (target.closest('[data-scroll-paging-ignore]')) {
    return true;
  }

  const tag = target.tagName;
  if (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  ) {
    return true;
  }

  let el = target;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.hasAttribute && el.hasAttribute('data-scroll-paging-ignore')) {
      return true;
    }
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      el.scrollHeight > el.clientHeight + edgeTolerance;

    if (isScrollableY) {
      const atInnerTop = el.scrollTop <= edgeTolerance;
      const atInnerBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - edgeTolerance;

      if ((deltaY > 0 && !atInnerBottom) || (deltaY < 0 && !atInnerTop)) {
        return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * 读取当前窗口的滚动边界状态与全页滚动百分比
 */
function getViewportScrollMetrics(edgeTolerance) {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body ? document.body.scrollHeight : 0
  );
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const maxScroll = Math.max(0, scrollHeight - clientHeight);

  const atTop = scrollTop <= edgeTolerance;
  const atBottom = scrollTop >= maxScroll - edgeTolerance;
  const progressPercent =
    maxScroll <= edgeTolerance
      ? 100
      : Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));

  return {
    scrollTop,
    maxScroll,
    atTop,
    atBottom,
    progressPercent
  };
}

/**
 * 核心 Hook：统一管理「手动通道（导航/Logo/键盘直通）」与「滚动通道（三道门禁判定）」
 * 自检修复：
 * 1. 使用 useMemo 稳定化 config 对象并用 pathnameRef 同步当前路径，避免滚动更新 scrollProgress 时反复解绑/重绑 wheel 与 touch 监听器。
 * 2. 强化后退换页 scrollTo(0, max) 的双帧确认，确保切入 400vh 长卷页时精确定位到底部。
 */
export default function useScrollPaging(customConfig = null) {
  const config = useMemo(
    () => ({ ...PAGE_TRANSITION_CONFIG, ...(customConfig || {}) }),
    [customConfig]
  );

  const location = useLocation();
  const navigate = useNavigate();

  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const currentIndex = Math.max(0, config.pageOrder.indexOf(location.pathname));

  const [transitionState, setTransitionState] = useState({
    isTransitioning: false,
    direction: 'forward',
    source: 'manual',
    activeIndex: currentIndex
  });
  const [announcement, setAnnouncement] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const prevIndexRef = useRef(currentIndex);
  const isTransitioningRef = useRef(false);
  const lastNavAtRef = useRef(0);
  const pendingScrollAlignRef = useRef('top');
  const transitionTimerRef = useRef(null);

  const activeGestureTypeRef = useRef(null);
  const gestureTypeResetTimerRef = useRef(null);
  const wheelAccumRef = useRef(0);
  const lastWheelDirRef = useRef(0);
  const wheelDecayTimerRef = useRef(null);
  const rafWheelIdRef = useRef(null);

  const isMomentumScrollingRef = useRef(false);
  const momentumTimerRef = useRef(null);
  const wasAtTopRef = useRef(true);
  const wasAtBottomRef = useRef(false);

  const touchStartRef = useRef({
    y: 0,
    x: 0,
    startedAtTop: false,
    startedAtBottom: false,
    target: null,
    active: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(Boolean(mql.matches));
    updateMotionPreference();

    if (mql.addEventListener) {
      mql.addEventListener('change', updateMotionPreference);
      return () => mql.removeEventListener('change', updateMotionPreference);
    }
  }, []);

  const isInstant = config.respectReducedMotion && reducedMotion;
  const effectiveDuration = isInstant ? 0 : config.duration;
  const effectiveDistance = isInstant ? 0 : config.distance;

  // 滚动进度只按「整数百分比」粒度提交：否则每个 scroll 事件都会让 AppShell 整树重渲染
  // （本 hook 的调用方在 App 根部，重渲染范围是整棵路由树）。
  const commitScrollProgress = useCallback((percent) => {
    const rounded = Math.round(percent);
    setScrollProgress((prev) => (prev === rounded ? prev : rounded));
  }, []);

  const recalculateProgressBar = useCallback(() => {
    const metrics = getViewportScrollMetrics(config.edgeTolerance);
    commitScrollProgress(metrics.progressPercent);
    wasAtTopRef.current = metrics.atTop;
    wasAtBottomRef.current = metrics.atBottom;
  }, [config.edgeTolerance, commitScrollProgress]);

  const unlockTransition = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    isTransitioningRef.current = false;
    wheelAccumRef.current = 0;
    document.documentElement.style.scrollBehavior = '';
    setTransitionState((prev) =>
      prev.isTransitioning ? { ...prev, isTransitioning: false } : prev
    );
    recalculateProgressBar();
  }, [recalculateProgressBar]);

  // 【唯一出口】navigateByIndex(targetIndex, source)
  const navigateByIndex = useCallback(
    (targetIndex, source = 'manual') => {
      const pageCount = config.pageOrder.length;
      if (pageCount === 0) return false;

      let resolvedIndex = targetIndex;
      if (config.wrapAround) {
        resolvedIndex = ((targetIndex % pageCount) + pageCount) % pageCount;
      } else if (targetIndex < 0 || targetIndex >= pageCount) {
        return false;
      }

      const activeIdx = Math.max(0, config.pageOrder.indexOf(pathnameRef.current));
      if (resolvedIndex === activeIdx) return false;

      const now = performance.now();

      if (source === 'scroll') {
        if (!config.enabled || config.mode === 'off') return false;
        if (config.lockDuringTransition && isTransitioningRef.current) return false;
        if (now - lastNavAtRef.current < config.cooldown) return false;
      }

      const direction = resolvedIndex > activeIdx ? 'forward' : 'backward';
      const targetPath = config.pageOrder[resolvedIndex];

      isTransitioningRef.current = true;
      lastNavAtRef.current = now;
      wheelAccumRef.current = 0;
      prevIndexRef.current = activeIdx;

      pendingScrollAlignRef.current =
        source === 'scroll' && direction === 'backward' ? 'bottom' : 'top';

      document.documentElement.style.scrollBehavior = 'auto';

      setTransitionState({
        isTransitioning: true,
        direction,
        source,
        activeIndex: resolvedIndex
      });

      navigate(targetPath);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = setTimeout(() => {
        unlockTransition();
      }, effectiveDuration + 40);

      return true;
    },
    [config, navigate, effectiveDuration, unlockTransition]
  );

  const navigateByPath = useCallback(
    (targetPath, source = 'manual') => {
      const idx = config.pageOrder.indexOf(targetPath);
      if (idx !== -1) {
        return navigateByIndex(idx, source);
      }
      return false;
    },
    [config.pageOrder, navigateByIndex]
  );

  // 路由变化后的滚动归位、标题焦点管理与无障碍读屏播报
  useEffect(() => {
    const currentPath = location.pathname;
    const meta = PAGE_META_MAP[currentPath] || {
      name: '当前页',
      title: '一勺糖稀 · 非遗百年'
    };

    document.title = meta.title;
    setAnnouncement(`已切换到〈${meta.name}〉`);

    const alignMode = pendingScrollAlignRef.current;
    pendingScrollAlignRef.current = 'top';

    const applyScrollPosition = () => {
      document.documentElement.style.scrollBehavior = 'auto';
      if (alignMode === 'bottom') {
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );
        window.scrollTo({ top: maxScroll, left: 0, behavior: 'auto' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    let settleTimer = null;
    const rafId = requestAnimationFrame(() => {
      applyScrollPosition();

      const mainHeading = document.querySelector('main h1, .hero-screen h1');
      if (mainHeading) {
        if (!mainHeading.hasAttribute('tabindex')) {
          mainHeading.setAttribute('tabindex', '-1');
        }
        mainHeading.focus({ preventScroll: true });
      }

      recalculateProgressBar();

      // 二次确认（针对 400vh 长卷等大高度页面布局完成后的精确触底归位）
      if (alignMode === 'bottom') {
        settleTimer = setTimeout(() => {
          applyScrollPosition();
          recalculateProgressBar();
        }, 24);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [location.pathname, recalculateProgressBar]);

  useEffect(() => {
    const handleScroll = () => {
      const metrics = getViewportScrollMetrics(config.edgeTolerance);
      commitScrollProgress(metrics.progressPercent);

      if (!metrics.atTop && !metrics.atBottom) {
        isMomentumScrollingRef.current = true;
        wheelAccumRef.current = 0;
      }

      wasAtTopRef.current = metrics.atTop;
      wasAtBottomRef.current = metrics.atBottom;

      if (momentumTimerRef.current) {
        clearTimeout(momentumTimerRef.current);
      }
      momentumTimerRef.current = setTimeout(() => {
        isMomentumScrollingRef.current = false;
      }, 150);
    };

    const handleScrollEnd = () => {
      if (momentumTimerRef.current) {
        clearTimeout(momentumTimerRef.current);
      }
      isMomentumScrollingRef.current = false;
      recalculateProgressBar();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', recalculateProgressBar, { passive: true });

    const supportsScrollEnd = 'onscrollend' in window;
    if (supportsScrollEnd) {
      window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    }

    recalculateProgressBar();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', recalculateProgressBar);
      if (supportsScrollEnd) {
        window.removeEventListener('scrollend', handleScrollEnd);
      }
      if (momentumTimerRef.current) {
        clearTimeout(momentumTimerRef.current);
      }
    };
  }, [config.edgeTolerance, recalculateProgressBar]);

  useEffect(() => {
    if (!config.enabled || config.mode === 'off') return;

    const markGestureType = (type) => {
      activeGestureTypeRef.current = type;
      if (gestureTypeResetTimerRef.current) {
        clearTimeout(gestureTypeResetTimerRef.current);
      }
      gestureTypeResetTimerRef.current = setTimeout(() => {
        activeGestureTypeRef.current = null;
      }, 400);
    };

    const handleWheel = (e) => {
      if (activeGestureTypeRef.current === 'touch') return;
      if (!config.mobileEnabled && window.innerWidth <= 768) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 1) return;

      if (isInsideActiveInnerScroller(e.target, deltaY, config.edgeTolerance)) {
        wheelAccumRef.current = 0;
        return;
      }

      const metrics = getViewportScrollMetrics(config.edgeTolerance);
      const dir = deltaY > 0 ? 1 : -1;

      const canGoNext = dir > 0 && metrics.atBottom && !isMomentumScrollingRef.current;
      const canGoPrev = dir < 0 && metrics.atTop && !isMomentumScrollingRef.current;

      if (!canGoNext && !canGoPrev) {
        wheelAccumRef.current = 0;
        return;
      }

      markGestureType('wheel');

      if (lastWheelDirRef.current !== 0 && lastWheelDirRef.current !== dir) {
        wheelAccumRef.current = 0;
      }
      lastWheelDirRef.current = dir;
      wheelAccumRef.current += deltaY;

      if (wheelDecayTimerRef.current) {
        clearTimeout(wheelDecayTimerRef.current);
      }
      wheelDecayTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 220);

      if (rafWheelIdRef.current) return;
      rafWheelIdRef.current = requestAnimationFrame(() => {
        rafWheelIdRef.current = null;
        const accum = wheelAccumRef.current;
        const currentMetrics = getViewportScrollMetrics(config.edgeTolerance);
        const activeIdx = Math.max(0, config.pageOrder.indexOf(pathnameRef.current));

        if (accum >= config.wheelThreshold && currentMetrics.atBottom && !isMomentumScrollingRef.current) {
          wheelAccumRef.current = 0;
          navigateByIndex(activeIdx + 1, 'scroll');
        } else if (accum <= -config.wheelThreshold && currentMetrics.atTop && !isMomentumScrollingRef.current) {
          wheelAccumRef.current = 0;
          navigateByIndex(activeIdx - 1, 'scroll');
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (rafWheelIdRef.current) cancelAnimationFrame(rafWheelIdRef.current);
      if (wheelDecayTimerRef.current) clearTimeout(wheelDecayTimerRef.current);
    };
  }, [config, navigateByIndex]);

  useEffect(() => {
    if (!config.enabled || config.mode === 'off') return;

    const handleTouchStart = (e) => {
      if (!config.mobileEnabled && window.innerWidth <= 768) return;
      if (activeGestureTypeRef.current === 'wheel') return;
      if (!e.touches || e.touches.length !== 1) return;

      if (e.target && e.target.closest && e.target.closest('[data-scroll-paging-ignore]')) {
        touchStartRef.current.active = false;
        return;
      }

      const touch = e.touches[0];
      const metrics = getViewportScrollMetrics(config.edgeTolerance);

      touchStartRef.current = {
        y: touch.clientY,
        x: touch.clientX,
        startedAtTop: metrics.atTop && !isMomentumScrollingRef.current,
        startedAtBottom: metrics.atBottom && !isMomentumScrollingRef.current,
        target: e.target,
        active: true
      };
    };

    const handleTouchEnd = (e) => {
      const startInfo = touchStartRef.current;
      if (!startInfo.active) return;
      touchStartRef.current.active = false;

      if (!config.mobileEnabled && window.innerWidth <= 768) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dy = startInfo.y - touch.clientY;
      const dx = startInfo.x - touch.clientX;

      if (Math.abs(dx) > Math.abs(dy) * 0.75) return;
      if (Math.abs(dy) < config.touchThreshold) return;

      if (isInsideActiveInnerScroller(startInfo.target, dy, config.edgeTolerance)) {
        return;
      }

      const metrics = getViewportScrollMetrics(config.edgeTolerance);
      const activeIdx = Math.max(0, config.pageOrder.indexOf(pathnameRef.current));

      activeGestureTypeRef.current = 'touch';
      if (gestureTypeResetTimerRef.current) {
        clearTimeout(gestureTypeResetTimerRef.current);
      }
      gestureTypeResetTimerRef.current = setTimeout(() => {
        activeGestureTypeRef.current = null;
      }, 400);

      if (dy >= config.touchThreshold && startInfo.startedAtBottom && metrics.atBottom) {
        navigateByIndex(activeIdx + 1, 'scroll');
      } else if (dy <= -config.touchThreshold && startInfo.startedAtTop && metrics.atTop) {
        navigateByIndex(activeIdx - 1, 'scroll');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [config, navigateByIndex]);

  useEffect(() => {
    if (!config.keyboardEnabled) return;

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          activeEl.isContentEditable ||
          (activeEl.closest && activeEl.closest('[data-scroll-paging-ignore]'))
        ) {
          return;
        }
      }

      const metrics = getViewportScrollMetrics(config.edgeTolerance);
      const activeIdx = Math.max(0, config.pageOrder.indexOf(pathnameRef.current));

      if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        if (isInsideActiveInnerScroller(activeEl, 10, config.edgeTolerance)) return;
        if (metrics.atBottom) {
          e.preventDefault();
          navigateByIndex(activeIdx + 1, 'manual');
        }
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        if (isInsideActiveInnerScroller(activeEl, -10, config.edgeTolerance)) return;
        if (metrics.atTop) {
          e.preventDefault();
          navigateByIndex(activeIdx - 1, 'manual');
        }
      } else if (e.key === ' ') {
        if (activeEl === document.body && metrics.atBottom) {
          e.preventDefault();
          navigateByIndex(activeIdx + 1, 'manual');
        }
      } else if (e.key === 'Home' && metrics.atTop) {
        e.preventDefault();
        navigateByIndex(0, 'manual');
      } else if (e.key === 'End' && metrics.atBottom) {
        e.preventDefault();
        navigateByIndex(config.pageOrder.length - 1, 'manual');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.keyboardEnabled, config.edgeTolerance, config.pageOrder, navigateByIndex]);

  return {
    config,
    currentIndex,
    isTransitioning: transitionState.isTransitioning,
    direction: transitionState.direction,
    source: transitionState.source,
    effectiveDuration,
    effectiveDistance,
    easing: config.easing,
    scrollProgress,
    announcement,
    navigateByIndex,
    navigateByPath,
    unlockTransition
  };
}