/**
 * 文件：src/components/SealStamp.jsx
 * 作用：【B-5】落印洇墨通用达成反馈组件
 * 规范：
 * 1. 印章从 scale(1.35) rotate(-6deg) 落到 scale(1) rotate(0)，缓动 cubic-bezier(.2, 1.4, .4, 1)。
 * 2. 同时一层朱砂墨迹以 radial-gradient 从中心向外扩散（opacity 0.5 -> 0.12，约 260ms）。
 * 3. 全站既有静态印（导航“糖”字、页脚“印”、各页牌匾小印）通过 onceKey 记录首次出现只播一次，之后保持静态。
 * 4. 挂进 prefers-reduced-motion 全局降级（瞬时出现）。
 */
import React, { useState, useEffect } from 'react';

// 模块级集合：记录已播放过首次落印动画的静态印章 ID，防止路由来回切换时重复播放
const playedStaticSeals = new Set();

export default function SealStamp({
  text = '印',
  size = 24,
  onceKey = '',
  animate = true,
  className = '',
  style = {}
}) {
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (!animate) return false;
    if (onceKey) {
      if (playedStaticSeals.has(onceKey)) {
        return false;
      }
      playedStaticSeals.add(onceKey);
    }
    return true;
  });

  useEffect(() => {
    if (!animate) return;
    if (onceKey && playedStaticSeals.has(onceKey)) return;
    setShouldAnimate(true);
    if (onceKey) {
      playedStaticSeals.add(onceKey);
    }
  }, [animate, onceKey, text]);

  const isLarge = size >= 44;

  return (
    <span
      className={`cinnabar-seal-mini ${shouldAnimate ? 'seal-drop-active' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: isLarge ? '0.92rem' : `${Math.max(11, Math.round(size * 0.52))}px`,
        position: style.position || 'relative',
        ...style
      }}
      aria-hidden="true"
    >
      {/* 朱砂墨迹 radial-gradient 向外洇开层 */}
      {shouldAnimate && <span className="seal-ink-bleed" />}
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
    </span>
  );
}