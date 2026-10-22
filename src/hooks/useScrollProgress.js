import { useState, useEffect } from 'react';

/**
 * 轻量滚动进度订阅（返回 0~100 的数字）。
 *
 * 为什么单独一个 hook：滚动进度是高频状态。如果把它放在 useScrollPaging / AppShell 里，
 * 每次滚动都会触发整棵路由树重渲染，并因 config 对象每渲染新建而导致 wheel / touch
 * 监听被反复销毁重建（2026-10-14 实测为明显卡顿源）。
 * 因此：进度条用 components/SugarProgressBar.jsx 自订阅，首页卷轴时间轴用本 hook 订阅，
 * 各自只让"自己那个组件"重渲染。
 *
 * @param {number} step 进度变化小于该值时不触发重渲染（百分比），默认 1
 */
export default function useScrollProgress(step = 1) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
        const percent =
          maxScroll <= 1 ? 100 : Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        setProgress((prev) => (Math.abs(prev - percent) < step ? prev : percent));
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [step]);

  return progress;
}
