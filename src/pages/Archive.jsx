import React, { useState, useEffect, useRef, useCallback } from 'react';
// ⚠️ 必须用 echarts/core 按需引入，不能 `import * as echarts from 'echarts'`：
//    全量引入时 Rollup/esbuild 的作用域去重会失效，zrender 的 map 与 ECharts 的
//    getCleanedElOption 会被压成同名顶层 `function $`，后者覆盖前者，
//    导致地图 setOption 抛 "e.unshift is not a function"、地图完全不渲染（2026-10-16 实测）。
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { GeoComponent } from 'echarts/components';
// CanvasRenderer 必须显式引入：zrender 的 painter 是「运行时注册」的
// （registerPainter('canvas', ...) 只是导入副作用），不引它 painterCtors 会是空表，
// echarts.init 直接抛 "Xu[o] is not a constructor"（2026-10-16 实测）。
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([CanvasRenderer, MapChart, TooltipComponent, GeoComponent]);

import { CraftIcon } from './Studio';
import { PatternDivider } from '../assets/patterns';
import { TEXTURE_URIS } from '../assets/textures';
import SealStamp from '../components/SealStamp';
import { SOLAR_TERM_SUGAR_LIST } from '../data/sugarCouplets';

/**
 * 内置极简离线兜底 GeoJSON（矩形示意，仅作最后手段）。
 * 优先级：外部 prop → 单文件版 window.__CHINA_GEO__ → 目录版 fetch → 本兜底。
 * 省名一律用全称，与真实 GeoJSON 的 features[].properties.name 保持一致，
 * 否则 ECharts map 的 name 匹配不上，高亮与点击联动会全部失效。
 */
const FALLBACK_CHINA_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: '北京市' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[115.4, 39.4], [117.5, 39.4], [117.5, 41.0], [115.4, 41.0], [115.4, 39.4]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '天津市' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[116.8, 38.6], [118.0, 38.6], [118.0, 40.2], [116.8, 40.2], [116.8, 38.6]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '山东省' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[114.8, 34.4], [122.7, 34.4], [122.7, 38.4], [114.8, 38.4], [114.8, 34.4]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '四川省' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[97.4, 26.0], [108.5, 26.0], [108.5, 34.3], [97.4, 34.3], [97.4, 26.0]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '河南省' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[110.3, 31.4], [116.6, 31.4], [116.6, 36.3], [110.3, 36.3], [110.3, 31.4]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '陕西省' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[105.5, 31.7], [111.2, 31.7], [111.2, 39.6], [105.5, 39.6], [105.5, 31.7]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: '湖北省' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[108.3, 29.0], [116.1, 29.0], [116.1, 33.3], [108.3, 33.3], [108.3, 29.0]]]
      }
    }
  ]
};

/**
 * 代表性糖艺流派档案数据（描述手艺类型与流派，不预设名录批次）
 */
const HERITAGE_SCHOOLS = [
  {
    id: 'sichuan',
    province: '四川省',
    short: '四川',
    name: '成都糖画 · 皮糖张（交互石板画糖台）',
    batch: '传统美术 · 糖画（川派）',
    desc: '以小铜勺为笔、大理石板为纸，趁热提勺疾书，抖、提、顿、挫间将花鸟瑞兽一气呵成。下方已为您备好温润大理石板，请直接按住拖动体验“提勺浇糖”！',
    proverb: '“手腕悬空走龙蛇，铜勺倾处琥珀凝；一笔不断千钧力，方寸石板见丹青。”（据传统行话整理 · 团队拟）',
    isInteractiveSlab: true
  },
  {
    id: 'beijing',
    province: '北京市',
    short: '北京',
    name: '北京吹糖人',
    batch: '民间技艺 · 吹糖人（京派）',
    desc: '流传于京城庙会与胡同市井，以麦芽糖熬制后插苇管吹气塑形，题材涵盖十二生肖、戏曲人物与花鸟虫鱼。',
    proverb: '“火候看糖泡，吹气凭丹田；指尖三分力，瑞兽活眼前。”（据传统行话整理 · 团队拟）'
  },
  {
    id: 'shandong',
    province: '山东省',
    short: '山东',
    name: '高唐糖画与齐鲁糖塑',
    batch: '传统美术 · 糖画（齐鲁派）',
    desc: '融合齐鲁民间造型规制，线条粗犷饱满，兼具平面石板糖画与立体糖塑技法。',
    proverb: '“文火慢熬麦芽香，快手提拉金丝长；莫道糖人易消融，百年手艺代代传。”（团队拟）'
  },
  {
    id: 'tianjin',
    province: '天津市',
    short: '天津',
    name: '津门吹糖人',
    batch: '民间技艺 · 吹糖人（津派）',
    desc: '讲究“吹、拉、捏、剪”四法并举，常配以竹模与木炭小炉走街串巷，造型诙谐灵动。',
    proverb: '“一团琥珀掌中揉，苇管轻吹百兽游；锣声敲醒胡同梦，甜透津门几度秋。”（团队拟）'
  }
];

/**
 * 吹、拉、剪、塑四步核心技法数据
 */
const CRAFT_STEPS = [
  {
    id: 'blow',
    step: '第一式 · 吹',
    icon: 'reed',
    title: '苇管吹腔',
    summary: '趁糖胎温润包裹芦苇管口，丹田缓缓送气撑起中空糖泡。',
    chant: '口诀：“气缓则胎匀，气急则膜破；三分吹七分捏，呼吸定乾坤。”（团队拟）'
  },
  {
    id: 'pull',
    step: '第二式 · 拉',
    icon: 'skewer',
    title: '拔丝牵须',
    summary: '趁糖稀半凝未凝之际，指尖疾速提拉出龙须、马鬃与凤尾细丝。',
    chant: '口诀：“离火三秒拉长丝，迎风一抖化金须；丝不粘手方为妙。”（团队拟）'
  },
  {
    id: 'cut',
    step: '第三式 · 剪',
    icon: 'scissors',
    title: '铜剪开爪',
    summary: '用温热的传统平头小铜剪利落剪开兽角、鸡冠与分趾龙爪。',
    chant: '口诀：“剪刀常蘸温水暖，落剪无痕分五爪；快剪轻挑见精神。”（团队拟）'
  },
  {
    id: 'sculpt',
    step: '第四式 · 塑',
    icon: 'ladle',
    title: '捏棱成器',
    summary: '拇指与食指翻转捏出五官神态与如意云纹，插稳竹签定型。',
    chant: '口诀：“眼点双珠神自来，胸嵌如意纳祥瑞；一签立稳百年春。”（团队拟）'
  }
];

function interpolateSugarCoolColor(t01) {
  const c = Math.max(0, Math.min(1, t01));
  const r = Math.round(250 + (186 - 250) * c);
  const g = Math.round(199 + (117 - 199) * c);
  const b = Math.round(117 + (23 - 117) * c);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 【B-2】大理石板画糖画旗舰互动组件
 * 自检修复：prefers-reduced-motion 下关闭抖动且颜色瞬时凝固（coolT = 1，零后续冷却 rAF）
 */
function MarbleSugarSlab({ onPropagationStop }) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const currentLengthRef = useRef(0);
  const rafIdRef = useRef(null);

  const [oneStrokeEasterEgg, setOneStrokeEasterEgg] = useState(false);
  const [strokeLengthReadout, setStrokeLengthReadout] = useState(0);

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderSlabFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const now = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(65, 36, 2, 0.1)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 130);
    ctx.lineTo(canvas.width / 2, 195);
    ctx.arc(canvas.width / 2, 92, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    let hasCoolingSegment = false;

    strokesRef.current.forEach((stroke) => {
      stroke.segments.forEach((seg) => {
        const coolT = isReducedMotion ? 1 : Math.min(1, (now - seg.t0) / 1500);
        if (coolT < 1) {
          hasCoolingSegment = true;
        }
        const color = interpolateSugarCoolColor(coolT);

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = seg.w;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 253, 248, 0.45)';
        ctx.lineWidth = Math.max(1, seg.w * 0.28);
        ctx.beginPath();
        ctx.moveTo(seg.x1 - 0.8, seg.y1 - 0.8);
        ctx.lineTo(seg.x2 - 0.8, seg.y2 - 0.8);
        ctx.stroke();
        ctx.restore();
      });
    });

    if (isDrawingRef.current || hasCoolingSegment) {
      rafIdRef.current = requestAnimationFrame(renderSlabFrame);
    } else {
      rafIdRef.current = null;
    }
  }, [isReducedMotion]);

  const startLoopIfNeeded = useCallback(() => {
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(renderSlabFrame);
    }
  }, [renderSlabFrame]);

  useEffect(() => {
    renderSlabFrame();
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderSlabFrame]);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      t: performance.now()
    };
  };

  const handlePointerDown = (e) => {
    if (onPropagationStop) onPropagationStop(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getCanvasPoint(e);
    isDrawingRef.current = true;
    lastPointRef.current = pt;
    currentLengthRef.current = 0;
    setOneStrokeEasterEgg(false);
    strokesRef.current.push({ segments: [] });
    startLoopIfNeeded();
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const pt = getCanvasPoint(e);
    const prev = lastPointRef.current;
    const dx = pt.x - prev.x;
    const dy = pt.y - prev.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1.5) return;

    const dt = Math.max(1, pt.t - prev.t);
    const speed = dist / dt;

    const width = Math.max(2.2, Math.min(8.8, 8.8 - speed * 4.2));
    const jitterX = isReducedMotion ? 0 : (Math.random() - 0.5) * 1.6;
    const jitterY = isReducedMotion ? 0 : (Math.random() - 0.5) * 1.6;

    const targetX = pt.x + jitterX;
    const targetY = pt.y + jitterY;

    const activeStroke = strokesRef.current[strokesRef.current.length - 1];
    if (activeStroke) {
      activeStroke.segments.push({
        x1: prev.x,
        y1: prev.y,
        x2: targetX,
        y2: targetY,
        w: width,
        t0: pt.t
      });
    }

    currentLengthRef.current += dist;
    setStrokeLengthReadout(Math.round(currentLengthRef.current));
    lastPointRef.current = { x: targetX, y: targetY, t: pt.t };
    startLoopIfNeeded();
  };

  const handlePointerUpOrCancel = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    if (currentLengthRef.current > 260) {
      setOneStrokeEasterEgg(true);
    }
    startLoopIfNeeded();
  };

  const handleClearSlab = (e) => {
    if (onPropagationStop) onPropagationStop(e);
    strokesRef.current = [];
    currentLengthRef.current = 0;
    setStrokeLengthReadout(0);
    setOneStrokeEasterEgg(false);
    renderSlabFrame();
  };

  return (
    <div
      className="marble-slab-widget"
      data-scroll-paging-ignore="true"
      onClick={(e) => e.stopPropagation()}
      style={{ marginTop: '12px', position: 'relative' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>
          <strong style={{ color: 'var(--text-main)' }}>【石板画糖台】</strong>
          按住拖动浇糖（快则丝细、慢则浆粗，一笔满 260px 触发彩蛋）
        </span>
        <span style={{ fontWeight: 600, color: strokeLengthReadout > 260 ? 'var(--cinnabar-red)' : 'var(--sugar-600)' }}>
          当前单笔：{strokeLengthReadout} / 260px
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          borderRadius: '10px',
          border: '2px solid var(--sugar-600)',
          backgroundImage: TEXTURE_URIS.marbleSlab,
          backgroundSize: '160px 160px',
          overflow: 'hidden',
          touchAction: 'none'
        }}
        data-scroll-paging-ignore="true"
      >
        <canvas
          ref={canvasRef}
          width={360}
          height={210}
          style={{ width: '100%', height: '210px', display: 'block', cursor: 'crosshair' }}
          data-scroll-paging-ignore="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
        />

        <div
          className="craft-chant-overlay"
          style={{
            opacity: oneStrokeEasterEgg ? 1 : 0,
            pointerEvents: oneStrokeEasterEgg ? 'auto' : 'none'
          }}
          onClick={() => setOneStrokeEasterEgg(false)}
        >
          {oneStrokeEasterEgg && <SealStamp text="成" size={32} animate />}
          <p
            className="serif-title"
            style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#FFFDF8', marginTop: '8px' }}
          >
            【一笔不断 · 皮糖张彩蛋达成】<br />
            “手腕悬空走龙蛇，铜勺倾处琥珀凝；一笔不断千钧力，方寸石板见丹青！”
          </p>
          <span style={{ fontSize: '0.76rem', color: 'var(--sugar-100)', marginTop: '6px' }}>
            （轻点浮层继续赏玩或点击下方“铲糖重来”）
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          1.5 秒自然冷却凝珀 · 零外网纯手写画板
        </span>
        <button
          type="button"
          className="xuan-tag-btn"
          onClick={handleClearSlab}
          style={{
            minHeight: '44px',
            padding: '6px 16px',
            borderRadius: '6px',
            border: '1.2px solid var(--sugar-600)',
            background: 'var(--surface-paper)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '0.86rem'
          }}
        >
          铲糖重来
        </button>
      </div>
    </div>
  );
}

export default function Archive({ chinaGeoJson }) {
  const mapContainerRef = useRef(null);
  const cardRefs = useRef({});
  const solarTrackRef = useRef(null);
  const [activeProvince, setActiveProvince] = useState('四川省');
  const [mapReady, setMapReady] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [expandedTermId, setExpandedTermId] = useState('spring-festival');

  // GeoJSON 数据源（优先级从高到低）：
  //   外部 prop → 单文件版构建脚本注入的 window.__CHINA_GEO__ → 目录版 fetch public/chinaGeo.json → 内置矩形兜底
  const [geoData, setGeoData] = useState(() => {
    if (chinaGeoJson) return chinaGeoJson;
    if (typeof window !== 'undefined' && window.__CHINA_GEO__) return window.__CHINA_GEO__;
    return null;
  });

  useEffect(() => {
    if (geoData) return undefined;
    let cancelled = false;
    fetch(import.meta.env.BASE_URL + 'chinaGeo.json')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setGeoData(json);
      })
      .catch(() => setGeoData(FALLBACK_CHINA_GEOJSON));
    return () => {
      cancelled = true;
    };
  }, [geoData]);

  // 地图初始化健壮化（2026-10-14/16 两度实测：ECharts 在容器尚未完成布局时初始化，
  // 随后 resize 抛错会拖垮整棵 React 树导致全站白屏）：
  //   1) 延迟到容器宽高非 0 后才 init，并把初始化移出 React 提交阶段；
  //   2) resize 前判断 isDisposed 与容器尺寸，并包 try/catch；
  //   3) setOption 同样包 try/catch —— 图表异常只降级，绝不让页面其他部分陪葬。
  useEffect(() => {
    const container = mapContainerRef.current;
    const effectiveGeoJson = geoData || FALLBACK_CHINA_GEOJSON;
    if (!container) return undefined;

    let chart = null;
    let rafId = 0;
    let cancelled = false;

    const safeResize = () => {
      if (!chart || chart.isDisposed()) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) return;
      try {
        chart.resize();
      } catch (err) {
        /* 容器尺寸变化瞬间可能抛错，忽略，下一帧会重新校正 */
      }
    };

    const buildChart = () => {
      if (cancelled) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        rafId = requestAnimationFrame(buildChart);
        return;
      }

      echarts.registerMap('china_heritage', effectiveGeoJson);
      chart = echarts.init(container);

    const activeProvinces = HERITAGE_SCHOOLS.map((s) => s.province);
    const mapData = activeProvinces.map((prov) => ({
      name: prov,
      value: 1,
      itemStyle: {
        areaColor: '#EF9F27',
        borderColor: '#412402',
        borderWidth: 1.2
      },
      label: {
        show: true,
        formatter: `{tag|${prov}}`,
        rich: {
          tag: {
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#412402',
            backgroundColor: '#F7F1E1',
            borderColor: '#B91C1C',
            borderWidth: 1,
            borderRadius: 3,
            padding: [2, 5]
          }
        }
      }
    }));

    try {
      chart.setOption({
        tooltip: {
          trigger: 'item',
          backgroundColor: '#F7F1E1',
          borderColor: '#BA7517',
          borderWidth: 1.5,
          padding: [10, 14],
          textStyle: {
            color: '#412402',
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 13
          },
          formatter: (params) => {
            const found = HERITAGE_SCHOOLS.find((s) => s.province === params.name);
            if (found) {
              return `
                  <div style="position:relative;">
                    <div style="color:#B91C1C;font-weight:700;margin-bottom:4px;">● ${found.name}</div>
                    <div style="font-size:12px;color:#7A5832;">点击省份定位右侧流派详档与互动石板</div>
                  </div>
                `;
            }
            // 未收录省份只显示地名：不写「待收录」，避免在成品里留下未完成的暗示
            return `<span style="color:#7A5832;">${params.name}</span>`;
          }
        },
        series: [
          {
            type: 'map',
            map: 'china_heritage',
            roam: false,
            itemStyle: {
              areaColor: '#F1EFE8',
              borderColor: 'rgba(186, 117, 23, 0.35)',
              borderWidth: 0.8
            },
            emphasis: {
              itemStyle: {
                areaColor: '#FAC775',
                borderColor: '#B91C1C',
                borderWidth: 1.6
              },
              label: {
                show: true,
                color: '#412402',
                fontWeight: 'bold'
              }
            },
            data: mapData
          }
        ]
      });
    } catch (err) {
      /* 图表渲染异常不应影响页面其余部分 */
    }

    setMapReady(true);

    chart.on('click', (params) => {
      const target = HERITAGE_SCHOOLS.find((s) => s.province === params.name);
      if (target) {
        setActiveProvince(target.province);
        const cardEl = cardRefs.current[target.province];
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // 初始化完成后下一帧再校正一次尺寸（字体加载 / 滚动条出现可能改变可用宽高）
    rafId = requestAnimationFrame(safeResize);
  };

  rafId = requestAnimationFrame(buildChart);
  window.addEventListener('resize', safeResize);

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', safeResize);
    if (chart && !chart.isDisposed()) chart.dispose();
  };
}, [geoData]);

  const handleSolarTrackKeyDown = (e) => {
    if (!solarTrackRef.current) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      solarTrackRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      solarTrackRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  return (
    <main className="page-container" onClick={() => setActiveStepId(null)}>
      <header className="section-header">
        <span className="section-badge">
          <CraftIcon name="ladle" />
          中国非遗 · 档案百科
        </span>
        <h1 className="section-title" tabIndex="-1">
          中华糖艺流派与四法图谱
        </h1>
        <p className="section-subtitle">
          点亮宣纸古舆图查阅非遗流派，并可在右侧「成都糖画 · 皮糖张」大理石板上亲手提勺画糖。
        </p>
        <SealStamp text="馆" onceKey="header-seal-archive" />
      </header>

      <section className="archive-split" aria-label="非遗糖人流派地理分布">
        <div className="archive-map-pane">
          {!mapReady && (
            <div className="map-loading-tag" role="status">
              <div className="sugar-spinner" />
              <span className="serif-title" style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                正在铺展宣纸舆图…
              </span>
            </div>
          )}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          <div className="ancient-map-overlay" aria-hidden="true" />
        </div>

        <div className="archive-list-pane">
          {HERITAGE_SCHOOLS.map((school) => (
            <article
              key={school.id}
              ref={(el) => {
                cardRefs.current[school.province] = el;
              }}
              className={`school-card ${activeProvince === school.province ? 'highlighted' : ''}`}
              onClick={() => setActiveProvince(school.province)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                <span className="section-badge" style={{ marginBottom: 0 }}>
                  {school.short}传承区
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {school.batch}
                </span>
              </div>
              <h2 className="serif-title" style={{ fontSize: '1.22rem', marginBottom: '6px' }}>
                {school.name}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{school.desc}</p>

              {school.isInteractiveSlab && <MarbleSugarSlab />}

              <blockquote className="craft-proverb">{school.proverb}</blockquote>
            </article>
          ))}
        </div>
      </section>

      <PatternDivider variant="fret" />

      <section aria-labelledby="craft-steps-heading">
        <div className="section-header sub-plaque">
          <h2 id="craft-steps-heading" className="serif-title" style={{ fontSize: '1.5rem' }}>
            吹 · 拉 · 剪 · 塑 —— 四步核心技法口诀
          </h2>
          <p className="section-subtitle">
            电脑端悬停（移动端单次点击卡片）即可暂停动画并呼出非遗传承人秘传口诀，再次点击空白处关闭。
          </p>
        </div>

        <div className="craft-steps-row">
          {CRAFT_STEPS.map((item) => {
            const isActive = activeStepId === item.id;
            return (
              <div
                key={item.id}
                className={`craft-step-card ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStepId(isActive ? null : item.id);
                }}
              >
                <div className="craft-svg-anim" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CraftIcon name={item.icon} className="craft-line-icon" />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--cinnabar-red)', fontWeight: 700 }}>
                  {item.step}
                </span>
                <h3 className="serif-title" style={{ fontSize: '1.2rem', margin: '4px 0 8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.summary}</p>

                <div className="craft-chant-overlay">
                  <SealStamp text="诀" size={24} animate={isActive} />
                  <p className="serif-title" style={{ fontSize: '0.96rem', lineHeight: 1.6, color: '#FFFDF8', marginTop: '8px' }}>
                    {item.chant}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <PatternDivider variant="cloud" />

      <section aria-labelledby="solar-terms-heading" style={{ marginTop: '12px' }}>
        <div className="section-header sub-plaque">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
            <h2 id="solar-terms-heading" className="serif-title" style={{ fontSize: '1.5rem' }}>
              岁时糖艺 · 八节令食俗卷轴
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--cinnabar-red)', fontWeight: 600 }}>
              注：民间习俗地域差异较大（支持键盘 Tab 聚焦与 ← → 方向键滑动）
            </span>
          </div>
          <p className="section-subtitle">
            从正月初一庙会生肖糖人到腊月廿三祭灶糖瓜，一勺麦芽糖串联起中国人的一年岁时冷暖。
          </p>
        </div>

        <div
          ref={solarTrackRef}
          className="solar-terms-track"
          tabIndex="0"
          role="region"
          aria-label="岁时节令糖艺八节令横向卷轴，可使用左右方向键滚动"
          data-scroll-paging-ignore="true"
          onKeyDown={handleSolarTrackKeyDown}
        >
          {SOLAR_TERM_SUGAR_LIST.map((item) => {
            const isExpanded = expandedTermId === item.id;
            return (
              <article
                key={item.id}
                className={`solar-term-card ${isExpanded ? 'expanded' : ''}`}
                tabIndex="0"
                onClick={() => setExpandedTermId(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedTermId(item.id);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="section-badge" style={{ marginBottom: 0 }}>
                    {item.term}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CraftIcon name={item.icon} />
                    {isExpanded && <SealStamp text="节" size={22} onceKey={`solar-${item.id}`} />}
                  </div>
                </div>
                <h3 className="serif-title" style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
                  {item.theme}
                </h3>
                <blockquote className="craft-proverb" style={{ margin: '8px 0' }}>
                  {item.proverb}
                </blockquote>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  考据说明：{item.citation}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}