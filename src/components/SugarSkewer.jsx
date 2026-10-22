import React, { useId, useMemo } from 'react';

/**
 * 文件：src/components/SugarSkewer.jsx
 * 作用：可复用的「小糖葫芦」贴纸组件（竹签串糖壳果）
 *
 * 设计约束：
 * - 果色只走站内既有朱砂 #B91C1C → 焦糖 #712B13 渐变，糖壳高光用宣纸米白，零新色相；
 * - 与 SugarFigure 共用同一套 100×142 画布与竹签形制，两者并排时粗细一致；
 * - 渐变 id 用 useId 保证多例并存不冲突；
 * - 纯装饰：aria-hidden + pointer-events: none；摇曳动画挂 prefers-reduced-motion 降级。
 */
export default function SugarSkewer({ cls = '', count = 4 }) {
  const rawId = useId();
  const gid = useMemo(() => `sk-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`, [rawId]);

  // 果串中心点：自上而下等距，间距略小于直径，呈现糖葫芦特有的"叠串"感
  const berries = useMemo(() => {
    const step = 27;
    const first = 42;
    return Array.from({ length: count }, (_, i) => first + i * step);
  }, [count]);

  return (
    <svg
      viewBox="0 0 100 142"
      className={`sugar-skewer ${cls}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gid} x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#712B13" />
        </linearGradient>
      </defs>

      {/* 竹签 */}
      <line
        x1="50"
        y1="16"
        x2="50"
        y2="136"
        stroke="#BA7517"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* 糖壳果串 */}
      {berries.map((cy, idx) => (
        <g key={`berry-${idx}`}>
          <circle
            cx="50"
            cy={cy}
            r="13"
            fill={`url(#${gid})`}
            stroke="#412402"
            strokeWidth="1.8"
          />
          {/* 糖壳反光 */}
          <ellipse cx="45" cy={cy - 5} rx="4.4" ry="2.9" fill="#FFFDF8" fillOpacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
