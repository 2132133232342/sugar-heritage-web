import React from 'react';
import SealStamp from './SealStamp';

const ROUTE_SEAL_CHAR = {
  '/cover': '首',
  '/': '序',
  '/archive': '馆',
  '/studio': '坊',
  '/scroll': '卷',
  '/about': '信'
};

/**
 * 文件：src/components/PageTransition.jsx
 * 作用：包裹 <Routes> 的合成层过渡动画容器 + 无障碍 aria-live 读屏播报区 + 【B-5】换页完成落印反馈
 */
export default function PageTransition({
  children,
  locationKey,
  isTransitioning,
  direction = 'forward',
  effectiveDuration = 420,
  effectiveDistance = 24,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  announcement = '',
  onTransitionComplete
}) {
  const animClass =
    effectiveDuration <= 0
      ? 'page-transition-instant'
      : direction === 'backward'
      ? 'page-enter-backward'
      : 'page-enter-forward';

  const stageStyle = {
    '--pt-duration': `${effectiveDuration}ms`,
    '--pt-easing': easing,
    '--pt-distance': `${effectiveDistance}px`,
    willChange: isTransitioning && effectiveDuration > 0 ? 'transform, opacity' : 'auto'
  };

  const sealChar = ROUTE_SEAL_CHAR[locationKey] || '印';

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* 【B-5】换页完成右上角朱砂落印反馈（pointer-events: none 不挡任何操作）
          ⚠️ 必须放在 .page-transition-stage 之外：stage 在动画期间与结束后都带有 transform，
          transform 会让 position: fixed 退化为「相对该祖先定位」，位置会偏低且跟着页面滚动。 */}
      <div
        style={{
          position: 'fixed',
          top: 'calc(var(--nav-height) + 12px)',
          right: '18px',
          zIndex: 900,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      >
        <SealStamp key={`route-seal-${locationKey}`} text={sealChar} size={22} animate />
      </div>

      <div
        key={locationKey}
        className={`page-transition-stage ${animClass}`}
        style={stageStyle}
        onAnimationEnd={(e) => {
          if (e.currentTarget === e.target && onTransitionComplete) {
            onTransitionComplete();
          }
        }}
      >
        {children}
      </div>
    </>
  );
}