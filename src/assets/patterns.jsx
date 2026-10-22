/**
 * 文件：src/assets/patterns.js
 * 作用：【B-1】糖艺纹样库（5 种传统纹样 + 4 种糖艺本行物象纹样）
 * 规范：
 * - 线条统一 1.2px 圆头；颜色仅使用 #BA7517 (--sugar-600) 与 #412402 (--text-main) 的低透明度变体，零新色相。
 * - 每种纹样同时提供 CSS data-uri 背景版（PATTERN_URIS）与 React SVG 组件版（PatternSvgDefs / PatternDivider）。
 */
import React from 'react';

/**
 * 9 种纹样 Data-URI 字典（可直接用于 CSS background-image，总体积 < 4KB，零网络请求）
 */
export const PATTERN_URIS = {
  // 1. 如意云纹（从糖人胸口抽出统一）
  ruyiCloud:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='24' viewBox='0 0 32 24'%3E%3Cpath d='M10,12 Q16,4 22,12 Q16,20 10,12 Z' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.22'/%3E%3C/svg%3E\")",

  // 2. 回纹（万字不到头，用于牌匾四边包边与区块分隔）
  fretMeander:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M2,22 L2,2 L22,2 L22,18 L6,18 L6,6 L18,6 L18,14 L10,14 L10,10 L14,10' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.28'/%3E%3C/svg%3E\")",

  // 3. 冰裂纹（专属“糖壳/糖片”意象：纪念卡边框、糖画成品、一吹一融将融态、遗憾博物馆）
  iceCrackle:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M0,12 L18,20 L12,40 L0,44 M18,20 L36,8 L48,14 M36,8 L32,0 M12,40 L34,34 L48,42 M34,34 L38,14 M12,40 L16,48' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.2'/%3E%3C/svg%3E\")",

  // 4. 铜钱纹（庙会吉庆底纹）
  coinPattern:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='10' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-opacity='0.16'/%3E%3Crect x='11' y='11' width='6' height='6' rx='1' fill='none' stroke='%23412402' stroke-width='1.2' stroke-opacity='0.14'/%3E%3C/svg%3E\")",

  // 5. 缠枝莲（传统藤蔓柔弧）
  lotusScroll:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Cpath d='M0,12 Q10,2 20,12 T40,12 M10,7 Q14,12 10,17 M30,7 Q26,12 30,17' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-linecap='round' stroke-opacity='0.18'/%3E%3C/svg%3E\")",

  // 6. 糖泡群（2~3 枚大小不一的半透明圆成组，用于进度点与徽标背景）
  sugarBubbles:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='12' cy='14' r='6' fill='%23FAC775' fill-opacity='0.16' stroke='%23BA7517' stroke-width='1.2' stroke-opacity='0.24'/%3E%3Ccircle cx='24' cy='10' r='3.5' fill='%23EF9F27' fill-opacity='0.14' stroke='%23BA7517' stroke-width='1.2' stroke-opacity='0.2'/%3E%3Ccircle cx='22' cy='24' r='4.5' fill='%23FAC775' fill-opacity='0.12' stroke='%23BA7517' stroke-width='1.2' stroke-opacity='0.18'/%3E%3C/svg%3E\")",

  // 7. 糖丝网格（细密交叉的琥珀糖丝，用于长卷分幕分隔与拔丝台背景）
  sugarSilkGrid:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M0,8 Q16,14 32,6 M0,24 Q16,18 32,26 M8,0 Q14,16 6,32 M24,0 Q18,16 26,32' fill='none' stroke='%23BA7517' stroke-width='1.2' stroke-linecap='round' stroke-opacity='0.15'/%3E%3C/svg%3E\")",

  // 8. 竹签斜栅（平行斜线组，用于卡片微底纹 opacity 0.04~0.06）
  bambooSlant:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M-2,6 L6,-2 M2,22 L22,2 M14,22 L22,14' fill='none' stroke='%23412402' stroke-width='1.2' stroke-linecap='round' stroke-opacity='0.055'/%3E%3C/svg%3E\")",

  // 9. 铜勺浇痕（一道不规则流淌浇痕，用于区块顶部装饰）
  ladlePourTrace:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='14' viewBox='0 0 120 14'%3E%3Cpath d='M4,7 Q22,2 42,8 T82,6 T116,7' fill='none' stroke='%23BA7517' stroke-width='2.2' stroke-linecap='round' stroke-opacity='0.32'/%3E%3Ccircle cx='116' cy='7' r='2.5' fill='%23EF9F27' fill-opacity='0.45'/%3E%3C/svg%3E\")"
};

/**
 * 全局可复用 SVG <defs> 符号与图案库（挂在 App 或单页 SVG 内供 <use> 与 fill="url(#...)" 调用）
 */
export function PatternSvgDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* 冰裂纹 SVG Pattern（供“将融尽”生肖表面釉裂直接 fill="url(#iceCracklePat)"） */}
        <pattern id="iceCracklePat" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0,6 L9,10 L6,20 L0,22 M9,10 L18,4 L24,7 M6,20 L17,17 L24,21 M17,17 L19,7"
            fill="none"
            stroke="#412402"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.42"
          />
        </pattern>

        {/* 糖泡群 SVG Pattern */}
        <pattern id="sugarBubblesPat" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="10" r="4.5" fill="#FAC775" fillOpacity="0.25" stroke="#BA7517" strokeWidth="1.2" strokeOpacity="0.35" />
          <circle cx="20" cy="8" r="2.5" fill="#EF9F27" fillOpacity="0.2" stroke="#BA7517" strokeWidth="1.2" strokeOpacity="0.3" />
          <circle cx="17" cy="20" r="3.5" fill="#FAC775" fillOpacity="0.2" stroke="#BA7517" strokeWidth="1.2" strokeOpacity="0.3" />
        </pattern>

        {/* 回纹 Symbol */}
        <symbol id="sym-fret-meander" viewBox="0 0 24 24">
          <path
            d="M3,21 L3,3 L21,3 L21,17 L7,17 L7,7 L17,7 L17,13 L11,13 L11,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>

        {/* 如意云纹 Symbol */}
        <symbol id="sym-ruyi-cloud" viewBox="0 0 24 18">
          <path
            d="M3,9 Q12,1 21,9 Q12,17 3,9 Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * 区块分隔线组件：支持 'cloud'（如意云纹）与 'fret'（回纹）交替使用，配铜勺浇痕糖丝渐隐线
 */
export function PatternDivider({ variant = 'cloud' }) {
  return (
    <div className="cloud-divider" role="separator" aria-hidden="true">
      <span className="cloud-divider-line left" />
      {variant === 'fret' ? (
        <svg viewBox="0 0 120 24" className="cloud-divider-svg">
          <g className="cloud-side-item" transform="translate(8, 2)" style={{ color: '#BA7517' }}>
            <use href="#sym-fret-meander" width="20" height="20" />
          </g>
          <g transform="translate(50, 2)" style={{ color: '#B91C1C' }}>
            <use href="#sym-fret-meander" width="20" height="20" />
          </g>
          <g className="cloud-side-item" transform="translate(92, 2)" style={{ color: '#BA7517' }}>
            <use href="#sym-fret-meander" width="20" height="20" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 120 24" className="cloud-divider-svg">
          <g className="cloud-side-item" transform="translate(-26, -34)">
            <path
              d="M44,46 Q50,38 56,46 Q50,54 44,46 Z"
              fill="#FAC775"
              stroke="#BA7517"
              strokeWidth="1.2"
            />
          </g>
          <g transform="translate(10, -34)">
            <path
              d="M44,46 Q50,38 56,46 Q50,54 44,46 Z"
              fill="#EF9F27"
              stroke="#B91C1C"
              strokeWidth="1.4"
            />
            <circle cx="50" cy="46" r="1.5" fill="#FFFDF8" />
          </g>
          <g className="cloud-side-item" transform="translate(46, -34)">
            <path
              d="M44,46 Q50,38 56,46 Q50,54 44,46 Z"
              fill="#FAC775"
              stroke="#BA7517"
              strokeWidth="1.2"
            />
          </g>
        </svg>
      )}
      <span className="cloud-divider-line right" />
    </div>
  );
}