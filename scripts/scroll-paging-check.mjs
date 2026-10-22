/**
 * 滚动换页功能验收测试：用系统 Edge 驱动单文件版，实测
 *   T1 手动导航直通 / T2 边界下滑换下一页 / T3 边界上滑回上一页
 *   T4 长卷内部滚动不被劫持 / T5 键盘 PageDown / T6 冷却期内只前进一页
 * 用法：node scripts/scroll-paging-check.mjs   （BASE 环境变量可覆盖目标）
 */
import { createRequire } from 'node:module';

const require = createRequire(
  'C:/Users/62610/.workbuddy/binaries/node/workspace/node_modules/index.js'
);
const { chromium } = require('playwright-core');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const FILE = process.env.BASE || 'file:///C:/Users/62610/AppData/Local/Temp/sugar-plain.html';

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') {
    errors.push(`[${m.type()}] ${m.text().slice(0, 180)}`);
  }
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message.slice(0, 200)}`));

const hash = () => page.evaluate(() => location.hash || '#/');
const title = () => page.evaluate(() => document.title);
const activeEl = () =>
  page.evaluate(() => {
    const a = document.activeElement;
    return a ? `${a.tagName}.${String(a.className || '').split(' ')[0]}` : 'none';
  });

async function goto(route) {
  await page.goto(FILE + route, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
}
async function toBottom() {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(600);
}
async function wheel(times, dy, gap = 130) {
  await page.mouse.move(720, 450);
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, dy);
    await page.waitForTimeout(gap);
  }
  await page.waitForTimeout(850);
}

// ---------- T1 手动导航直通（点击导航应精确跳转并更新标题/焦点） ----------
await goto('#/');
await page.click('.nav-link-item:has-text("档案")');
await page.waitForTimeout(700);
console.log(`T1 手动点击「档案库」 → hash=${await hash()} | title=${await title()} | focus=${await activeEl()}`);

// ---------- T2 首页触底继续下滑 → 下一页 ----------
await goto('#/');
await toBottom();
await wheel(3, 140);
console.log(`T2 首页触底继续下滑 → hash=${await hash()}`);

// ---------- T3 档案库顶部（停稳后）继续上滑 → 上一页 ----------
await goto('#/archive');
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
});
await page.waitForTimeout(750);
await wheel(2, -140);
console.log(`T3 档案库顶部停稳后上滑 → hash=${await hash()}`);

// ---------- T4 长卷内部滚动不被劫持 ----------
await goto('#/scroll');
const y0 = await page.evaluate(() => Math.round(window.scrollY));
await wheel(4, 160);
const y1 = await page.evaluate(() => Math.round(window.scrollY));
console.log(`T4 长卷中部滚轮 → hash=${await hash()} | scrollY ${y0} → ${y1}`);

// ---------- T5 键盘 PageDown（触底后） ----------
await goto('#/');
await toBottom();
await page.keyboard.press('PageDown');
await page.waitForTimeout(850);
console.log(`T5 首页触底 PageDown → hash=${await hash()}`);

// ---------- T6 冷却：触底后连续快滑，冷却期内只前进一页 ----------
await goto('#/');
await toBottom();
await wheel(3, 200, 90);
console.log(`T6 首页触底后 3 连快滑(90ms 间隔) → hash=${await hash()}（冷却期内应只前进 1 页 = #/archive）`);

// ---------- T7 新路由链式换页：/scroll 触底 → /comic → /film ----------
await page.goto(FILE + '#/scroll', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, document.documentElement.scrollHeight);
});
await page.waitForTimeout(700);
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 140);
await page.waitForTimeout(160);
await page.mouse.wheel(0, 140);
await page.waitForTimeout(1000);
const afterComic = await page.evaluate(() => location.hash);
console.log(`T7a 长卷触底继续下滑 → hash=${afterComic}（应为 #/comic）`);

// 条漫页继续触底下滑 → /film
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, document.documentElement.scrollHeight);
});
await page.waitForTimeout(700);
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 140);
await page.waitForTimeout(160);
await page.mouse.wheel(0, 140);
await page.waitForTimeout(1000);
const afterFilm = await page.evaluate(() => location.hash);
console.log(`T7b 条漫触底继续下滑 → hash=${afterFilm}（应为 #/film）`);

await page.screenshot({ path: 'check-paging-final.png' });
console.log('');
console.log('控制台错误/警告：', errors.length ? errors : '无（0 条）');

await browser.close();
console.log('完成');
