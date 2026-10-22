import React, { useMemo } from 'react';
import { CraftIcon } from './Studio';
import SealStamp from '../components/SealStamp';
import SugarFigure from '../components/SugarFigure';
import SugarSkewer from '../components/SugarSkewer';
import { getShichenMarketMood } from '../data/sugarCouplets';

/**
 * 文件：src/pages/Cover.jsx
 * 作用：【卷首 · 启卷】全站封面页（/cover）
 *
 * 设计约束（与全站保持完全一致）：
 * - 色：宣纸米白 #FFFDF8 底 + 琥珀三阶 + 朱砂 #B91C1C 点睛 + 深褐 #412402 文字，零新色相；
 * - 形：四角回纹包边、铜勺浇痕、如意云纹、竖排册页式构图，全部源自站内既有纹样；
 * - 组件：直接复用 CraftIcon / SealStamp(落印洇墨) / section-badge / daily-sugar-lot-card /
 *   corner-ornament / hero-main-title 的衬线规范，不新造组件语言；
 * - 交互：CTA 走 App 注入的 onManualNavigate（manual 直通通道），与滚动换页、键盘换页共存；
 * - 无障碍：主标题 tabIndex=-1 供切页焦点定位，所有装饰性 SVG / 印章均 aria-hidden。
 */

/** 封面专用签文池（团队原创；与首页「今日糖签」错开，避免连续两页重复） */
const COVER_VERSES = [
  { verse: '「铜勺为笔，石板为纸；苇管吹塑，百兽栩栩。」', note: '一勺糖稀的四门手艺' },
  { verse: '「糖人会融，手艺不灭；屏幕之内，亦可传灯。」', note: '数字时代的非遗心愿' },
  { verse: '「文火慢熬三分甜，快手提拉万缕金丝长。」', note: '熬与拔之间' }
];

/** 三大板块快捷入口（与首页传送门同一组 seal，视觉语言保持一致） */
const QUICK_ENTRIES = [
  { to: '/archive', seal: '馆', label: '非遗档案百科' },
  { to: '/studio', seal: '坊', label: '掌中互动工坊' },
  { to: '/scroll', seal: '卷', label: '百年叙事长卷' }
];

export default function Cover({ onManualNavigate }) {
  const shichenMood = useMemo(() => getShichenMarketMood(), []);
  // 按自然日轮换签文：同一天多次访问一致，跨日自动更新
  const coverVerse = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    return COVER_VERSES[dayIndex % COVER_VERSES.length];
  }, []);

  const go = (targetPath, e) => {
    if (e) e.preventDefault();
    if (onManualNavigate) onManualNavigate(targetPath);
  };

  return (
    <main className="cover-screen" style={{ '--shichen-overlay': shichenMood.overlayBg }}>
      {/* 四角回纹包边（复用牌匾/纪念卡同款角饰） */}
      <span className="corner-ornament tl" aria-hidden="true" />
      <span className="corner-ornament tr" aria-hidden="true" />
      <span className="corner-ornament bl" aria-hidden="true" />
      <span className="corner-ornament br" aria-hidden="true" />

      {/* 顶部：时辰徽标 + 铜勺浇痕 */}
      <header className="cover-top-band">
        <span className="section-badge">
          <CraftIcon name="pot" />
          {shichenMood.badge}
        </span>
        <div className="cover-ladle-trace" aria-hidden="true" />
      </header>

      {/* 小糖人 + 小糖葫芦贴纸
          · 宽屏：绝对定位贴封面两侧，填补留白（.cover-deco 为 absolute 定位容器）
          · 窄屏（≤860px）：自动变为横向贴纸带，随版面流式排列，保证任何宽度都可见 */}
      <div className="cover-deco" aria-hidden="true">
        <SugarFigure id="rat" cls="cover-fig cover-fig-l1" />
        <SugarFigure id="tiger" cls="cover-fig cover-fig-l2" />
        <SugarFigure id="dragon" cls="cover-fig cover-fig-l3" />
        <SugarFigure id="monkey" cls="cover-fig cover-fig-r1" />
        <SugarFigure id="rabbit" cls="cover-fig cover-fig-r2" />
        <SugarFigure id="horse" cls="cover-fig cover-fig-r3" />
        <SugarSkewer cls="cover-skewer cover-skewer-l1" />
        <SugarSkewer cls="cover-skewer cover-skewer-l2" />
        <SugarSkewer cls="cover-skewer cover-skewer-l3" />
        <SugarSkewer cls="cover-skewer cover-skewer-r1" />
        <SugarSkewer cls="cover-skewer cover-skewer-r2" />
        <SugarSkewer cls="cover-skewer cover-skewer-r3" />
      </div>

      {/* 中央：落印 + 主标题 + 副标题 + 卷首签 */}
      <div className="hero-center-box cover-center-box">
        <div className="cover-seal-row">
          <SealStamp text="首" size={46} onceKey="cover-main-seal" />
        </div>

        <h1 className="cover-title serif-title" tabIndex="-1">
          一勺糖稀 · 非遗百年
        </h1>

        <p className="hero-lead cover-lead">
          以铜勺为笔、苇管为媒，在宣纸米白与琥珀金辉之间，
          用原生前端代码重现中国民间吹糖人与糖画的百年匠心。
        </p>

        <aside className="daily-sugar-lot-card cover-verse-card" aria-label="卷首签文">
          <div className="daily-lot-header">
            <span
              className="serif-title"
              style={{ fontWeight: 700, color: 'var(--cinnabar-red)', fontSize: '0.9rem' }}
            >
              【卷首签】{coverVerse.note}
            </span>
            <SealStamp text="签" size={22} onceKey="cover-verse-seal" />
          </div>
          <p
            className="serif-title"
            style={{ fontSize: '1.02rem', color: 'var(--text-main)', margin: '6px 0 4px' }}
          >
            {coverVerse.verse}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            签文来源：团队原创（每日轮换，跨日更新）
          </span>
        </aside>
      </div>

      {/* 下部：核心 CTA + 快捷导航入口 + 下滑提示 */}
      <footer className="cover-cta-zone">
        <button
          type="button"
          className="cover-cta-btn"
          onClick={(e) => go('/', e)}
        >
          启卷 · 步入非遗
          <span className="cover-cta-arrow" aria-hidden="true">→</span>
        </button>

        <nav className="cover-quick-nav" aria-label="封面快捷导航">
          {QUICK_ENTRIES.map((item) => (
            <a
              key={item.to}
              href={`#${item.to}`}
              className="cover-quick-link"
              onClick={(e) => go(item.to, e)}
            >
              <span className="portal-seal">{item.seal}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <p className="cover-scroll-hint">
          <span className="cover-scroll-drop" aria-hidden="true" />
          亦可下滑滚轮 / 按 PageDown 直接入卷
        </p>
        <span className="cover-contest-note">
          全国大学生数字媒体科技作品及创意竞赛 · 民族文化创新表达
        </span>
      </footer>
    </main>
  );
}
