import React, { useId } from 'react';
import FilmEmbed from '../components/FilmEmbed';

/**
 * 文件：src/pages/Film.jsx
 * 作用：【影片】叙事短片页（/film）
 *
 * 版本说明（2026-10-22）：基于外部实现重构，保留其「技术参数与合规说明」盒；
 * 标题与版式改走站内既有的 section-header / page-container 语言，避免另起一套。
 */
export default function Film() {
  const metaHeadingId = useId();

  return (
    <main className="page-container heritage-media-page" aria-labelledby="film-page-title">
      <header className="section-header heritage-media-header">
        <span className="section-badge heritage-seal-badge">非遗 · 影卷</span>
        <h1 id="film-page-title" className="section-title heritage-media-title" tabIndex="-1">
          一勺糖稀 · 盛京寻甜记
        </h1>
        <p className="section-subtitle heritage-media-subtitle">
          数字媒体叙事短片（01:21） · 以原创糖人少女视角重温古都庙市与糖画手艺温度
        </p>
      </header>

      <FilmEmbed />

      <aside
        className="heritage-framed-card heritage-compliance-box"
        aria-labelledby={metaHeadingId}
      >
        <div className="compliance-box-header">
          <span className="heritage-mini-seal" aria-hidden="true">
            规制
          </span>
          <h2 id={metaHeadingId} className="compliance-box-title serif-title">
            影片技术参数与合规说明
          </h2>
        </div>
        <ul className="compliance-meta-list">
          <li>
            <strong>编码与交付参数：</strong>
            时长 81.3 秒（01:21），H.264 854×480 / 30fps / 478kbps（CRF 30），AAC 64kbps 单声道，
            faststart 头部索引。原片 24.5MB 已二压至 5.35MB（22%），并内联进单文件版，
            封面取正片 35.5 秒处真实抽帧（WebP 55KB）。
          </li>
          <li>
            <strong>交互与无障碍守则：</strong>
            默认不自动播放、不自动出声；支持键盘 Tab 聚焦与原生控件操作；
            命中系统 <code>prefers-reduced-motion</code> 时自动拦截预加载并切换为静帧门禁。
          </li>
          <li>
            <strong>单文件离线包降级策略：</strong>
            在 build-single.mjs 生成的单文件 HTML 模式下，自动捕获媒体缺失并平滑降级为
            代表静帧 + 提示横幅，确保零裂图、零控制台报错。
          </li>
        </ul>
      </aside>
    </main>
  );
}
