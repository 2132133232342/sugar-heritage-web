/**
 * 单文件构建脚本：把 dist/ 的 JS / CSS / GeoJSON / 图片全部内联进一个 HTML。
 * 产物特点：
 *   - 零外部请求，双击即可打开（file:// 也能跑，因为 JS 为经典脚本、无 module 语法）
 *   - HashRouter + 内联地图数据 + 内联条漫/封面图，断网 / 任意目录 / 任意静态托管均可用
 *   - 视频 mp4 一律不内联（体积不允许），由组件侧的静帧降级逻辑接管
 *
 * 本次合并说明（2026-10-22）：
 *   从外部脚本中采纳了两个有价值的想法，并修正了它的问题：
 *   ① 注入 window.__SINGLE_FILE_BUILD__ 标识 —— 保留，供 FilmEmbed 等组件做零延迟降级
 *   ② 把 comic/ 与 videos/ 下的图片转 base64 内联 —— 保留，但**改为资源映射表**而非正则替换
 *      （原脚本用正则替换 HTML 里的 src="./comic/..."，但 React 是在运行时才设置 src 的，
 *       静态 HTML 里根本匹配不到，那条正则会完全落空）
 *   ③ 原脚本体积超阈值时 process.exit(1) —— 改为警告。构建失败比体积超标更糟，
 *      且条漫内联后体积本来就会涨，硬失败会直接掐断 npm run build:single。
 *   ④ 原脚本只内联图片、完全丢弃了 JS/CSS/GeoJSON 内联 —— **未采纳**，
 *      那样产出的"单文件"里没有任何应用代码，直接白屏。
 *
 * 用法：先 npm run build，再 node scripts/build-single.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const outDir = join(root, 'dist-single');

const html = readFileSync(join(distDir, 'index.html'), 'utf8');

const assetDir = join(distDir, 'assets');
const jsFile = readdirSync(assetDir).find((f) => f.endsWith('.js'));
// iife 构建下 Vite 会把 CSS 内联进 JS，此时没有独立的 .css 产物
const cssFile = readdirSync(assetDir).find((f) => f.endsWith('.css'));
if (!jsFile) {
  console.error('未找到构建产物，请先执行 npm run build');
  process.exit(1);
}

const js = readFileSync(join(assetDir, jsFile), 'utf8');
const css = cssFile ? readFileSync(join(assetDir, cssFile), 'utf8') : '';
const geo = readFileSync(join(distDir, 'chinaGeo.json'), 'utf8');

// 防止内联内容里出现 </script> 提前闭合标签
const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
const safeGeo = geo.replace(/<\/script>/gi, '<\\/script>');

let out = html
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/i, '')
  .replace(/<link[^>]*rel="stylesheet"[^>]*>/i, '')
  .replace(/<link[^>]*href="[^"]*\.css"[^>]*>/i, '');

// favicon 位于 dist 根目录，不在 comic/videos 子目录里，因此不会被下面的资源表收录；
// 单文件版里 ./favicon.svg 会 ERR_FILE_NOT_FOUND —— 这里直接内联成 data URI。
const faviconPath = join(distDir, 'favicon.svg');
if (existsSync(faviconPath)) {
  const faviconData = `data:image/svg+xml;base64,${readFileSync(faviconPath).toString('base64')}`;
  out = out.replace(
    /(<link[^>]*rel="(?:icon|apple-touch-icon)"[^>]*href=")[^"]*(")/gi,
    `$1${faviconData}$2`
  );
}

// ---------------------------------------------------------------------------
// 单文件环境标识（放进 <head>，确保组件在任何渲染之前就能读到）
// ---------------------------------------------------------------------------
if (out.includes('</head>')) {
  out = out.replace('</head>', '  <script>window.__SINGLE_FILE_BUILD__=true;</script>\n</head>');
} else {
  out = out.replace('<body', '<script>window.__SINGLE_FILE_BUILD__=true;</script>\n<body');
}

// ---------------------------------------------------------------------------
// 图片内联：扫描 dist/comic 与 dist/videos 下的位图/矢量，转 base64 成资源映射表。
// 组件侧用 src/utils/inlineAssets.js 的 resolveAsset() 读取。
// 视频（.mp4）一律跳过 —— 体积不允许内联，交给组件降级逻辑。
// ---------------------------------------------------------------------------
const IMAGE_DIRS = ['comic', 'videos'];
const IMAGE_EXTS = ['.webp', '.svg', '.png', '.jpg', '.jpeg'];
// 视频也内联（用户要求"把视频也装进去"）：已二压到 5.35MB（854×480 CRF30，原 24.5MB），
// base64 后约 7.1MB，单文件总计约 8.7MB。上限设 8MB，超出则不内联、由组件降级。
const VIDEO_EXTS = ['.mp4'];
const MAX_IMAGE_ASSET = 400 * 1024;
const MAX_VIDEO_ASSET = 8 * 1024 * 1024;
const inlineAssets = {};
let inlineAssetBytes = 0;
const skippedAssets = [];

for (const dir of IMAGE_DIRS) {
  const absDir = join(distDir, dir);
  if (!existsSync(absDir)) continue;
  for (const file of readdirSync(absDir)) {
    const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
    const isVideo = VIDEO_EXTS.includes(ext);
    const isImage = IMAGE_EXTS.includes(ext);
    if (!isVideo && !isImage) continue;
    const abs = join(absDir, file);
    const size = statSync(abs).size;
    const cap = isVideo ? MAX_VIDEO_ASSET : MAX_IMAGE_ASSET;
    if (size > cap) {
      skippedAssets.push(`${dir}/${file}（${(size / 1024 / 1024).toFixed(1)}MB 超 ${cap / 1024 / 1024}MB 上限）`);
      continue;
    }
    const mime = isVideo
      ? 'video/mp4'
      : ext === '.svg'
      ? 'image/svg+xml'
      : ext === '.webp'
      ? 'image/webp'
      : `image/${ext.slice(1)}`;
    const base64 = readFileSync(abs).toString('base64');
    // 只注册「./dir/file」一种键：若同时注册不带 ./ 的键，JSON.stringify 会把
    // 同一长 base64 串写两遍，单文件体积直接翻倍（2026-10-22 实测白涨 307KB）。
    // 组件侧 resolveAsset() 会自行归一化键名，两种写法都能命中。
    inlineAssets[`./${dir}/${file}`] = `data:${mime};base64,${base64}`;
    inlineAssetBytes += base64.length;
  }
}

const safeAssetMap = JSON.stringify(inlineAssets).replace(/<\/script>/gi, '<\\/script>');

const inject = `
${css ? `  <style>${css}</style>` : ''}
  <script>window.__CHINA_GEO__=${safeGeo};</script>
  <script>window.__INLINE_ASSETS__=${safeAssetMap};</script>
  <script>${safeJs}</script>
`;

if (out.includes('</body>')) {
  out = out.replace('</body>', `${inject}\n</body>`);
} else {
  out += inject;
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, '糖人网站-单文件版.html');
writeFileSync(outPath, out, 'utf8');

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
// 体积阈值：接入条漫 + 影片后单文件约 9.1MB，构成为：
//   JS 794KB + 地图 GeoJSON 569KB + 条漫 6 张 WebP 约 613KB + 影片 5.35MB(base64 后约 7.1MB)。
// 影片已二压：1280×720 24.5MB → 854×480 CRF30 5.35MB（22%），用 imageio-ffmpeg 附带
// 的 ffmpeg 7.1 完成；封面为 35.5s 处真实抽帧 WebP 55KB。
// 若日后需再瘦身：降到 640×360 CRF32 可压到约 3MB，或改为外置 mp4 + 静帧降级。
const SIZE_LIMIT = 10 * 1024 * 1024;
console.log('单文件已生成：', outPath);
console.log(`  内联 JS  ${kb(Buffer.byteLength(safeJs))}`);
console.log(`  内联 CSS ${css ? kb(Buffer.byteLength(css)) : '已内联进 JS'}`);
console.log(`  内联地图 ${kb(Buffer.byteLength(safeGeo))}`);
console.log(
  `  内联图片 ${Object.keys(inlineAssets).length ? `${kb(inlineAssetBytes)}（${new Set(Object.values(inlineAssets)).size} 张）` : '无（本次没有 comic/ 或 videos/ 图片）'}`
);
if (skippedAssets.length) {
  console.log(`  跳过内联 ${skippedAssets.join('、')}`);
}
console.log(`  总计     ${kb(Buffer.byteLength(out))}`);

// 体积超阈值只警告、不失败：构建被掐断比体积超标更难收拾
if (Buffer.byteLength(out) > SIZE_LIMIT) {
  console.warn(
    `⚠️ 警告：单文件体积 ${kb(Buffer.byteLength(out))} 超过 10MB 验收阈值。` +
      `请检查是否有位图未转 WebP，或考虑让条漫走窄栏小图。`
  );
} else {
  console.log('  ✅ 体积验收合格 (<= 10 MB)');
}
