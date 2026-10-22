import React, { useState, useEffect, useRef } from 'react';
import SealStamp from '../components/SealStamp';

function clamp01(val) {
  return Math.max(0, Math.min(1, val));
}

function normalizeRange(p, start, end) {
  return clamp01((p - start) / (end - start));
}

const MEMORY_MOTES = [
  { id: 1, baseX: 118, baseY: 224, r: 3.5, speed: 115, drift: -18 },
  { id: 2, baseX: 136, baseY: 228, r: 2.8, speed: 140, drift: 14 },
  { id: 3, baseX: 150, baseY: 220, r: 4.2, speed: 130, drift: -10 },
  { id: 4, baseX: 162, baseY: 230, r: 3.0, speed: 155, drift: 8 },
  { id: 5, baseX: 175, baseY: 222, r: 4.0, speed: 125, drift: 16 },
  { id: 6, baseX: 192, baseY: 226, r: 2.6, speed: 145, drift: -12 },
  { id: 7, baseX: 205, baseY: 222, r: 3.4, speed: 110, drift: 20 },
  { id: 8, baseX: 144, baseY: 210, r: 2.5, speed: 160, drift: -15 },
  { id: 9, baseX: 168, baseY: 208, r: 3.2, speed: 150, drift: 12 },
  { id: 10, baseX: 184, baseY: 214, r: 2.8, speed: 135, drift: -8 }
];

// 记录长卷“自左向右展开”动画是否已播放过，确保全生命周期只播一次
let hasUnrolledScrollOnce = false;

/**
 * 叙事长卷（卷）：滚轮带你看完糖人的一生
 * 【批次 B 增强】：
 * 1. B-1 竹纸材质 (bambooPaper) + 糖丝网格分幕背景 + 糖泡群进度徽标。
 * 2. B-5 落印洇墨 SealStamp 组件接入。
 * 3. B-9 进入 /scroll 时做一次“卷轴自左向右展开”（<=600ms，仅播一次）；
 *    保留两侧 writing-mode: vertical-rl 竖排叫卖对联（及 <=768px 隐藏规则）不动，文案附上“”。
 */
export default function Scroll() {
  const outerTrackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [shouldUnroll] = useState(() => {
    if (hasUnrolledScrollOnce) return false;
    hasUnrolledScrollOnce = true;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const trackEl = outerTrackRef.current;
      if (!trackEl) return;

      const rect = trackEl.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) {
        setProgress(0);
        return;
      }

      const currentScrolled = -rect.top;
      const p = clamp01(currentScrolled / scrollableDistance);
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 第一幕 (0.0 ~ 0.2)：糖滴加速下落
  const act1T = normalizeRange(progress, 0.0, 0.2);
  const dropY = -125 + Math.pow(act1T, 1.85) * 265;
  const dropOpacity = progress < 0.2 ? 1 : clamp01(1 - (progress - 0.2) * 18);

  // 第二幕 (0.2 ~ 0.5)：糖人四部件从透明到实体拼合
  const act2T = normalizeRange(progress, 0.2, 0.5);
  const assembleEase = 1 - Math.pow(1 - act2T, 3);

  // 第三幕 (0.5 ~ 0.75)：完整糖人呈现，左右轻微晃动 (±1.2deg)
  const act3T = normalizeRange(progress, 0.5, 0.75);
  const isAct3 = progress >= 0.5 && progress < 0.75;
  const swayAngle = isAct3 ? Math.sin(act3T * Math.PI * 8) * 1.2 : 0;

  // 第四幕 (0.75 ~ 1.0)：原地向底座坍缩消融，act4T >= 0.82 彻底归零卸载
  const act4T = normalizeRange(progress, 0.75, 1.0);
  const meltScaleX = (1 + act4T * 0.46).toFixed(3);
  const meltScaleY = Math.max(0.06, 1 - Math.pow(act4T, 0.88) * 0.94).toFixed(3);

  const bodyFadeOut = progress < 0.75 ? 1 : clamp01(1 - Math.pow(act4T / 0.82, 1.35));
  const bodyOpacity = progress < 0.18 ? 0 : assembleEase * bodyFadeOut;

  const stickFadeOut = progress < 0.75 ? 1 : clamp01(1 - Math.pow(act4T / 0.65, 1.5));
  const stickOpacity = progress < 0.18 ? 0 : assembleEase * stickFadeOut;

  const puddleOpacity =
    progress < 0.75
      ? 0
      : act4T < 0.65
      ? (act4T / 0.65) * 0.82
      : Math.max(0, (1 - (act4T - 0.65) / 0.35) * 0.82);

  const currentActIndex =
    progress < 0.2 ? 1 : progress < 0.5 ? 2 : progress < 0.75 ? 3 : 4;

  // 【B-9】保留两侧竖排叫卖对联，文案明确标注“”
  const leftCoupletText =
    currentActIndex <= 2
      ? '铜勺倾金滴 · 苇管吹乾坤'
      : '锣响胡同深 · 吹糖人儿嘞';
  const rightCoupletText =
    currentActIndex <= 2
      ? '文火熬麦芽 · 指尖塑百态'
      : '小耗子偷油 · 孙猴翻跟头';
  const coupletOpacity = progress > 0.04 && progress < 0.94 ? 0.92 : 0.25;

  return (
    <main ref={outerTrackRef} className="scroll-outer-track" aria-label="糖人的一生四幕叙事长卷">
      {/* 供无障碍切页焦点管理定位的隐藏主标题 */}
      <h1 className="sr-only" tabIndex="-1">
        百年叙事长卷 · 滚轮看完糖人的一生
      </h1>

      <div className={`scroll-sticky-stage ${shouldUnroll ? 'scroll-unroll-once' : ''}`}>
        {/* 顶部四幕进度条 + 糖滴领头圆点 + 落印洇墨小印 */}
        <div className="scroll-progress-hud">
          <div className="scroll-act-pills">
            <span className={`scroll-act-pill ${currentActIndex === 1 ? 'current' : ''}`}>
              壹 · 金滴初落
            </span>
            <span className={`scroll-act-pill ${currentActIndex === 2 ? 'current' : ''}`}>
              贰 · 吹塑成形
            </span>
            <span className={`scroll-act-pill ${currentActIndex === 3 ? 'current' : ''}`}>
              叁 · 胡同叫卖
            </span>
            <span className={`scroll-act-pill ${currentActIndex === 4 ? 'current' : ''}`}>
              肆 · 薪火永恒
            </span>
            <SealStamp text="卷" size={24} onceKey="scroll-hud-seal" />
          </div>
          <div className="scroll-bar-bg">
            <div
              className="scroll-bar-fill"
              style={{ width: `${(progress * 100).toFixed(1)}%` }}
            >
              <span className="sugar-drop-head" />
            </div>
          </div>
        </div>

        {/* 两侧竖排叫卖春联/招幌（保留 writing-mode: vertical-rl 与 <=768px 隐藏规则） */}
        <aside
          className="vertical-hutong-couplet left"
          style={{ opacity: coupletOpacity }}
          aria-hidden="true"
        >
          {leftCoupletText}
        </aside>
        <aside
          className="vertical-hutong-couplet right"
          style={{ opacity: coupletOpacity }}
          aria-hidden="true"
        >
          {rightCoupletText}
        </aside>

        {/* 中央 SVG 视觉叙事舞台 */}
        <div className="scroll-artwork-viewport">
          <svg
            viewBox="0 0 320 310"
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
            aria-label="糖人的一生四幕叙事动画"
          >
            <defs>
              <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAC775" />
                <stop offset="55%" stopColor="#EF9F27" />
                <stop offset="100%" stopColor="#BA7517" />
              </linearGradient>

              <radialGradient id="puddleGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF9F27" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#FAC775" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FAC775" stopOpacity="0" />
              </radialGradient>

              <clipPath id="stageMeltClip">
                <rect x="0" y="0" width="320" height="236" />
              </clipPath>
            </defs>

            {/* 第一幕：顶部铜勺与加速坠落的糖滴 */}
            {dropOpacity > 0.01 && (
              <g style={{ opacity: dropOpacity }}>
                <path
                  d="M110,8 Q145,24 162,18 L210,4"
                  fill="none"
                  stroke="#712B13"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="160"
                  y1="18"
                  x2="160"
                  y2={Math.max(20, 145 + dropY)}
                  stroke="#FAC775"
                  strokeWidth={Math.max(1, 4 - act1T * 3)}
                  strokeDasharray="4 2"
                />
                <path
                  d="M160,115 C174,137 178,153 160,163 C142,153 146,137 160,115 Z"
                  fill="url(#amberGrad)"
                  stroke="#412402"
                  strokeWidth="2"
                  transform={`translate(0, ${dropY})`}
                />
              </g>
            )}

            {/* 独立竹签层：第四幕前段即完全淡出 */}
            {stickOpacity > 0.01 && (
              <g
                transform={`translate(0, ${(1 - assembleEase) * 55})`}
                style={{ opacity: stickOpacity }}
              >
                <line
                  x1="160"
                  y1="226"
                  x2="160"
                  y2="294"
                  stroke="#BA7517"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 第二至四幕：糖人主体（锚定在底座 (160, 232) 原地向糖泊坍缩消融） */}
            {bodyOpacity > 0.01 && (
              <g clipPath="url(#stageMeltClip)">
                <g
                  transform={`translate(160, 232) rotate(${swayAngle}) scale(${meltScaleX}, ${meltScaleY}) translate(-160, -232)`}
                  style={{ opacity: bodyOpacity }}
                >
                  <g transform={`translate(0, ${(1 - assembleEase) * 55})`}>
                    <ellipse
                      cx="160"
                      cy="228"
                      rx="50"
                      ry="10"
                      fill="#EF9F27"
                      stroke="#412402"
                      strokeWidth="2"
                    />
                  </g>

                  <g transform={`translate(${-(1 - assembleEase) * 85}, 0)`}>
                    <path
                      d="M126,152 C112,172 116,212 138,225 L182,225 C204,212 208,172 194,152 C180,139 140,139 126,152 Z"
                      fill="url(#amberGrad)"
                      stroke="#412402"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M145,182 Q160,169 175,182 Q160,195 145,182 Z"
                      fill="#FFFDF8"
                      fillOpacity="0.45"
                    />
                  </g>

                  <g transform={`translate(0, ${-(1 - assembleEase) * 80})`}>
                    <circle
                      cx="160"
                      cy="115"
                      r="34"
                      fill="url(#amberGrad)"
                      stroke="#412402"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M130,99 Q112,81 128,73 Q140,81 142,91 M190,99 Q208,81 192,73 Q180,81 178,91"
                      fill="#FAC775"
                      stroke="#412402"
                      strokeWidth="2.2"
                    />
                    <path
                      d="M144,111 Q149,105 154,111 M166,111 Q171,105 176,111"
                      fill="none"
                      stroke="#412402"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M152,125 Q160,133 168,125"
                      fill="none"
                      stroke="#412402"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>

                  <g transform={`translate(${(1 - assembleEase) * 90}, 0)`}>
                    <path
                      d="M192,169 Q232,145 226,185 Q220,211 190,207"
                      fill="none"
                      stroke="#EF9F27"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M128,169 Q88,145 94,185 Q100,211 130,207"
                      fill="none"
                      stroke="#EF9F27"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>
                </g>

                {progress >= 0.75 && act4T < 0.75 && (
                  <g style={{ opacity: bodyFadeOut }}>
                    {[126, 148, 174, 194].map((dx, i) => {
                      const dropFall = ((act4T * 3 + i * 0.22) % 1) * 45;
                      return (
                        <circle
                          key={`drip-${i}`}
                          cx={dx}
                          cy={185 + dropFall}
                          r={3.5 - (dropFall / 45) * 1.5}
                          fill="#EF9F27"
                        />
                      );
                    })}
                  </g>
                )}
              </g>
            )}

            {/* 第四幕底座消融糖泊与升腾金辉微粒 */}
            {puddleOpacity > 0.01 && (
              <ellipse
                cx="160"
                cy="232"
                rx={42 + Math.sin(act4T * Math.PI) * 76}
                ry={6 + Math.sin(act4T * Math.PI) * 10}
                fill="url(#puddleGrad)"
                style={{ opacity: puddleOpacity }}
              />
            )}

            {progress >= 0.76 && (
              <g>
                {MEMORY_MOTES.map((mote) => {
                  const moteT = clamp01((act4T - 0.08) / 0.88);
                  const cy = mote.baseY - moteT * mote.speed;
                  const cx = mote.baseX + Math.sin(moteT * Math.PI * 2 + mote.id) * mote.drift;
                  const moteAlpha =
                    moteT <= 0
                      ? 0
                      : moteT < 0.35
                      ? moteT / 0.35
                      : Math.max(0.15, 1 - (moteT - 0.35) / 0.75);

                  return (
                    <circle
                      key={mote.id}
                      cx={cx}
                      cy={cy}
                      r={mote.r * (0.7 + (1 - moteT) * 0.4)}
                      fill="#FAC775"
                      fillOpacity={(moteAlpha * 0.85).toFixed(2)}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* 底部四幕动态字幕面板（带糖丝网格微底纹） */}
        <div className="scroll-caption-box" aria-live="polite">
          {currentActIndex === 1 && (
            <div>
              <div className="hutong-chant-text">第一幕 · 一勺金滴落白案 (0% ~ 20%)</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                小铜勺倾侧，文火慢熬的麦芽糖稀化作琥珀金滴，牵引出晶莹糖丝坠入案板。
              </p>
            </div>
          )}

          {currentActIndex === 2 && (
            <div>
              <div className="hutong-chant-text">第二幕 · 苇管吹气百态生 (20% ~ 50%)</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                手艺人指尖翻飞，吹、拉、捏、转之间，透明糖泡凝实拼合，瑞兽眉眼渐次苏醒。
              </p>
            </div>
          )}

          {currentActIndex === 3 && (
            <div>
              <div className="hutong-chant-text">
                “吹糖人儿嘞——小耗子偷油、孙猴儿翻跟头，铜锣一响胡同深……”
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                第三幕 · 老北京胡同里的童年守望（竹签轻晃 ±1.2°，定格百年市井温情）
              </p>
            </div>
          )}

          {currentActIndex === 4 && (
            <div>
              <p className="apotheosis-quote">
                “糖人终会消融，但非遗的手艺与记忆，因代码而在屏幕中永恒。”
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  fontSize: '0.84rem',
                  color: 'var(--cinnabar-red)',
                  fontWeight: 600
                }}
              >
                <span>全国大学生数字媒体科技作品及创意竞赛 · 民族文化创新表达</span>
                <SealStamp text="永" size={22} onceKey="scroll-end-seal" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}