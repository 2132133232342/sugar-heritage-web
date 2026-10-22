/**
 * 文件：src/assets/textures.js
 * 作用：【B-1】四种分层非遗材质库（纯 SVG 生成 Data-URI，零位图、零网络请求）
 * 自检修复：
 * 1. 修正 copperPatina 中 feTurbulence type='turbulence' 的大小写规范（SVG 规范要求全小写）。
 * 2. 严守“只在小面积元素上使用滤镜，禁止对大面积滚动区或 canvas 应用 SVG filter”：
 *    大面积背景（bambooPaper / xuanPaperFiber）采用极轻量纯矢量帘纹/纤维线与微噪点，零 feDisplacementMap 大面积重绘开销；
 *    仅在小面积石板与铜器点缀上使用精细纹理。
 */

export const TEXTURE_URIS = {
  // 1. 宣纸纤维（全局卡片底，轻量级微纤维纹理）
  xuanPaperFiber:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23412402' stroke-width='0.8' stroke-opacity='0.035' stroke-linecap='round'%3E%3Cpath d='M12,18 Q28,12 42,22 M74,14 Q92,24 108,16 M22,64 Q40,56 58,68 M68,88 Q86,78 104,92 M16,104 Q34,96 52,108'/%3E%3C/g%3E%3C/svg%3E\")",

  // 2. 竹纸（长卷区与卷轴时间线，轻量级横向竹帘暗纹，大面积滚动零掉帧）
  bambooPaper:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='24' viewBox='0 0 80 24'%3E%3Cg fill='none' stroke='%23BA7517' stroke-linecap='round'%3E%3Cline x1='0' y1='6' x2='80' y2='6' stroke-width='0.7' stroke-opacity='0.045'/%3E%3Cline x1='0' y1='12' x2='80' y2='12' stroke-width='0.5' stroke-opacity='0.03'/%3E%3Cline x1='0' y1='18' x2='80' y2='18' stroke-width='0.7' stroke-opacity='0.045'/%3E%3Cline x1='26' y1='0' x2='26' y2='24' stroke-width='0.6' stroke-opacity='0.025'/%3E%3Cline x1='64' y1='0' x2='64' y2='24' stroke-width='0.6' stroke-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",

  // 3. 大理石板（成都糖画小画板专用，feTurbulence + feDisplacementMap 生成天然石板云斑肌理）
  marbleSlab:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.045' numOctaves='2' seed='7' stitchTiles='stitch' result='turb'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='turb' scale='8'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23F1EFE8'/%3E%3Crect width='160' height='160' filter='url(%23marble)' fill='%23412402' opacity='0.055'/%3E%3C/svg%3E\")",

  // 4. 铜氧化斑（五件套图标底衬与遗憾博物馆小图标框专用，修正 type='turbulence' 小写规范）
  copperPatina:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cfilter id='copper'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.11' numOctaves='2' stitchTiles='stitch' result='c'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='c' scale='5'/%3E%3C/filter%3E%3Crect width='96' height='96' filter='url(%23copper)' fill='%23712B13' opacity='0.055'/%3E%3C/svg%3E\")"
};

/**
 * 将四种材质与纹样变量注入 document.documentElement，方便 CSS 直接通过 var(--tex-*) 引用
 */
export function injectTextureVariables(patternUris = {}) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--tex-xuan', TEXTURE_URIS.xuanPaperFiber);
  root.style.setProperty('--tex-bamboo', TEXTURE_URIS.bambooPaper);
  root.style.setProperty('--tex-marble', TEXTURE_URIS.marbleSlab);
  root.style.setProperty('--tex-copper', TEXTURE_URIS.copperPatina);

  Object.entries(patternUris).forEach(([key, val]) => {
    root.style.setProperty(`--pat-${key}`, val);
  });
}