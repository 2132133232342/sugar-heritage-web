/**
 * 文件：src/config/pageTransition.js
 * 作用：「一勺糖稀 · 非遗百年」全站滚动式换页与过渡动画参数唯一事实源
 * 说明：修改本文件参数即可直接调整全站换页阈值、时长、缓动、位移与开关，无需修改逻辑代码。
 */

export const PAGE_TRANSITION_CONFIG = {
  enabled: true,                       // 总开关
  mode: 'boundary-snap',               // 'boundary-snap' 边界触发 | 'off'
  pageOrder: ['/cover', '/', '/archive', '/studio', '/scroll', '/comic', '/film', '/about'],
  wheelThreshold: 60,                  // 滚轮 deltaY 累计阈值（px）
  touchThreshold: 56,                  // 触摸纵向位移阈值（px）
  edgeTolerance: 4,                    // 判定触底/触顶容差（px）
  cooldown: 700,                       // 两次切换最小间隔（ms）
  lockDuringTransition: true,          // 过渡期间上锁
  duration: 420,                       // 过渡时长（ms）
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // 缓动曲线
  distance: 24,                        // 进出场位移（px）
  snapFullScreen: false,               // 是否吸附整屏；因 /scroll 长卷须保持 false
  wrapAround: false,                   // 首尾是否循环
  keyboardEnabled: true,               // 是否启用 PageDown/PageUp/方向键/Home/End 换页
  mobileEnabled: true,                 // 移动端是否启用触摸边界换页
  respectReducedMotion: true           // 命中 prefers-reduced-motion 时改为瞬时切换
};

/**
 * 页面元信息映射表（用于更新 document.title 与 aria-live 读屏播报）
 */
export const PAGE_META_MAP = {
  '/cover': {
    name: '卷首封面',
    title: '一勺糖稀 · 非遗百年 — 卷首'
  },
  '/': {
    name: '首页',
    title: '一勺糖稀 · 非遗百年 — 首页'
  },
  '/archive': {
    name: '档案库',
    title: '中华糖艺流派与四法图谱 — 档案库'
  },
  '/studio': {
    name: '互动工坊',
    title: '掌中熬糖与十二生肖吹塑实验室 — 互动工坊'
  },
  '/scroll': {
    name: '叙事长卷',
    title: '滚轮看完糖人的一生 — 叙事长卷'
  },
  '/comic': {
    name: '条漫',
    title: '盛京糖韵 · 游古都 — 条漫'
  },
  '/film': {
    name: '影片',
    title: '一勺糖稀 · 非遗百年 — 影片'
  },
  '/about': {
    name: '关于与合规',
    title: '学术文献出处与原创声明 — 关于与合规'
  }
};
