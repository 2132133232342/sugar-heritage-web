import React, { useId } from 'react';
import { resolveAsset } from '../utils/inlineAssets';

/**
 * 文件：src/pages/Comic.jsx
 * 作用：【条漫】《盛京糖韵 · 游古都》七格条漫页（/comic）
 *
 * 版本说明（2026-10-22，含一次严重切图错误的修正）：
 * - ⚠️ 曾经的错误：外部脚本给的分格边界（324/642/960…）是在 **1920px 高的缩略副本**上量的，
 *   却被套到 **7457px 高的原图** 上，导致 6 个"格子"全是原图顶部 25.7% 的横向碎片、
 *   74.3% 内容被丢弃——页面看起来"断断续续"。
 *   现已在原图上重新定位分格线（无先验目测 + 三段放大精修）：
 *   真实结构：首格 1703 高（含标题条），其余 6 格等距 959 —— 
 *   [0, 1703, 2663, 3622, 4581, 5537, 6496, 7457]，共 **7 格**，七格全部目验为完整场景。
 * - 版式：7 格宽高比差异很大（0.78~1.70），双列网格会严重参差，故用**单列通栏**，每格左右边缘严格对齐。
 * - 图片**一律 eager 加载，不用 loading="lazy"**：7 张合计约 454KB，
 *   懒加载会让格子随滚动逐个弹出，正是"断断续续"的观感来源。
 * - 资源统一走 resolveAsset()，单文件版才会被内联。
 * - 内容合规：盛京（沈阳古称）糖韵为团队创作题材，与站内四地非遗档案无隶属关系；
 *   两位少女为团队原创角色（OC）；对白与题签均为团队拟。
 */

const COMIC_PANELS = [
  {
    id: 'panel-1',
    index: '第一帧 · 题卷',
    src: './comic/panel-1.webp',
    width: 720,
    height: 958,
    ariaLabel:
      '《盛京糖韵·游古都》条漫题头：夜空烟花与孔明灯下，粉发与褐发两位原创古装少女并肩坐在沈阳故宫琉璃瓦屋檐上远眺',
    caption: '《盛京糖韵 · 游古都》卷首：红墙琉璃映礼花，糖人化形初登临。',
    dialogue: '「好美啊沈阳，你看！」（团队拟）'
  },
  {
    id: 'panel-2',
    index: '第二帧 · 化形',
    src: './comic/panel-2.webp',
    width: 720,
    height: 540,
    ariaLabel:
      '古风熬糖工坊内，铜锅糖稀散发暖光，粉发少女双手举起两只骏马糖画，褐发少女手持金龙糖画相视微笑',
    caption: '古坊熬糖炉火温，竹签挑起龙马魂。一朝化形入尘世，先向人间寻糖韵。',
    dialogue:
      '「这里就是人间吗？好温暖，好喜欢。」——「嗯，既然化形了，我们就去看看吧。」（团队拟）'
  },
  {
    id: 'panel-3',
    index: '第三帧 · 寻摊',
    src: './comic/panel-3.webp',
    width: 720,
    height: 539,
    ariaLabel:
      '古街红灯笼糖画摊位前，摊主与一对母子驻足，粉发少女俯身好奇地端详木案上的金色小鹿与花朵糖画',
    caption: '红灯高悬庙市热闹，糖画摊前琥珀流光。稚子捧花笑，少女见鹿喜。',
    dialogue: '「哇，这个小鹿好可爱呀！」——「喜欢就买一个吧。」（团队拟）'
  },
  {
    id: 'panel-4',
    index: '第四帧 · 拾趣',
    src: './comic/panel-4.webp',
    width: 720,
    height: 539,
    ariaLabel:
      '糖画摊位前，粉发少女伸手轻触金色小鹿糖画向姐姐撒娇，褐发少女微笑着回应，身旁孩童手持花朵糖画观看',
    caption: '鹿角微翘似有灵，指尖轻触笑语盈。五文铜钱换一勺甜，市井温情最抚心。',
    dialogue:
      '「姐姐你看他扎我，好痛啊！」——「好，那我们就把这个小调皮买回家，好不好？」（团队拟）'
  },
  {
    id: 'panel-5',
    index: '第五帧 · 夜肆',
    src: './comic/panel-5.webp',
    width: 720,
    height: 538,
    ariaLabel:
      '灯火通明的古街夜市，空中悬挂巨型彩绘纸鸢与蜻蜓风筝，两位少女手挽手穿行在茶庄与食肆摊位之间',
    caption: '老北市街灯如昼，纸鸢高悬入夜空。百戏杂陈小玩意，一步一景看不够。',
    dialogue: '「姐姐你看，那个风筝飞得好高啊！」——「慢点儿，别摔着。」（团队拟）'
  },
  {
    id: 'panel-6',
    index: '第六帧 · 奔趣',
    src: './comic/panel-6.webp',
    width: 720,
    height: 539,
    ariaLabel:
      '两位少女手持冰糖葫芦在沈阳故宫红墙广场奔跑，身后是宫殿门楼、石狮与远处驻足的人群',
    caption: '白昼携糖游宫苑，红墙石狮间欢笑穿行。',
    dialogue: '「姐姐你看那个！」——「哈哈哈，慢点儿，别摔着。」（团队拟）'
  },
  {
    id: 'panel-7',
    index: '第七帧 · 留忆',
    src: './comic/panel-7.webp',
    width: 720,
    height: 541,
    ariaLabel:
      '两位少女夜坐故宫红墙黄瓦屋檐，仰望漫天盛开的璀璨烟火，相互依偎',
    caption: '入夜凭栏看烟火，纵使糖稀易融，心底甜意长存。',
    dialogue:
      '「能把烟花也做成糖人就好啦，这样就能把今天一直留住。」——「傻丫头，我们的回忆会一直留在心里的。」（团队拟）'
  }
];


/** 四角回纹（复用站内角饰语言，画框四角各一枚） */
function CornerFretwork() {
  return (
    <>
      <svg className="heritage-fret heritage-fret--tl" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 22V2h20v3H5v17H2zm6-6V8h8v3h-5v5H8z" fill="currentColor" />
      </svg>
      <svg className="heritage-fret heritage-fret--tr" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 22V2H2v3h17v17h3zm-6-6V8H8v3h5v5h3z" fill="currentColor" />
      </svg>
      <svg className="heritage-fret heritage-fret--bl" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 2v20h20v-3H5V2H2zm6 6v8h8v-3h-5V8H8z" fill="currentColor" />
      </svg>
      <svg className="heritage-fret heritage-fret--br" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 2v20H2v-3h17V2h3zm-6 6v8H8v-3h5V8h3z" fill="currentColor" />
      </svg>
    </>
  );
}

export default function Comic() {
  const noteHeadingId = useId();

  return (
    <main className="page-container heritage-media-page" aria-labelledby="comic-page-title">
      <header className="section-header heritage-media-header">
        <span className="section-badge heritage-seal-badge">番外 · 彩笺</span>
        <h1 id="comic-page-title" className="section-title heritage-media-title" tabIndex="-1">
          盛京糖韵 · 游古都
        </h1>
        <p className="section-subtitle heritage-media-subtitle">
          七格叙事条漫 · 宣纸册页装裱，桌面双栏、移动端单栏呈览
        </p>
      </header>

      <section className="comic-album-grid" aria-label="盛京糖韵七格条漫展阅区">
        {COMIC_PANELS.map((panel) => (
          <figure key={panel.id} className="heritage-framed-card comic-panel-card">
            <CornerFretwork />
            <div className="comic-panel-header">
              <span className="comic-panel-index serif-title">{panel.index}</span>
              <span className="comic-panel-stamp" aria-hidden="true">
                糖韵
              </span>
            </div>

            <div className="comic-img-stage">
              <img
                className="comic-native-img"
                src={resolveAsset(panel.src)}
                alt={panel.ariaLabel}
                width={panel.width}
                height={panel.height}
                decoding="async"
              />
            </div>

            <figcaption className="comic-panel-caption">
              <p className="comic-caption-desc">{panel.caption}</p>
              <blockquote className="comic-caption-dialogue serif-title">
                {panel.dialogue}
              </blockquote>
            </figcaption>
          </figure>
        ))}
      </section>

      <aside
        className="heritage-framed-card heritage-compliance-box"
        aria-labelledby={noteHeadingId}
      >
        <CornerFretwork />
        <div className="compliance-box-header">
          <span className="heritage-mini-seal" aria-hidden="true">
            说明
          </span>
          <h2 id={noteHeadingId} className="compliance-box-title serif-title">
            《条漫说明》与考据合规声明
          </h2>
        </div>
        <p className="compliance-box-summary">
          本页《盛京糖韵 · 游古都》为团队围绕传统糖画意象创作的番外彩页，
          采用「宣纸册页装裱」，与站内克制矢量插图风格有意区分；
          画面中两位少女角色均为<strong>团队原创设计（OC）</strong>。
        </p>
        <ul className="compliance-meta-list">
          <li>
            <strong>题材考据状态：</strong>
            「盛京」为沈阳古称。本站核心非遗档案仅覆盖北京、四川、山东、天津四地；
            「盛京糖韵」为团队创作题材，与四地非遗档案无隶属关系，具体地方非遗名录批次尚待核实。
          </li>
          <li>
            <strong>对白与文学标注：</strong>
            条漫分镜旁所附角色对白均为团队文学化拟写，已逐条标注「（团队拟）」。
          </li>
          <li>
            <strong>AIGC 工具披露：</strong>
            本条漫底图若使用了 AIGC 图像生成工具，具体工具名称与使用环节见「关于与合规」页的专项说明。
          </li>
        </ul>
      </aside>
    </main>
  );
}
