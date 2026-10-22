import React, { useState, useEffect, useRef, useId } from 'react';
import { resolveAsset, isSingleFileBuild } from '../utils/inlineAssets';

/**
 * 文件：src/components/FilmEmbed.jsx
 * 作用：【影片】81 秒（1:21）叙事短片嵌入组件，含单文件版降级与减少动态效果适配。
 *
 * 版本说明（2026-10-22）：
 * - 基于外部实现重构：保留其 __SINGLE_FILE_BUILD__ 降级、prefers-reduced-motion 门禁、
 *   onError 兜底与五幕解说词；修正一处——原实现未走 resolveAsset()，
 *   单文件版下 poster 不会被内联 → 裂图。现已统一改走 resolveAsset。
 * - poster 默认指向手绘 SVG 静帧（本机无 ffmpeg，无法从视频抽帧）；
 *   SVG 静帧体积近零且与站内风格一致。
 * - 默认不自动播放、不自动出声（全站无声承诺 + 评审现场友好）。
 */
export default function FilmEmbed({
  videoSrc = './videos/film-84s.mp4',
  posterSrc = './videos/poster.webp'
}) {
  const transcriptId = useId();
  const videoRef = useRef(null);

  // ⚠️ 这两个初值必须在 useState 初始器里同步算出，不能等 useEffect：
  //    否则首帧会先渲染出 <video> 与 <source>，浏览器立刻去请求不存在的 mp4，
  //   留下一个 ERR_FILE_NOT_FOUND 控制台报错后才切降级（2026-10-22 实测）。
  // 先把资源解析出来：单文件版会把 mp4 一起内联成 data URI，此时照常播放、不降级。
  // 只有「单文件版 且 视频确实没内联（体积超上限被跳过）」时才走静帧降级。
  const videoUrl = resolveAsset(videoSrc);
  const poster = resolveAsset(posterSrc);
  const videoInlined = videoUrl.startsWith('data:');

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });
  const [userActivated, setUserActivated] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(
    () => isSingleFileBuild() && !videoInlined
  );

  useEffect(() => {
    // 单文件版且视频未内联时才降级；内联了就正常播放
    if (isSingleFileBuild() && !videoInlined) setVideoUnavailable(true);
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(Boolean(mq.matches));
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
  }, []);

  const handleVideoError = () => setVideoUnavailable(true);

  const handleExplicitPlay = () => {
    setUserActivated(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => setVideoUnavailable(true));
      }
    }, 50);
  };

  const showStaticGate = prefersReducedMotion && !userActivated && !videoUnavailable;

  const posterImg = (alt, extraClassName = 'film-poster-img') => (
    <img
      className={extraClassName}
      src={poster}
      width={1280}
      height={720}
      decoding="async"
      alt={alt}
    />
  );

  return (
    <div className="film-embed-container">
      <div className="heritage-framed-card film-stage-card">
        <div className="film-stage-topbar">
          <span className="heritage-mini-seal" aria-hidden="true">
            影卷
          </span>
          <span className="film-stage-meta">正片时长 01:21（81.3 秒） · H.264 854×480 叙事短片</span>
        </div>

        <div className="film-viewport">
          {videoUnavailable ? (
            <div className="film-fallback-view" role="region" aria-label="单文件模式影片静帧预览">
              {posterImg(
                '《一勺糖稀 · 非遗百年》影片代表静帧：宣纸底上插着竹签的琥珀糖人，铜勺正浇下糖丝'
              )}
              {/* 降级说明：必须醒目。单文件 HTML 为保持"双击即开、零外部请求"，
                  无法容纳 25MB 视频，故此处只呈静帧；完整影片在目录版/部署地址可看。 */}
              <div className="film-fallback-banner" role="status">
                <span className="heritage-mini-seal" aria-hidden="true">
                  提示
                </span>
                <div className="film-fallback-text">
                  <strong>完整影片未内联进单文件版</strong>
                  <p>
                    单文件 HTML 为保证「双击即开、零外部请求」，无法容纳 25MB 视频文件，
                    因此这里只显示封面静帧。1 分 24 秒的完整短片请使用<strong>目录版</strong>
                    （<code>npm run build</code> 产物）或访问部署地址观看。
                  </p>
                </div>
              </div>
            </div>
          ) : showStaticGate ? (
            <div className="film-reduced-motion-gate">
              {posterImg('《一勺糖稀 · 非遗百年》影片封面静帧：点击下方按钮即可加载并播放影片')}
              <div className="film-gate-overlay">
                <p className="film-gate-tip">
                  已检测到系统开启「减弱动态效果（prefers-reduced-motion）」，默认未预加载视频流。
                </p>
                <button
                  type="button"
                  className="heritage-action-btn"
                  onClick={handleExplicitPlay}
                  aria-label="加载并播放《一勺糖稀 · 非遗百年》81 秒叙事短片"
                >
                  点击显式加载并播放短片（01:21）
                </button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="film-native-video"
              controls
              preload={prefersReducedMotion ? 'none' : 'metadata'}
              poster={poster}
              playsInline
              aria-describedby={transcriptId}
              onError={handleVideoError}
            >
              <source src={videoUrl} type="video/mp4" onError={handleVideoError} />
              您的浏览器不支持 HTML5 视频播放，请阅读下方完整文字解说。
            </video>
          )}
        </div>
      </div>

      <article
        id={transcriptId}
        className="heritage-framed-card film-transcript-card"
        aria-label="影片完整分段解说与无障碍字幕文本"
      >
        <div className="compliance-box-header">
          <span className="heritage-mini-seal" aria-hidden="true">
            解说
          </span>
          <h2 className="compliance-box-title serif-title">
            影片解说与分段台词实录（总时长 1:21 / 81.3 秒）
          </h2>
        </div>

        <p className="film-transcript-lead">
          本短片《盛京糖韵 · 游古都》全长 <strong>1 分 21 秒（81.3 秒）</strong>
          ，以团队原创设计的两位糖人化形少女（粉发妹妹与褐发姐姐）为主视角，
          串联起传统熬糖工坊、古都宫苑、市井糖画摊位与夜市灯会，
          展现民间糖画从「案头手艺」走向「人间烟火记忆」的情感脉络。全片共分五幕：
        </p>

        <ol className="film-segment-list">
          <li>
            <strong>第一幕 · 工坊化形，初入人间（00:00–00:08）：</strong>
            阳光透过木格窗洒入古色古香的糖画工坊，案头摆放着竹签筒与熬糖铜锅。由糖稀凝结化形的粉发双马尾少女欣喜地环顾四周说道：「这里就是人间吗？好温暖，好喜欢。」身旁的褐发古装少女微笑着回应：「嗯，既然化形了，我们就去看看吧。」
          </li>
          <li>
            <strong>第二幕 · 沈阳故宫，古都揽胜（00:08–00:27）：</strong>
            画面转入夕阳辉映下的沈阳故宫大政殿广场，游人驻足拍照。两位少女手持红艳的冰糖葫芦在红墙石狮间欢笑穿行；随后步入宫廷展馆，隔着玻璃展柜赞叹清代文物，又在红墙下俯身观赏盛放的繁花，并登上城楼凭栏远眺落日余晖下的金色琉璃宫殿群。
          </li>
          <li>
            <strong>第三幕 · 庙市寻甜，糖画摊互动（00:27–00:54）：</strong>
            镜头俯瞰红灯笼高挂、熙攘繁华的古街庙市，两人被写有「糖画」二字的传统布篷摊位吸引。摊位木案上插着晶莹剔透的金色小鹿与花朵糖画，一对母子正在挑选。姐姐温言叮嘱，妹妹指着糖人惊呼，伸手轻触小鹿鹿角时俏皮地缩回手撒娇，姐姐宠溺地买下糖画，妹妹手捧糖人展颜欢笑。
          </li>
          <li>
            <strong>第四幕 · 老北市夜游，纸鸢与百戏（00:54–01:04）：</strong>
            暮色四合，古街两侧茶庄与食肆招牌灯火通明，街巷上空悬停着巨大的传统彩绘沙燕风筝与竹骨蜻蜓纸鸢。妹妹仰头指向夜空，姐姐牵起她的手叮嘱；妹妹又被街边琳琅满目的手工艺摊位吸引。
          </li>
          <li>
            <strong>第五幕 · 宫墙夜色，烟火定格（01:04–01:21）：</strong>
            夜幕深沉，姐妹二人并肩坐在故宫红墙黄瓦的屋脊上，漫天璀璨的礼花在夜空中接连绽放。妹妹指着烟火憧憬道：「能把烟花也做成糖人就好啦，这样就能把今天一直留住。」姐姐温柔地注视着她说：「傻丫头，我们的回忆会一直留在心里的。」影片在盛大的夜空烟火与两人相依的剪影中缓缓落幕。
          </li>
        </ol>
      </article>
    </div>
  );
}
