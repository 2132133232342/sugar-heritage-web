# 一勺糖稀 · 非遗百年 —— 吹糖人数字工坊

> 全国大学生数字媒体科技作品及创意竞赛 · 指定命题「民族文化 · 创新表达」
> 纯前端静态站点：无后端、无数据库、无外网 API 依赖，断网可用。

用原生 Canvas / SVG 代码把中国民间吹糖人与糖画的手艺重建到浏览器里：
手写十二生肖吹塑矢量、石板画糖、拔丝金线、一吹一融对照展、岁时节令、非遗档案地图。

---

## 页面结构（8 个路由）

| 路由 | 名称 | 内容 |
|------|------|------|
| `/cover` | 卷首封面 | 落地页：落印开场、启卷 CTA、两侧小糖人与糖葫芦装饰 |
| `/` | 首页 · 序 | 今日糖签、时辰徽标、三大传送门、糖的来路时间轴 |
| `/archive` | 档案 · 馆 | 中国非遗地图（ECharts）+ 四流派档案 + 吹拉剪塑四法 + 岁时节令 |
| `/studio` | 工坊 · 坊 | 熬糖温度四态、十二生肖吹塑、石板画糖、拔丝金线、一吹一融对照展、遗憾博物馆 |
| `/scroll` | 长卷 · 卷 | 400vh 滚动叙事：糖人的一生四幕 |
| `/comic` | 条漫 · 画 | 番外条漫《盛京糖韵 · 游古都》七格 |
| `/film` | 影片 · 影 | 纪录短片《盛京寻甜记》1 分 21 秒 + 五幕文字解说 |
| `/about` | 关于与合规 | 资料出处、AIGC 使用说明、原创声明、申报 Checklist |

全站支持滚轮 / 触摸 / 键盘（PageDown、方向键）边界换页。

---

## 技术栈

- **Vite 5** + **React 18**（JSX，无 TypeScript）
- **react-router-dom 6**（HashRouter，零服务端重写规则）
- **ECharts 5**（仅档案库地图，`echarts/core` 按需引入）
- 原生 CSS 变量 + 原生 scroll 驱动叙事
- 无 Three.js / 无 GSAP / 无 Tailwind / 无外网 API

---

## 本地运行

```bash
# 安装依赖（Node 18+）
npm ci

# 若报错 The package "@esbuild/win32-x64" could not be found
# 执行：npm i --no-save @esbuild/win32-x64

npm run dev      # 开发预览 http://localhost:5173
npm run build    # 生产构建 → dist/
```

### 自检脚本

```bash
node scripts/route-config-check.mjs    # 路由顺序与元数据静态预检（9 项）
node scripts/build-single.mjs          # 生成自包含单文件版
node scripts/scroll-paging-check.mjs   # 实测换页交互（8 项，读单文件版）
```

---

## 部署

### 方式 A：GitHub Pages（自动）

仓库内置 `.github/workflows/deploy.yml`：推送到 `main` 即自动构建并部署。

首次需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**，之后访问
`https://<用户名>.github.io/<仓库名>/` 即可。

站点使用 HashRouter + `base: './'`，因此**不需要任何服务端重写规则**，子路径部署也正常。

### 方式 B：单文件版（评委演示 / 离线交付）

```bash
npm run build
node scripts/build-single.mjs
```

产出 `dist-single/糖人网站-单文件版.html`（约 **9.1 MB**）：

- JS / CSS / 中国地图 GeoJSON / 条漫 WebP / 影片 mp4 **全部内联**，零外部请求；
- 构建产物为自包含 IIFE，按经典脚本内联，**双击即可打开**（`file://` 也能跑）；
- 体积构成：JS 794KB + 地图 569KB + 条漫 613KB + 影片 7.1MB（base64）。

### 方式 C：任意静态托管

`dist/` 目录就是完整可部署的静态站，直接上传到 Nginx / OSS / COS / Vercel / Netlify 的站点根目录即可。

> ⚠️ **不要双击 `dist/index.html`**：目录版是 ES module 脚本，会被浏览器 `file://` 安全策略拦截。
> 要双击打开请用方式 B 的单文件版。

---

## 目录结构

```
sugar-heritage-web/
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── index.html                     # 入口（含防误缩放 viewport）
├── vite.config.js                 # base:'./' + keepNames + iife
├── public/
│   ├── chinaGeo.json              # 离线中国省级 GeoJSON（35 区域，含港澳台）
│   ├── comic/panel-1~7.webp       # 七格条漫切片（720px 宽）
│   ├── videos/film-84s.mp4        # 纪录短片（854×480 / 81.3s / 5.35MB）
│   ├── videos/poster.webp         # 影片封面（正片 35.5s 真实抽帧）
│   └── .nojekyll                  # 防止 Jekyll 忽略下划线开头文件
├── scripts/
│   ├── build-single.mjs           # 单文件内联构建
│   ├── route-config-check.mjs     # 路由静态预检
│   ├── scroll-paging-check.mjs    # 换页交互实测
│   └── visual-check.mjs           # 视觉巡检截图
└── src/
    ├── main.jsx                   # HashRouter 挂载 + 落地页跳转
    ├── App.jsx                    # 导航 + 路由 + 首页 / 关于页 + 页脚
    ├── styles.css                 # 全站设计 token 与样式（19 节）
    ├── assets/
    │   ├── patterns.jsx           # 9 种糖艺与传统纹样（SVG Data-URI）
    │   └── textures.js            # 4 种分层材质
    ├── components/
    │   ├── PageTransition.jsx     # 合成层换页动画 + 落印反馈
    │   ├── SealStamp.jsx          # 朱砂落印洇墨
    │   ├── SugarProgressBar.jsx   # 底部糖稀进度条
    │   ├── SugarFigure.jsx        # 小糖人装饰（复用生肖矢量）
    │   ├── SugarSkewer.jsx        # 小糖葫芦装饰
    │   └── FilmEmbed.jsx          # 影片嵌入 + 单文件降级
    ├── config/pageTransition.js   # 换页参数与路由顺序（唯一事实源）
    ├── data/sugarCouplets.js      # 签文 / 时辰 / 岁时 / 时间轴 / 遗憾博物馆
    ├── hooks/
    │   ├── useScrollPaging.js     # 边界换页
    │   └── useScrollProgress.js   # 滚动进度（自订阅，避免整树重渲）
    ├── pages/                     # Cover / Archive / Studio / Scroll / Comic / Film
    └── utils/inlineAssets.js      # 单文件版资源解析
```

---

## 内容诚实性

- **非遗数据**：档案库按「手艺类型 + 流派」描述，不预设名录批次与编号。
- **文学化内容**：对联、口诀、叫卖、影片台词凡属团队创作，均标注「（团队拟）」。
- **AIGC 使用**：全站交互与视觉资产（纹样、材质、生肖矢量、Canvas/SVG 交互）均为手写代码；
  **仅条漫与影片**使用 AIGC 辅助生成素材。具体工具名称与人工干预说明见站内「关于与合规」页第三节。
- **影片片长**：以实际音视频流为准 **81.3 秒（1:21）**（原片容器头标注 84.27s，含元数据填充）。
