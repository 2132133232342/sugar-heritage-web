import React, { useMemo, useId } from 'react';
import { ZODIAC_DATA } from '../pages/Studio';

/**
 * 文件：src/components/SugarFigure.jsx
 * 作用：可复用的「小糖人」装饰组件（插在竹签上的吹糖人矢量）
 *
 * 设计约束：
 * - 矢量直接复用 Studio 的 ZODIAC_DATA（十二生肖糖人），不重画、不引入新素材；
 * - 配色只走琥珀三阶 + 深褐墨线 + 宣纸高光，零新色相；
 * - 每例用 React.useId 生成独立渐变 id，多例并存不冲突；
 * - 纯装饰：aria-hidden，pointer-events: none，不拦截任何点击；
 * - 摇曳动画挂进 prefers-reduced-motion 全局降级。
 *
 * @param {string} id    生肖 id（rat/ox/tiger/rabbit/dragon/snake/horse/... ）
 * @param {string} cls  额外 className（用于封面定位）
 */
export default function SugarFigure({ id = 'rat', cls = '' }) {
  // ⚠️ useId 必须在组件顶层调用，绝不能塞进 useMemo 的回调里——
  //   那会破坏 hook 顺序，触发 React #300「Too many re-renders」直接把整站搞崩（本次实测）。
  const rawId = useId();
  const uid = useMemo(() => rawId.replace(/[^a-zA-Z0-9]/g, ''), [rawId]);
  const item = useMemo(
    () => ZODIAC_DATA.find((z) => z.id === id) || ZODIAC_DATA[0],
    [id]
  );

  const gradientId = `sf-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 100 142"
      className={`sugar-figure ${cls}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAC775" />
          <stop offset="55%" stopColor="#EF9F27" />
          <stop offset="100%" stopColor="#BA7517" />
        </linearGradient>
      </defs>

      {/* 竹签（糖人插在签上，庙会摊位即此形制） */}
      <line
        x1="50"
        y1="84"
        x2="50"
        y2="132"
        stroke="#BA7517"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <line
        x1="43"
        y1="132"
        x2="57"
        y2="132"
        stroke="#BA7517"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* 糖人体 */}
      <path
        d={item.path}
        fill={`url(#${gradientId})`}
        stroke="#412402"
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 签座 */}
      <ellipse cx="50" cy="82.5" rx="4.8" ry="2" fill="#EF9F27" stroke="#412402" strokeWidth="2" />

      {/* 糖壳深浅斑 */}
      {item.patches &&
        item.patches.map((patch, idx) => (
          <path
            key={`patch-${idx}`}
            d={patch.d}
            fill={patch.fill}
            fillOpacity={patch.opacity}
          />
        ))}

      {/* 五官与纹样 */}
      {item.featureFillPath && (
        <path d={item.featureFillPath} fill="#412402" fillOpacity="0.85" />
      )}
      {item.featureStrokePath && (
        <path
          d={item.featureStrokePath}
          fill="none"
          stroke="#412402"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {item.cloudPath && <path d={item.cloudPath} fill="#FFFDF8" fillOpacity="0.5" />}

      {item.dots &&
        item.dots.map((dot, idx) => (
          <circle key={`dot-${idx}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
        ))}
      {item.eyes &&
        item.eyes.map((eye, idx) => (
          <circle key={`eye-${idx}`} cx={eye.cx} cy={eye.cy} r={eye.r} fill="#412402" />
        ))}
    </svg>
  );
}
