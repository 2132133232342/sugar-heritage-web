/**
 * 文件：src/utils/inlineAssets.js
 * 作用：让单文件版也能自包含地引用 public/ 下的图片资源。
 *
 * 背景：scripts/build-single.mjs 会把 dist/comic 与 dist/videos 下的图片
 * （.webp/.svg/.png/.jpg，**不含 .mp4**）转成 base64，注入
 * window.__INLINE_ASSETS__ = { './comic/panel-1.webp': 'data:image/webp;base64,...' }。
 *
 * 组件里统一这样写：
 *   <img src={resolveAsset('./comic/panel-1.webp')} ... />
 *
 * 行为：
 *   - 目录版（普通 npm run build）：window.__INLINE_ASSETS__ 不存在 → 原样返回相对路径，零影响
 *   - 单文件版：命中则返回 data URI，实现真正的零外部请求
 *   - 未命中（例如视频 mp4，本来就不内联）：原样返回路径，由组件的降级逻辑接管
 */

const ASSET_MAP =
  typeof window !== 'undefined' && window.__INLINE_ASSETS__ ? window.__INLINE_ASSETS__ : null;

/** 归一化键：资源表只存「./dir/file」一种形式，查找时把传入路径补齐为该形式 */
function candidates(path) {
  if (typeof path !== 'string') return [];
  const withDot = path.startsWith('./') ? path : `./${path}`;
  return [withDot, path];
}

/**
 * 解析资源地址：单文件版优先返回内联 data URI，否则返回原路径。
 * @param {string} path 形如 './comic/panel-1.webp'
 * @returns {string}
 */
export function resolveAsset(path) {
  if (!ASSET_MAP) return path;
  for (const key of candidates(path)) {
    if (Object.prototype.hasOwnProperty.call(ASSET_MAP, key)) {
      return ASSET_MAP[key];
    }
  }
  return path;
}

/** 当前是否为单文件版构建（由 build-single.mjs 注入 window.__SINGLE_FILE_BUILD__） */
export function isSingleFileBuild() {
  return (
    typeof window !== 'undefined' && window.__SINGLE_FILE_BUILD__ === true
  );
}
