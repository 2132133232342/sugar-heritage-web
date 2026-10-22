/**
 * 路由配置静态预检：在跑 Playwright 交互测试之前，先用最低成本验证
 * src/config/pageTransition.js 的路由顺序与元数据是否完好。
 *
 * 说明（2026-10-22）：
 *   本文件源自外部脚本，但做了三处修正后单独存放，**没有替换**
 *   scripts/scroll-paging-check.mjs —— 那个脚本会真的启动 Edge 实测换页交互，
 *   能抓到白屏、地图不渲染、页脚溢出等运行时问题；静态检查抓不到这些，两者互补。
 *   修正点：
 *   ① 原「正向链路」「逆向链路」两个测试是恒真命题（对任意不重复数组都成立），已改为有意义的校验
 *   ② 原脚本写死 8 个路由，在当前（尚未接入 /comic、/film）会直接 FAIL；
 *      改为「已知路由必须在场且相对顺序正确，额外路由只提示不判失败」
 *   ③ 补充重复路由检测（重复项会让 indexOf 导航错乱）
 *
 * 用法：node scripts/route-config-check.mjs
 */
import { PAGE_TRANSITION_CONFIG, PAGE_META_MAP } from '../src/config/pageTransition.js';

const { pageOrder } = PAGE_TRANSITION_CONFIG;

console.log('\n========================================');
console.log('   一勺糖稀 · 路由配置静态预检');
console.log('========================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// 1. 已知路由必须全部在场，且相对顺序正确（允许后续新增路由）
const KNOWN_ORDER = ['/cover', '/', '/archive', '/studio', '/scroll', '/about'];
const missing = KNOWN_ORDER.filter((p) => !pageOrder.includes(p));
assert(missing.length === 0, `已知路由全部在场（缺失：${missing.join(', ') || '无'}）`);

let lastIdx = -1;
let orderOk = true;
for (const p of KNOWN_ORDER) {
  const idx = pageOrder.indexOf(p);
  if (idx < lastIdx) orderOk = false;
  lastIdx = idx;
}
assert(orderOk, `已知路由相对顺序正确：${KNOWN_ORDER.join(' -> ')}`);

// 2. 无重复路由（重复项会让 indexOf 定位错乱，是历次故障源）
const dup = pageOrder.filter((p, i) => pageOrder.indexOf(p) !== i);
assert(dup.length === 0, `无重复路由（重复：${dup.join(', ') || '无'}）`);

// 3. 每个路由都有规范的 name 与 title
const metaOk = pageOrder.every((p) => {
  const meta = PAGE_META_MAP[p];
  return meta && typeof meta.name === 'string' && typeof meta.title === 'string' && meta.title.length > 0;
});
assert(metaOk, '所有路由在 PAGE_META_MAP 中元数据完整（无死链、无空白标题）');

// 4. 首尾边界：封面在最前、关于与合规矩在最后
assert(pageOrder[0] === '/cover', '首页为 /cover（卷首封面，落地页）');
assert(pageOrder[pageOrder.length - 1] === '/about', '末页为 /about（关于与合规，封底）');

// 5. title 命名规范：统一「主标题 — 页面名」结构（用分隔符判定，避免维护前缀白名单）
const titleNsOk = pageOrder.every((p) => {
  const t = PAGE_META_MAP[p].title;
  return typeof t === 'string' && t.includes(' — ') && t.split(' — ').length === 2 && t.split(' — ')[1].length > 0;
});
assert(titleNsOk, '全站 document.title 均为「主标题 — 页面名」结构');

// 6. 换页总开关与移动端开关未被误关
assert(PAGE_TRANSITION_CONFIG.enabled === true, '滚动换页总开关 enabled 为 true');
assert(PAGE_TRANSITION_CONFIG.mobileEnabled === true, '移动端触摸换页 mobileEnabled 为 true');

const extras = pageOrder.filter((p) => !KNOWN_ORDER.includes(p));
if (extras.length) {
  console.log(`\n  [INFO] 检测到新增路由：${extras.join(', ')}（已知 ${pageOrder.length} 页）`);
}

console.log(`\n测试结论: ${passCount} 项通过${failCount ? `、${failCount} 项失败` : ''}。\n`);
if (failCount) process.exitCode = 1;
