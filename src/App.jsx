import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Studio, { CraftIcon } from './pages/Studio';
import Scroll from './pages/Scroll';
import Archive from './pages/Archive';
// 条漫与影片页面按需加载：避免多媒体页面把首屏 JS 撑大
const Comic = lazy(() => import('./pages/Comic'));
const Film = lazy(() => import('./pages/Film'));
import Cover from './pages/Cover';
import useScrollPaging from './hooks/useScrollPaging';
import PageTransition from './components/PageTransition';
import SealStamp from './components/SealStamp';
import { PATTERN_URIS, PatternSvgDefs, PatternDivider } from './assets/patterns';
import { injectTextureVariables } from './assets/textures';
import {
  getTodaySugarLot,
  getShichenMarketMood,
  SUGAR_HISTORY_TIMELINE
} from './data/sugarCouplets';


/**
 * 【B-8】糖的来路（卷轴式时间轴）
 * - 挂在 Home 底部（Home 与 Archive 之间），横向卷轴两端配如意云纹轴头
 * - 轴上 5 个节点：唐宋砂糖初兴 → 明清糖画成型 → 民国庙会盛景 → 当代非遗名录 → 数字今朝·本作品
 * - 支持键盘 Tab + 左右方向键逐节点聚焦，每条均注明可考来源；320px/小屏自动转为纵向卷轴
 */
function SugarHistoryScrollTimeline({ scrollProgress = 0 }) {
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);

  // 随页面滚动进度或手动聚焦点亮对应节点（琥珀 -> 朱砂）
  const litCount = Math.max(1, Math.min(5, Math.ceil((scrollProgress + 18) / 20)));

  const handleNodeKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(SUGAR_HISTORY_TIMELINE.length - 1, idx + 1);
      setActiveNodeIdx(next);
      const nextEl = document.getElementById(`history-node-${next}`);
      if (nextEl) nextEl.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, idx - 1);
      setActiveNodeIdx(prev);
      const prevEl = document.getElementById(`history-node-${prev}`);
      if (prevEl) prevEl.focus();
    }
  };

  return (
    <section
      className="history-scroll-section"
      aria-labelledby="history-timeline-heading"
    >
      <div className="section-header sub-plaque" style={{ maxWidth: '1080px', margin: '0 auto 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
          <h2 id="history-timeline-heading" className="serif-title" style={{ fontSize: '1.45rem' }}>
            糖的来路 · 千年饧艺卷轴时间线
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            （支持键盘 Tab 与方向键逐签查阅 · 每条均注明可考来源或标注团队拟）
          </span>
        </div>
      </div>

      <div className="history-scroll-wrapper">
        {/* 左轴头（复用如意云纹） */}
        <div className="scroll-roller-cap left" aria-hidden="true">
          <svg viewBox="0 0 24 120" width="22" height="100%">
            <rect x="4" y="0" width="16" height="120" rx="6" fill="#412402" stroke="#BA7517" strokeWidth="1.5" />
            <path d="M6,60 Q12,50 18,60 Q12,70 6,60 Z" fill="#EF9F27" />
          </svg>
        </div>

        {/* 卷轴心：5 个竹签样式节点 */}
        <div className="history-nodes-track" role="list">
          {SUGAR_HISTORY_TIMELINE.map((node, idx) => {
            const isLit = idx < litCount || idx === activeNodeIdx;
            const isCurrent = idx === activeNodeIdx;
            return (
              <div
                key={node.id}
                id={`history-node-${idx}`}
                role="listitem"
                tabIndex="0"
                className={`history-bamboo-node ${isLit ? 'lit' : ''} ${isCurrent ? 'focused' : ''}`}
                onClick={() => setActiveNodeIdx(idx)}
                onFocus={() => setActiveNodeIdx(idx)}
                onKeyDown={(e) => handleNodeKeyDown(e, idx)}
              >
                <div className="bamboo-node-header">
                  <span className="bamboo-era-tag">{node.era}</span>
                  <CraftIcon name={node.icon} />
                </div>
                <h3 className="serif-title" style={{ fontSize: '1.05rem', marginBottom: '6px' }}>
                  {node.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {node.fact}
                </p>
                <div className="bamboo-citation-footnote">
                  出处/考据：{node.citation}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右轴头（复用如意云纹） */}
        <div className="scroll-roller-cap right" aria-hidden="true">
          <svg viewBox="0 0 24 120" width="22" height="100%">
            <rect x="4" y="0" width="16" height="120" rx="6" fill="#412402" stroke="#BA7517" strokeWidth="1.5" />
            <path d="M6,60 Q12,50 18,60 Q12,70 6,60 Z" fill="#EF9F27" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/**
 * Hero 首页组件（/）：
 * - 【B-10】今日糖签（localStorage 同日不重抽、跨天重置）+ 时辰糖集（早市/午集/夜集微光感与问候）
 * - 三大传送门卡片（馆/坊/卷）
 * - 【B-8】糖的来路（卷轴式时间轴）
 */
function Home({ onManualNavigate, scrollProgress }) {
  const todayLot = useMemo(() => getTodaySugarLot(), []);
  const shichenMood = useMemo(() => getShichenMarketMood(), []);

  const portals = [
    {
      to: '/archive',
      seal: '馆',
      title: '非遗档案与石板画糖',
      desc: '点亮宣纸古舆图查阅流派源流，并在「成都糖画 · 皮糖张」大理石板上亲手提勺浇糖、触发一笔不断彩蛋。'
    },
    {
      to: '/studio',
      seal: '坊',
      title: '一口气吹糖与拔丝工坊',
      desc: '调控铜锅糖温、体验丹田一口气吹塑十二生肖与铜锅拉丝金线，观赏一吹一融对照展与糖的遗憾博物馆。'
    },
    {
      to: '/scroll',
      seal: '卷',
      title: '百年叙事长卷',
      desc: '随画卷自左向右启合，滚轮看尽一滴麦芽糖稀从倾落、吹塑成形、胡同叫卖到消融升华的传奇一生。'
    }
  ];

  return (
    <main
      className="hero-screen"
      style={{
        '--shichen-overlay': shichenMood.overlayBg
      }}
    >
      <div className="hero-center-box">
        {/* 【B-10】时辰糖集问候徽标 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span className="section-badge" style={{ marginBottom: 0 }}>
            <CraftIcon name="pot" />
            {shichenMood.badge}
          </span>
          <span
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              background: 'rgba(247, 241, 225, 0.85)',
              padding: '3px 12px',
              borderRadius: '4px',
              border: '1px solid var(--border-warm)'
            }}
          >
            {shichenMood.greeting}
          </span>
        </div>

        <h1 className="hero-main-title serif-title" tabIndex="-1">
          一勺糖稀 · 非遗百年
        </h1>
        <p className="hero-lead">
          以铜勺为笔、苇管为媒，在宣纸米白与琥珀金辉之间，用原生前端代码重现中国民间吹糖人与糖画的百年匠心。
        </p>

        {/* 【B-10】今日糖签（宣纸签样式，同日固定、跨天重置） */}
        <aside className="daily-sugar-lot-card" aria-label="今日非遗糖签">
          <div className="daily-lot-header">
            <span className="serif-title" style={{ fontWeight: 700, color: 'var(--cinnabar-red)', fontSize: '0.9rem' }}>
              【今日糖签】{todayLot.note}
            </span>
            <SealStamp text="签" size={22} onceKey="hero-daily-lot-seal" />
          </div>
          <p className="serif-title" style={{ fontSize: '1.02rem', color: 'var(--text-main)', margin: '6px 0 4px' }}>
            {todayLot.verse}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            签文来源：{todayLot.source}（每日一签，跨日更新）
          </span>
        </aside>
      </div>

      {/* 三大传送门卡片（馆 / 坊 / 卷） */}
      <section className="portal-grid" aria-label="三大核心板块入口">
        {portals.map((card) => (
          <a
            key={card.to}
            href={`#${card.to}`}
            className="portal-card"
            onClick={(e) => {
              e.preventDefault();
              onManualNavigate(card.to);
            }}
          >
            <div>
              <div className="portal-seal">{card.seal}</div>
              <h2 className="portal-title serif-title">{card.title}</h2>
              <p className="portal-desc">{card.desc}</p>
            </div>
            <span className="portal-enter">步入此卷 →</span>
          </a>
        ))}
      </section>

      <div style={{ width: '100%', maxWidth: '1080px', marginTop: '28px' }}>
        <PatternDivider variant="cloud" />
        {/* 【B-8】糖的来路（卷轴式时间轴） */}
        <SugarHistoryScrollTimeline scrollProgress={scrollProgress} />
      </div>
    </main>
  );
}

/**
 * 关于与合规页（/about）：严守内容诚实性硬约束
 */
function About() {
  return (
    <main className="page-container">
      <header className="section-header">
        <span className="section-badge">
          <CraftIcon name="scissors" />
          竞赛规范 · 评委必查
        </span>
        <h1 className="section-title" tabIndex="-1">
          关于作品与学术合规声明
        </h1>
        <p className="section-subtitle">
          全站严格遵循全国大学生数字媒体科技作品及创意竞赛规范：零外网依赖、零声音干扰、
          手写原生代码，史料来源与 AIGC 使用情况均如实披露。
        </p>
        <SealStamp text="信" onceKey="header-seal-about" />
      </header>

      <section className="studio-game-block">
        <h2 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
          一、非遗资料出处与内容诚实性说明
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="about-table">
            <thead>
              <tr>
                <th>引用模块</th>
                <th>参考依据</th>
                <th>诚实性边界</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>档案库（北京 / 四川 / 山东 / 天津）</td>
                <td>中国非物质文化遗产网公开名录、地方民俗志</td>
                <td>
                  流派条目按「手艺类型 + 流派」描述（如「传统美术 · 糖画（川派）」），
                  <strong>不预设名录批次与编号</strong>，避免出现无法证实的行政级别表述
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>岁时糖艺与「糖的来路」时间轴</td>
                <td>《东京梦华录》等笔记、北方祭灶民谚</td>
                <td>页面已注明「民间习俗地域差异较大」，不把古籍记载当作全国统一的定论</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>今日糖签、长卷叫卖、遗憾博物馆</td>
                <td>传统手艺人行话整理 + 团队文学化创作</td>
                <td>凡属文学化凝练的对联与口诀，逐条显式标注「（团队拟）」</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>番外条漫《盛京糖韵 · 游古都》</td>
                <td>团队原创剧本 + AIGC 辅助绘制</td>
                <td>
                  「盛京（沈阳）」为团队衍生创作题材，<strong>与上述四地非遗档案无隶属关系</strong>；
                  两位少女为团队原创角色（OC）；AIGC 参与环节见第三节
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>纪录短片《盛京寻甜记》</td>
                <td>同一剧本的文字分镜 + AIGC 辅助生成</td>
                <td>片长 1 分 21 秒（81.3 秒）；五幕解说逐条标注「（团队拟）」</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PatternDivider variant="fret" />

      <section className="studio-game-block">
        <h2 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
          二、字体授权、无声准则与技术声明
        </h2>
        <blockquote className="craft-proverb" style={{ marginBottom: '12px' }}>
          1. <strong>字体授权</strong>：衬线标题采用 Noto Serif SC（思源宋体），正文采用 Noto Sans SC（思源黑体），
          遵循 SIL Open Font License 1.1 开源许可。<br />
          2. <strong>全站手写</strong>：9 种糖艺与传统纹样（patterns.jsx）、4 种分层材质（textures.js）、
          十二生肖吹塑矢量、石板画糖与拔丝金线交互，均为手写原生 SVG / Canvas 代码，
          <strong>零外部请求、双击离线即开</strong>。<br />
          3. <strong>完全无声</strong>：全站不加载任何音频文件、不启用 WebAudio，保持纯粹视觉叙事；
          影片为唯一的音视频素材，且默认不自动播放、不自动出声。<br />
          4. <strong>无障碍</strong>：全部动画挂载 prefers-reduced-motion 降级规则；
          影片在「减少动态效果」下改为静帧门禁 + 显式播放按钮。
        </blockquote>
      </section>

      <PatternDivider variant="fret" />

      <section className="studio-game-block">
        <h2 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
          三、人工智能（AIGC）工具使用说明
        </h2>
        <p className="section-subtitle">
          <strong>① 未使用 AIGC 的部分（占全站主体）：</strong>
          首页、档案库、互动工坊（熬糖 / 石板画糖 / 拔丝金线 / 生肖吹塑 / 一吹一融对照展 / 遗憾博物馆）、
          叙事长卷、卷首封面——其纹样、材质、生肖矢量、交互逻辑与全部文案，
          均由团队手写 SVG / Canvas / React 代码实现，<strong>未调用任何在线大模型或生成式 API</strong>。
        </p>
        <p className="section-subtitle">
          <strong>② 使用了 AIGC 的部分（仅两处多媒体）：</strong>
        </p>
        <ul className="about-checklist">
          <li>
            <strong>番外条漫《盛京糖韵 · 游古都》（/comic）</strong>：
            角色设定、分镜脚本、叙事结构与全部台词由团队原创撰写；
            画面底图使用 AIGC 图像生成工具辅助绘制，经团队人工分格裁切、画框装裱与版面重构后集成。
          </li>
          <li>
            <strong>纪录短片《盛京寻甜记》（/film）</strong>：
            剧本与分镜由团队撰写；画面由 AIGC 图生视频工具对静态分镜做局部动态化生成，
            配音为 AIGC 语音合成，最终由团队完成人工剪辑、字幕校对与转码压制。
          </li>
        </ul>
        <p className="section-subtitle">
          <strong>③ 人工干预说明：</strong>
          所有 AIGC 产出均经人工审阅与再加工，未直接采用原始生成结果；
          角色的身份设定、故事走向与全部文字内容由团队决定，AIGC 仅承担视觉素材生成。
        </p>
      </section>

      <PatternDivider variant="fret" />

      <section className="studio-game-block">
        <h2 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
          四、原创性与知识产权声明
        </h2>
        <ul className="about-checklist">
          <li>全站交互逻辑与视觉设计由团队自主编写，<strong>未使用任何商业模板或页面生成器</strong>。</li>
          <li>自制素材（纹样、材质、生肖矢量、交互组件、全部文案）版权归团队所有。</li>
          <li>
            AIGC 辅助生成的条漫与影片画面，其使用权归团队；如竞赛方对 AIGC 素材另有规定，
            以竞赛方规定为准，团队可随时提供生成记录与人工加工过程说明。
          </li>
          <li>引用文献与民俗资料均在第一节表格中注明来源，仅用于本次竞赛展示与非遗文化传播。</li>
        </ul>
      </section>

      <PatternDivider variant="fret" />

      <section className="studio-game-block">
        <h2 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
          五、地域题材与非遗名录考据边界
        </h2>
        <p className="section-subtitle">
          本站核心非遗数据档案严格聚焦于<strong>北京、四川、山东、天津</strong>四地的糖画 / 吹糖人流派；
          条漫与影片中的「盛京（沈阳）糖韵」为团队围绕糖画意象创作的衍生题材，
          与上述四地档案<strong>无隶属关系</strong>；该题材是否列入地方非遗名录及具体批次，团队尚未取得权威佐证，
          故不在站内作任何名录级别表述。
        </p>
      </section>

    </main>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto 18px' }}>
        <PatternDivider variant="cloud" />
      </div>
      <div className="footer-inner">
        <div className="footer-meta-col">
          <strong className="serif-title" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
            一勺糖稀 · 非遗百年 —— 民族文化创新表达数字交互作品
          </strong>
          <span>
            史料与口诀准则：出处可考即注明文献 · 地域差异如实说明 · 文学化口诀标注（团队拟）
          </span>
          <span>
            开源许可：全站采用 SIL OFL 1.1 开源思源宋体/黑体，手写原生 SVG 与 Canvas 代码，零外链依赖。
          </span>
        </div>

        <div className="footer-seal-box">
          <div style={{ textAlign: 'right', fontSize: '0.84rem' }}>
            <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>全国大学生数字媒体科技作品及创意竞赛</div>
            <div>支持滚轮/触摸边界换页与顶部导航直通选页</div>
          </div>
          <SealStamp text="印" size={24} onceKey="footer-seal-main" />
        </div>
      </div>
    </footer>
  );
}

function AppShell({ chinaGeoJson }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 初始化注入 B-1 四种分层材质与九种糖艺纹样 CSS 变量
  useEffect(() => {
    injectTextureVariables(PATTERN_URIS);
  }, []);

  const {
    isTransitioning,
    direction,
    effectiveDuration,
    effectiveDistance,
    easing,
    scrollProgress,
    announcement,
    navigateByPath,
    unlockTransition
  } = useScrollPaging();

  const navItems = [
    { to: '/cover', label: '卷首 · 封面', icon: 'scroll' },
    { to: '/', label: '首页 · 序', icon: 'pot' },
    { to: '/archive', label: '档案 · 馆', icon: 'ladle' },
    { to: '/studio', label: '工坊 · 坊', icon: 'reed' },
    { to: '/scroll', label: '长卷 · 卷', icon: 'skewer' },
    { to: '/comic', label: '条漫 · 画', icon: 'brush' },
    { to: '/film', label: '影片 · 影', icon: 'reel' },
    { to: '/about', label: '关于与合规', icon: 'scissors' }
  ];

  const handleManualNav = (targetPath, e) => {
    if (e) e.preventDefault();
    setMenuOpen(false);
    navigateByPath(targetPath, 'manual');
  };

  return (
    <>
      <PatternSvgDefs />

      <nav className="top-navbar" aria-label="全站主导航">
        <div className="nav-inner">
          <NavLink
            to="/"
            className="brand-logo"
            onClick={(e) => handleManualNav('/', e)}
          >
            <span className="brand-amber-dot" />
            <span>一勺糖稀 · 非遗百年</span>
            <SealStamp text="糖" size={24} onceKey="nav-brand-seal" style={{ marginLeft: '4px' }} />
          </NavLink>

          <button
            type="button"
            className="hamburger-btn"
            aria-label={menuOpen ? '收起导航菜单' : '展开导航菜单'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <CraftIcon name={menuOpen ? 'scissors' : 'pot'} />
          </button>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleManualNav(item.to, e)}
                >
                  <CraftIcon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <PageTransition
        locationKey={location.pathname}
        isTransitioning={isTransitioning}
        direction={direction}
        effectiveDuration={effectiveDuration}
        effectiveDistance={effectiveDistance}
        easing={easing}
        announcement={announcement}
        onTransitionComplete={unlockTransition}
      >
        <Suspense fallback={
          <div className="map-loading-tag" role="status" aria-live="polite">
            <div className="sugar-spinner" aria-hidden="true" />
            <span className="serif-title">正在展卷加载非遗多媒体册页…</span>
          </div>
        }>
        <Routes location={location}>
          <Route path="/cover" element={<Cover onManualNavigate={handleManualNav} />} />
          <Route
            path="/"
            element={<Home onManualNavigate={handleManualNav} scrollProgress={scrollProgress} />}
          />
          <Route path="/archive" element={<Archive chinaGeoJson={chinaGeoJson} />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/scroll" element={<Scroll />} />
          <Route path="/comic" element={<Comic />} />
          <Route path="/film" element={<Film />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </Suspense>
      </PageTransition>

      {/* 页脚：封面页（/cover）不渲染——封面需独占一屏，挂上页脚会溢出约 300px
          导致"触底换页"失效（PageDown 在顶部不触发、wheel 要先滚到底） */}
      {location.pathname !== '/cover' && <SiteFooter />}

      <div className="sugar-progress-bar" aria-hidden="true">
        <div
          className="sugar-progress-fill"
          style={{ width: `${scrollProgress.toFixed(1)}%` }}
        >
          <span className="sugar-drop-head" />
        </div>
      </div>
    </>
  );
}

export default function App({ chinaGeoJson }) {
  // 注意：HashRouter 由 main.jsx 统一提供，此处绝不能再嵌套第二层 Router（否则直接崩）
  return <AppShell chinaGeoJson={chinaGeoJson} />;
}