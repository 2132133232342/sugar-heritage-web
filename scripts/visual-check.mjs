/**
 * 视觉回归测试：用系统 Edge 驱动页面，抓控制台错误并分进度截图。
 * 用法：node scripts/visual-check.mjs
 */
import { createRequire } from 'node:module';

// 从受管 node workspace 加载 playwright-core（ESM 不认 NODE_PATH，用 createRequire）
const require = createRequire(
  'C:/Users/62610/.workbuddy/binaries/node/workspace/node_modules/index.js'
);
const { chromium } = require('playwright-core');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const FILE = 'file:///C:/Users/62610/AppData/Local/Temp/sugar-plain.html';

const shots = [
  { route: '#/', scroll: 0, name: 'check-home.png' },
  { route: '#/studio', scroll: 0, name: 'check-studio.png' },
  { route: '#/archive', scroll: 0.0, name: 'check-archive.png' },
  { route: '#/scroll', scroll: 0.0, name: 'check-scroll-act1.png' },
  { route: '#/scroll', scroll: 0.93, name: 'check-scroll-act4.png' },
  { route: '#/about', scroll: 0, name: 'check-about.png' }
];

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    console.log(`[console.${msg.type()}]`, msg.text().slice(0, 200));
  }
});
page.on('pageerror', (err) => console.log('[pageerror]', err.message.slice(0, 300)));

for (const shot of shots) {
  await page.goto(FILE + shot.route, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  // 归零滚动位置，避免 hash 路由切换时沿用上一页的滚动位置
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(150);
  if (shot.scroll > 0) {
    await page.evaluate((ratio) => {
      document.documentElement.style.scrollBehavior = 'auto';
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, max * ratio);
    }, shot.scroll);
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: shot.name });
  console.log('已截图:', shot.name, `(滚动比例 ${shot.scroll})`);
}

await browser.close();
console.log('完成');
