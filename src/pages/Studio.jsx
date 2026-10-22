import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PatternDivider } from '../assets/patterns';
import SealStamp from '../components/SealStamp';
import { REGRET_MUSEUM_ITEMS } from '../data/sugarCouplets';

/**
 * 五件套非遗工具线性图标系统（2px 圆头线、currentColor，零外部请求）
 * 包含：铜勺(ladle) / 苇管(reed) / 竹签(skewer) / 铜剪(scissors) / 糖锅(pot)
 */
export function CraftIcon({ name, className = 'craft-line-icon' }) {
  switch (name) {
    case 'ladle':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4,15 A6,5 0 1,0 16,15 C16,12 13,11 10,11 C7,11 4,12 4,15 Z" />
          <path d="M15,13 L21,5" />
          <path d="M8,15 Q10,17 12,15" />
        </svg>
      );
    case 'reed':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M6,19 L15,10" />
          <circle cx="17.5" cy="7.5" r="3.5" />
          <path d="M9,16 L11,14" />
        </svg>
      );
    case 'skewer':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12,3 L12,21" />
          <circle cx="12" cy="7" r="3.5" />
          <path d="M10,14 L14,14" />
        </svg>
      );
    case 'brush':
      // 画笔（条漫入口用；糖画本行「以铜勺为笔」，故此 glyph 不离本行）
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M15,4 L19,8 L9,18 L5,18 L5,14 Z" />
          <path d="M5,18 L3,21" />
          <path d="M13,6 L17,10" />
        </svg>
      );
    case 'reel':
      // 胶卷（影片入口用；中性 UI glyph，非装饰纹样）
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M8,5 L8,19 M16,5 L16,19" />
          <path d="M5.5,9 L7,9 M5.5,12 L7,12 M5.5,15 L7,15 M17,9 L18.5,9 M17,12 L18.5,12 M17,15 L18.5,15" />
        </svg>
      );
    case 'scroll':
      // 卷轴（封面页 / 卷首入口用；与站内卷轴轴头、糖的来路时间轴同一视觉语言）
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="2.5" y="7" width="3" height="10" rx="1.5" />
          <rect x="18.5" y="7" width="3" height="10" rx="1.5" />
          <path d="M5.5,9 L18.5,9 M5.5,12 L18.5,12 M5.5,15 L18.5,15" />
        </svg>
      );
    case 'scissors':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="6.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
          <path d="M8.5,15.5 L18,4" />
          <path d="M15.5,15.5 L6,4" />
        </svg>
      );
    case 'pot':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4,11 L20,11 C20,17 16.5,20 12,20 C7.5,20 4,17 4,11 Z" />
          <path d="M2,11 L4,11 M20,11 L22,11" />
          <path d="M9,7 Q10,4 9,3 M15,7 Q16,4 15,3" />
        </svg>
      );
  }
}

export function CloudDivider() {
  return <PatternDivider variant="cloud" />;
}

/**
 * 十二生肖传统民间吹糖人矢量图谱（100×100 视口纯本地 SVG 数据）
 */
export const ZODIAC_DATA = [
  {
    id: 'rat',
    name: '子鼠',
    title: '灵鼠偷油',
    blessing: '机敏灵巧 · 仓廪丰实',
    path:
      'M50,84 C43,84 41,79 35,77 C26,74 23,62 26,50 C28,43 32,39 34,35 C27,33 25,23 32,20 C37,18 42,22 42,28 C45,27 48,27 50,27 C49,20 55,16 61,19 C67,22 65,32 58,34 C63,39 66,47 66,56 C71,50 74,38 73,30 C72,25 78,25 79,32 C80,44 76,59 68,68 C67,74 63,77 57,78 C55,81 54,84 50,84 Z',
    patches: [
      { d: 'M32,27 C31,23 37,21 39,25 C40,28 34,30 32,27 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M53,24 C52,20 58,19 60,23 C61,26 55,28 53,24 Z', fill: '#BA7517', opacity: 0.32 }
    ],
    featureStrokePath:
      'M33,49 Q40,53 44,50 M60,48 Q53,53 49,50 M39,51 Q46,57 54,51 Q52,56 46,56 Q41,56 39,51 Z',
    featureFillPath: 'M46,42 C49,45 49,48 46,50 C43,48 43,45 46,42 Z',
    cloudPath: 'M42,66 Q48,59 54,66 Q48,73 42,66 Z',
    eyes: [
      { cx: 39, cy: 35, r: 2 },
      { cx: 49, cy: 33, r: 2 }
    ],
    dots: []
  },
  {
    id: 'ox',
    name: '丑牛',
    title: '春牛耕云',
    blessing: '脚踏实地 · 五谷丰登',
    path:
      'M50,84 C43,84 42,80 36,80 C31,80 29,76 30,69 C26,61 27,50 31,42 C24,41 21,36 25,32 C28,29 32,30 35,31 C29,25 27,16 33,15 C37,15 39,21 43,25 C48,24 53,24 58,26 C62,21 65,16 69,17 C74,18 71,26 65,31 C68,31 73,31 75,35 C78,39 74,43 68,43 C72,51 73,61 69,69 C70,76 68,80 63,80 C57,80 56,84 50,84 Z',
    patches: [
      { d: 'M25,35 Q29,33 32,35 Q29,39 25,35 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M67,36 Q71,34 74,37 Q70,40 67,36 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M37,43 C37,38 63,38 63,43 C63,49 37,49 37,43 Z', fill: '#633806', opacity: 0.82 }
    ],
    featureStrokePath: 'M37,64 Q38,73 36,78 M62,64 Q61,73 63,78',
    featureFillPath: '',
    cloudPath: 'M44,58 Q50,50 56,58 Q50,66 44,58 Z',
    eyes: [
      { cx: 40, cy: 33, r: 2 },
      { cx: 59, cy: 35, r: 2 }
    ],
    dots: [
      { cx: 45, cy: 43, r: 1.4, fill: '#FFFDF8' },
      { cx: 55, cy: 43, r: 1.4, fill: '#FFFDF8' }
    ]
  },
  {
    id: 'tiger',
    name: '寅虎',
    title: '山君啸谷',
    blessing: '虎虎生威 · 辟邪纳福',
    path:
      'M50,84 C43,84 41,80 35,80 C30,80 28,74 30,66 C27,57 28,46 33,38 C27,31 27,20 34,18 C39,17 42,21 44,24 C48,22 53,23 57,25 C60,21 64,18 69,20 C75,23 73,32 67,37 C71,44 72,53 69,61 C73,55 75,45 74,39 C73,34 79,35 79,42 C80,53 76,66 69,73 C68,78 65,80 61,80 C56,80 55,84 50,84 Z',
    patches: [
      { d: 'M32,23 C32,20 37,20 37,23 C37,26 32,26 32,23 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M64,24 C64,21 69,21 69,24 C69,27 64,27 64,24 Z', fill: '#BA7517', opacity: 0.32 }
    ],
    featureStrokePath:
      'M44,26 Q50,25 56,26 M45,30 Q50,29 55,30 M43,34 Q50,33 57,34 M50,25 Q50,29 50,34 M31,52 Q37,50 40,53 M30,59 Q36,57 39,60 M31,66 Q37,64 40,67 M67,51 Q61,49 58,52 M68,58 Q62,56 59,59 M66,65 Q60,63 57,66',
    featureFillPath: '',
    cloudPath: 'M43,58 Q49,50 55,58 Q49,66 43,58 Z',
    eyes: [
      { cx: 41, cy: 39, r: 2 },
      { cx: 58, cy: 37, r: 2 }
    ],
    dots: []
  },
  {
    id: 'rabbit',
    name: '卯兔',
    title: '玉兔捣药',
    blessing: '温润如玉 · 前途似锦',
    path:
      'M50,84 C44,84 42,80 36,79 C28,76 26,63 35,53 C40,49 41,46 39,42 C35,30 34,15 41,14 C46,14 48,28 47,40 C49,40 52,40 54,41 C57,28 63,15 68,17 C73,19 67,33 59,43 C56,46 56,49 60,52 C68,57 71,66 68,73 C73,72 76,76 73,80 C70,83 65,81 61,80 C56,81 55,84 50,84 Z',
    patches: [
      { d: 'M39,19 C38,27 39,34 42,38 C44,34 44,27 42,19 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M65,22 C62,29 59,35 57,39 C60,37 64,30 66,23 Z', fill: '#BA7517', opacity: 0.32 }
    ],
    featureStrokePath: 'M45,54 Q48,57 51,54 M48,55 Q46,59 43,58 M48,55 Q50,59 53,58',
    featureFillPath: '',
    cloudPath: 'M43,66 Q49,58 55,66 Q49,74 43,66 Z',
    eyes: [
      { cx: 42, cy: 48, r: 2 },
      { cx: 54, cy: 50, r: 2 }
    ],
    dots: []
  },
  {
    id: 'dragon',
    name: '辰龙',
    title: '金龙盘柱',
    blessing: '龙腾四海 · 风调雨顺',
    path:
      'M50,84 C43,84 41,80 34,79 C26,77 25,68 34,66 C43,64 53,65 54,59 C55,53 39,52 32,45 C25,47 20,45 21,40 C22,36 28,37 32,39 C31,34 34,30 39,28 C29,29 22,26 23,20 C24,15 32,16 39,18 C39,12 44,10 47,16 C50,16 52,16 54,17 C57,11 63,12 61,18 C68,21 71,28 65,34 C59,40 51,40 51,45 C51,50 63,51 70,57 C75,55 80,57 79,62 C78,66 73,65 69,63 C72,72 67,79 58,80 C55,81 54,84 50,84 Z',
    patches: [],
    featureStrokePath:
      'M27,21 Q33,23 38,21 M56,26 Q46,33 40,41 Q41,49 58,56 Q64,63 58,71 M35,72 Q40,69 45,72',
    featureFillPath: '',
    cloudPath: 'M44,73 Q50,66 56,73 Q50,80 44,73 Z',
    eyes: [
      { cx: 42, cy: 22, r: 2 },
      { cx: 52, cy: 21, r: 2 }
    ],
    dots: []
  },
  {
    id: 'snake',
    name: '巳蛇',
    title: '灵蛇盘福',
    blessing: '生生不息 · 智慧通达',
    path:
      'M50,84 C43,84 41,80 35,78 C27,75 27,65 36,62 C45,59 55,61 56,55 C57,49 37,49 31,41 C26,34 34,27 40,25 C33,22 33,14 44,14 C55,14 64,17 62,25 C60,30 52,31 47,33 C42,35 42,40 53,43 C66,47 72,55 69,65 C73,63 76,65 74,71 C72,77 65,79 58,80 C55,81 53,84 50,84 Z',
    patches: [],
    featureStrokePath:
      'M43,23 Q48,26 53,23 M33,37 Q37,34 41,37 M55,53 Q60,50 64,53 M34,70 Q39,67 43,70',
    featureFillPath: '',
    cloudPath: 'M44,71 Q50,64 56,71 Q50,78 44,71 Z',
    eyes: [
      { cx: 43, cy: 19, r: 2 },
      { cx: 54, cy: 20, r: 2 }
    ],
    dots: []
  },
  {
    id: 'horse',
    name: '午马',
    title: '天马踏燕',
    blessing: '龙马精神 · 一马当先',
    path:
      'M50,84 C43,84 41,80 33,79 C26,78 24,72 28,63 C31,56 32,49 28,43 C25,38 28,33 32,31 C24,33 19,31 20,26 C21,21 28,20 34,22 C33,16 37,14 40,19 C43,15 47,16 45,22 C51,21 55,24 52,28 C58,28 61,32 58,36 C64,36 70,38 72,43 C76,36 81,38 80,48 C79,57 74,62 70,56 C69,61 71,67 73,72 C75,77 72,80 66,80 C59,80 56,84 50,84 Z',
    patches: [
      { d: 'M38,74 C38,61 61,61 61,74 C54,73 45,73 38,74 Z', fill: '#FFFDF8', opacity: 0.68 }
    ],
    featureStrokePath:
      'M42,25 Q48,28 52,33 M38,74 C38,61 61,61 61,74 M33,58 Q35,68 33,76 M65,58 Q64,68 66,76',
    featureFillPath: '',
    cloudPath: 'M45,48 Q51,41 57,48 Q51,55 45,48 Z',
    eyes: [
      { cx: 28, cy: 25, r: 2 },
      { cx: 35, cy: 23, r: 2 }
    ],
    dots: []
  },
  {
    id: 'goat',
    name: '未羊',
    title: '三阳开泰',
    blessing: '吉祥如意 · 岁岁平安',
    path:
      'M50,84 C43,84 41,80 35,80 C30,80 29,75 31,68 C27,60 27,50 31,42 C23,39 21,27 28,20 C34,15 42,18 44,24 C48,23 52,23 56,24 C59,18 67,16 73,21 C79,28 77,40 69,43 C73,51 73,60 69,68 C71,75 69,80 64,80 C58,80 56,84 50,84 Z',
    patches: [],
    featureStrokePath:
      'M41,26 C37,20 28,21 28,28 C28,34 36,34 36,29 C36,26 32,26 32,28 M59,27 C63,21 72,22 72,29 C72,35 64,35 64,30 C64,27 68,27 68,29 M48,43 Q45,51 52,49 M38,65 Q39,73 37,77 M62,65 Q61,73 63,77',
    featureFillPath: '',
    cloudPath: 'M44,58 Q50,50 56,58 Q50,66 44,58 Z',
    eyes: [
      { cx: 43, cy: 35, r: 2 },
      { cx: 57, cy: 33, r: 2 }
    ],
    dots: []
  },
  {
    id: 'monkey',
    name: '申猴',
    title: '灵猴献寿',
    blessing: '封侯拜相 · 喜乐常伴',
    path:
      'M50,84 C43,84 41,80 36,79 C31,78 30,71 33,64 C28,56 28,45 33,38 C26,35 25,25 33,24 C35,24 37,25 38,26 C43,18 54,18 60,25 C62,24 65,24 67,26 C73,30 70,38 64,39 C68,45 69,53 67,60 C72,54 74,42 72,34 C71,28 77,28 78,35 C80,47 76,62 68,70 C68,76 65,79 60,79 C55,80 54,84 50,84 Z',
    patches: [
      {
        d: 'M36,30 C36,24 46,24 48,29 C50,24 60,25 60,32 C60,39 54,43 48,43 C41,43 36,38 36,30 Z',
        fill: '#FFFDF8',
        opacity: 0.55
      },
      {
        d: 'M48,46 C54,49 56,55 52,59 C48,62 44,59 44,54 C44,50 46,48 48,46 Z',
        fill: '#EF9F27',
        opacity: 0.55
      }
    ],
    featureStrokePath:
      'M34,49 Q41,55 45,53 M63,48 Q56,55 52,53 M48,45 C54,48 56,55 51,59 C46,61 42,56 44,50 C45,47 47,46 48,45 Z',
    featureFillPath: '',
    cloudPath: 'M43,67 Q49,59 55,67 Q49,75 43,67 Z',
    eyes: [
      { cx: 43, cy: 32, r: 2 },
      { cx: 54, cy: 34, r: 2 }
    ],
    dots: []
  },
  {
    id: 'rooster',
    name: '酉鸡',
    title: '金鸡报晓',
    blessing: '闻鸡起舞 · 大吉大利',
    path:
      'M50,84 C43,84 41,80 37,78 C39,74 40,70 38,67 C30,63 26,53 29,44 C25,44 23,39 27,36 C21,34 21,29 28,28 C30,28 31,27 32,25 C31,18 35,14 38,19 C40,13 45,13 47,19 C50,14 55,15 55,21 C58,17 62,20 59,26 C57,31 56,36 60,40 C67,36 76,37 79,44 C81,48 77,52 73,52 C78,54 80,59 76,63 C74,66 70,66 67,65 C71,69 69,74 63,75 C60,76 58,74 56,73 C56,77 58,79 61,80 C56,81 55,84 50,84 Z',
    patches: [],
    featureStrokePath:
      'M60,45 Q70,41 76,46 M59,51 Q70,48 75,56 M58,57 Q67,56 69,63 M40,76 Q46,74 50,77 Q54,74 59,76',
    featureFillPath: '',
    cloudPath: 'M40,54 Q46,46 52,54 Q46,62 40,54 Z',
    eyes: [
      { cx: 35, cy: 29, r: 2 },
      { cx: 43, cy: 27, r: 2 }
    ],
    dots: []
  },
  {
    id: 'dog',
    name: '戌狗',
    title: '瑞犬护宅',
    blessing: '忠厚传家 · 阖家安康',
    path:
      'M50,84 C43,84 41,80 35,80 C29,80 28,73 30,63 C29,53 31,45 34,40 C26,40 20,37 21,31 C22,26 27,26 32,26 C38,19 52,19 58,26 C63,31 62,40 59,46 C65,51 68,58 68,64 C71,62 72,56 70,52 C69,47 75,45 77,51 C79,59 75,69 68,73 C67,78 64,80 59,80 C55,80 54,84 50,84 Z',
    patches: [
      { d: 'M34,26 C29,30 29,41 34,42 C38,42 39,32 34,26 Z', fill: '#BA7517', opacity: 0.35 },
      { d: 'M55,25 C59,29 61,40 56,41 C52,41 51,31 55,25 Z', fill: '#BA7517', opacity: 0.35 }
    ],
    featureStrokePath:
      'M34,26 C29,30 29,41 34,42 C38,42 39,32 34,26 M55,25 C59,29 61,40 56,41 C52,41 51,31 55,25 M34,44 Q46,49 58,44 M38,65 Q39,73 37,77 M58,65 Q57,73 59,77',
    featureFillPath: '',
    cloudPath: 'M42,59 Q48,51 54,59 Q48,67 42,59 Z',
    eyes: [
      { cx: 39, cy: 29, r: 2 },
      { cx: 49, cy: 28, r: 2 }
    ],
    dots: [
      { cx: 23, cy: 31, r: 2, fill: '#412402' },
      { cx: 46, cy: 48, r: 2.4, fill: '#B91C1C' }
    ]
  },
  {
    id: 'pig',
    name: '亥猪',
    title: '金猪拱福',
    blessing: '福气满满 · 诸事顺遂',
    path:
      'M50,84 C43,84 41,80 35,80 C30,80 28,75 29,68 C25,60 25,49 28,40 C23,36 24,26 32,24 C34,24 36,24 38,25 C45,21 55,21 62,25 C64,24 67,24 69,25 C76,28 76,38 71,41 C73,47 74,53 73,58 C77,56 80,61 77,65 C75,68 72,67 71,66 C70,73 68,80 62,80 C57,80 55,84 50,84 Z',
    patches: [
      { d: 'M37,25 C28,23 24,32 30,37 C34,39 39,32 37,25 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M63,26 C72,24 75,33 69,38 C65,40 61,33 63,26 Z', fill: '#BA7517', opacity: 0.32 },
      { d: 'M42,45 C42,40 58,40 58,45 C58,50 42,50 42,45 Z', fill: '#FFFDF8', opacity: 0.45 }
    ],
    featureStrokePath:
      'M37,25 C28,23 24,32 30,37 C34,39 39,32 37,25 M63,26 C72,24 75,33 69,38 C65,40 61,33 63,26 M42,45 C42,40 58,40 58,45 C58,50 42,50 42,45 Z',
    featureFillPath: '',
    cloudPath: 'M44,61 Q50,53 56,61 Q50,69 44,61 Z',
    eyes: [
      { cx: 40, cy: 35, r: 2 },
      { cx: 59, cy: 37, r: 2 }
    ],
    dots: [
      { cx: 47, cy: 45, r: 1.5, fill: '#412402' },
      { cx: 53, cy: 45, r: 1.5, fill: '#412402' }
    ]
  }
];

const SUGAR_SWATCHES = [
  { id: 'light-gold', label: '浅金（初熬麦芽）', hex: '#FAC775' },
  { id: 'warm-amber', label: '暖橙（文火琥珀）', hex: '#EF9F27' },
  { id: 'deep-brown', label: '深棕（老灶红糖）', hex: '#BA7517' }
];

function getSugarColorStyle(sugarColor) {
  const isLightGold = sugarColor === '#FAC775';
  const isDeepBrown = sugarColor === '#BA7517';
  return {
    strokeColor: isLightGold ? '#633806' : '#412402',
    showInnerRim: isDeepBrown,
    glossTopOpacity: isDeepBrown ? 0.75 : 0.6
  };
}

export function getBlowPhysics(blowPercent) {
  const b = Math.min(1, Math.max(0, blowPercent / 100));
  const scaleX = (0.76 + b * 0.54).toFixed(3);
  const scaleY = (0.82 + Math.pow(b, 0.88) * 0.44).toFixed(3);
  const svgOpacity = (0.95 - b * 0.3).toFixed(3);
  const wallStroke = (3.0 - b * 0.85).toFixed(2);
  const cavityRx = (8 + b * 16).toFixed(1);
  const cavityRy = (10 + b * 20).toFixed(1);
  const cavityOpacity = (0.12 + b * 0.42).toFixed(2);

  let stageLabel = '【初坯挂管】糖胎厚实，紧裹苇管吹口';
  if (blowPercent > 96) {
    stageLabel = '【糖膜破裂】吹气过猛糖泡崩裂！请点击“重揉糖胎”';
  } else if (blowPercent >= 65) {
    stageLabel = '【黄金成型】糖膜薄如蝉翼，琥珀光晕流转（最佳打卡品相）';
  } else if (blowPercent > 20) {
    stageLabel = '【提气鼓腹】仙气贯入糖腹，中空气腔渐次撑开（未完成态）';
  }

  return {
    scaleX,
    scaleY,
    svgOpacity,
    wallStroke,
    cavityRx,
    cavityRy,
    cavityOpacity,
    stageLabel
  };
}

function getTempStageConfig(temp) {
  if (temp < 75) {
    return {
      stage: 1,
      color: '#FAC775',
      tag: '第一档 · 低温凝滞 (< 75°C)',
      tip: '温度不够，咬不动、拉不开',
      isWarn: false
    };
  }
  if (temp <= 115) {
    return {
      stage: 2,
      color: '#EF9F27',
      tag: '第二档 · 黄金塑形区 (75°C ~ 115°C)',
      tip: '手艺人最佳塑形时间！粘稠可吹、能拉细丝',
      isWarn: false
    };
  }
  if (temp <= 139) {
    return {
      stage: 3,
      color: '#BA7517',
      tag: '第三档 · 高温过稀 (116°C ~ 139°C)',
      tip: '火太旺糖太稀，小动物吹出来容易塌掉',
      isWarn: false
    };
  }
  return {
    stage: 4,
    color: '#712B13',
    tag: '第四档 · 焦化警戒 (≥ 140°C)',
    tip: '焦糖化过度，糖糊发苦啦！',
    isWarn: true
  };
}

/**
 * 【B-3】拉丝金线（拔丝台，与石板糖画并列成“糖画双台”）
 * 自检修复：使用 pullMetricRef 记录实时拉丝坐标与长度，避免在 setPullState 内部调用 setTimeout 引发 StrictMode 双重触发
 */
function SugarPullingStage({ onCollectSilkPostcard }) {
  const svgRef = useRef(null);
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const pullMetricRef = useRef({ endX: 180, endY: 165, length: 0 });

  const [pullState, setPullState] = useState({
    endX: 180,
    endY: 165,
    length: 0,
    status: 'idle', // 'idle' | 'pulling' | 'solidified' | 'snapped'
    oscillation: 0,
    collected: false
  });

  const potOrigin = { x: 180, y: 175 };
  const criticalLength = 225;
  const minArtLength = 75;

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => () => stopRaf(), []);

  const triggerElasticSettle = (finalStatus) => {
    stopRaf();
    if (isReducedMotion) {
      setPullState((prev) => ({ ...prev, status: finalStatus, oscillation: 0 }));
      return;
    }
    let t = 0;
    const animateSpring = () => {
      t += 0.16;
      const damp = Math.exp(-t * 0.72);
      const osc = Math.sin(t * 4.5) * 14 * damp;
      if (damp < 0.04) {
        setPullState((prev) => ({ ...prev, status: finalStatus, oscillation: 0 }));
        rafRef.current = null;
        return;
      }
      setPullState((prev) => ({ ...prev, status: finalStatus, oscillation: osc }));
      rafRef.current = requestAnimationFrame(animateSpring);
    };
    rafRef.current = requestAnimationFrame(animateSpring);
  };

  const getSvgCoords = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 360,
      y: ((e.clientY - rect.top) / rect.height) * 220
    };
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    stopRaf();
    draggingRef.current = true;
    const pt = getSvgCoords(e);
    const len = Math.round(Math.hypot(pt.x - potOrigin.x, pt.y - potOrigin.y));
    pullMetricRef.current = { endX: pt.x, endY: pt.y, length: len };
    setPullState({
      endX: pt.x,
      endY: pt.y,
      length: len,
      status: 'pulling',
      oscillation: 0,
      collected: false
    });
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const pt = getSvgCoords(e);
    const dist = Math.round(Math.hypot(pt.x - potOrigin.x, pt.y - potOrigin.y));
    pullMetricRef.current = { endX: pt.x, endY: pt.y, length: dist };

    if (dist > criticalLength) {
      draggingRef.current = false;
      triggerElasticSettle('snapped');
      return;
    }

    const osc = isReducedMotion ? 0 : Math.sin(dist * 0.18) * 5;
    setPullState({
      endX: pt.x,
      endY: pt.y,
      length: dist,
      status: 'pulling',
      oscillation: osc,
      collected: false
    });
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const finalLen = pullMetricRef.current.length;
    const nextStatus = finalLen >= minArtLength ? 'solidified' : 'idle';
    triggerElasticSettle(nextStatus);
  };

  const midX = (potOrigin.x + pullState.endX) / 2 + pullState.oscillation;
  const sagY = Math.min(48, pullState.length * 0.24);
  const midY = (potOrigin.y + pullState.endY) / 2 + sagY + Math.abs(pullState.oscillation) * 0.4;
  const silkWidth = Math.max(1.4, 7.5 - (pullState.length / criticalLength) * 5.8).toFixed(2);

  return (
    <section className="studio-game-block" aria-labelledby="game-pull-heading">
      <div className="section-header sub-plaque">
        <h2
          id="game-pull-heading"
          className="serif-title"
          style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <CraftIcon name="skewer" />
          实验三：拉丝金线 · 铜锅拔丝台
        </h2>
        <p className="section-subtitle">
          按住下方小铜锅锅沿向上方或两侧拖动，体验“离火三秒拉长丝”：拉得恰到好处即可盖印收录至纪念卡；用力过猛越过临界点金丝将会崩断回弹！
        </p>
      </div>

      <div className="studio-split-layout">
        <div
          className="canvas-stage-box"
          data-scroll-paging-ignore="true"
          style={{ touchAction: 'none', userSelect: 'none' }}
        >
          <span className="corner-ornament tl" />
          <span className="corner-ornament tr" />
          <span className="corner-ornament bl" />
          <span className="corner-ornament br" />

          <svg
            ref={svgRef}
            viewBox="0 0 360 220"
            style={{ width: '100%', maxWidth: '400px', height: '230px', cursor: 'grab' }}
            data-scroll-paging-ignore="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <linearGradient id="silkGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#BA7517" />
                <stop offset="50%" stopColor="#EF9F27" />
                <stop offset="100%" stopColor="#FAC775" />
              </linearGradient>
            </defs>

            <circle
              cx={potOrigin.x}
              cy={potOrigin.y}
              r={minArtLength}
              fill="none"
              stroke="rgba(186, 117, 23, 0.2)"
              strokeDasharray="4 4"
            />

            {(pullState.status === 'pulling' || pullState.status === 'solidified') &&
              pullState.length > 6 && (
                <g>
                  <path
                    d={`M${potOrigin.x},${potOrigin.y} Q${midX},${midY} ${pullState.endX},${pullState.endY}`}
                    fill="none"
                    stroke="url(#silkGoldGrad)"
                    strokeWidth={silkWidth}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${potOrigin.x - 1},${potOrigin.y - 1} Q${midX - 1},${midY - 1} ${pullState.endX - 1},${pullState.endY - 1}`}
                    fill="none"
                    stroke="#FFFDF8"
                    strokeWidth={Math.max(0.8, parseFloat(silkWidth) * 0.32)}
                    strokeOpacity="0.78"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={pullState.endX}
                    cy={pullState.endY}
                    r="5.5"
                    fill="#EF9F27"
                    stroke="#412402"
                    strokeWidth="1.8"
                  />
                </g>
              )}

            {pullState.status === 'snapped' && (
              <g>
                <path
                  d={`M${potOrigin.x},${potOrigin.y} Q${potOrigin.x - 24 + pullState.oscillation},${potOrigin.y - 26} ${potOrigin.x + 18},${potOrigin.y - 12}`}
                  fill="none"
                  stroke="#BA7517"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d={`M${pullState.endX},${pullState.endY} Q${pullState.endX + 16},${pullState.endY + 28} ${pullState.endX - 10},${pullState.endY + 38}`}
                  fill="none"
                  stroke="#EF9F27"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            )}

            <g transform={`translate(${potOrigin.x - 36}, ${potOrigin.y - 10})`}>
              <path
                d="M8,10 L64,10 C64,28 52,36 36,36 C20,36 8,28 8,10 Z"
                fill="#712B13"
                stroke="#412402"
                strokeWidth="2.2"
              />
              <ellipse cx="36" cy="10" rx="28" ry="6" fill="#EF9F27" stroke="#412402" strokeWidth="2" />
              <path d="M2,10 L8,10 M64,10 L70,10" stroke="#412402" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <div className="control-panel-box">
          <div className="temp-readout-row">
            <span>当前金丝长度与粗细</span>
            <span className="temp-big-number" style={{ fontSize: '1.85rem', color: 'var(--sugar-600)' }}>
              {pullState.length}px · {silkWidth}mm
            </span>
          </div>

          <div
            className={`temp-status-banner ${pullState.status === 'snapped' ? 'warn-caramel' : ''}`}
            role="status"
          >
            {pullState.status === 'idle' &&
              '请按住左侧铜锅中的琥珀糖面，向上拖动牵出糖丝（满 75px 即可凝丝成器，超过 225px 将崩断）。'}
            {pullState.status === 'pulling' &&
              `正在提腕拔丝（当前 ${pullState.length}px / 临界 225px），松手即可凝固定型！`}
            {pullState.status === 'solidified' &&
              '金丝凝结成功！弧度柔韧似龙须，可点击下方按钮盖印收录至纪念卡。'}
            {pullState.status === 'snapped' &&
              '用力过猛！糖丝超过 225px 临界张力已崩断回弹，请再次按住铜锅重拉。'}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {pullState.status === 'solidified' && (
              <button
                type="button"
                className="action-primary-btn"
                onClick={() => {
                  setPullState((prev) => ({ ...prev, collected: true }));
                  if (onCollectSilkPostcard) {
                    onCollectSilkPostcard({
                      ...pullState,
                      midX,
                      midY,
                      silkWidth,
                      potOrigin
                    });
                  }
                }}
              >
                盖印收录至纪念卡
              </button>
            )}
            {pullState.collected && <SealStamp text="丝" size={32} animate />}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 【B-6】一吹一融对照展（自包含 SVG <defs>，防止跨 SVG 引用失效）
 */
function BlowMeltContrastExhibit() {
  const horse = ZODIAC_DATA[6];

  return (
    <section className="studio-game-block" aria-labelledby="contrast-exhibit-heading">
      <div className="section-header sub-plaque">
        <h2
          id="contrast-exhibit-heading"
          className="serif-title"
          style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <CraftIcon name="skewer" />
          视觉装置：一吹一融 · 刹那与永恒对照展
        </h2>
        <p className="section-subtitle">
          同一尊【午马 · 天马踏燕】，左侧定格苇管初成的饱满晶莹，右侧凝视时光温热下的冰裂消融。
        </p>
      </div>

      <div className="contrast-exhibit-grid">
        {/* 左侧：刚吹好 */}
        <div className="contrast-pane">
          <span className="section-badge" style={{ background: 'var(--sugar-600)' }}>
            初成态 · 饱满挺括
          </span>
          <svg viewBox="0 0 100 112" style={{ width: '180px', height: '196px' }} aria-label="刚吹好的饱满午马糖人">
            <defs>
              <radialGradient id="exhibitSugarGloss" cx="35%" cy="28%" r="65%">
                <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.65" />
                <stop offset="48%" stopColor="#EF9F27" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#412402" stopOpacity="0.22" />
              </radialGradient>
            </defs>
            <line x1="50" y1="78" x2="50" y2="108" stroke="#BA7517" strokeWidth="3.8" strokeLinecap="round" />
            <g transform="translate(50, 82) scale(1.15, 1.15) translate(-50, -82)">
              <path
                d={horse.path}
                fill="#EF9F27"
                fillOpacity="0.86"
                stroke="#412402"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d={horse.path} fill="url(#exhibitSugarGloss)" />
              {horse.patches.map((p, i) => (
                <path key={i} d={p.d} fill={p.fill} fillOpacity={p.opacity} />
              ))}
              <path d={horse.featureStrokePath} fill="none" stroke="#412402" strokeWidth="2" strokeLinecap="round" />
              <path d={horse.cloudPath} fill="#FFFDF8" fillOpacity="0.5" />
              {horse.eyes.map((e, i) => (
                <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="#412402" />
              ))}
            </g>
          </svg>
          <strong className="serif-title">刚吹好 · 气满神足</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            糖膜盈亮、棱角分明，琥珀高光流转
          </span>
        </div>

        {/* 中间：竹签样式竖向时间轴 */}
        <div className="contrast-bamboo-axis" aria-hidden="true">
          <span className="axis-node top">吹成</span>
          <div className="axis-bamboo-rod">
            <div className="axis-center-badge">
              <span className="serif-title" style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                被记住
              </span>
              <SealStamp text="记" size={24} onceKey="b6-remember-seal" />
            </div>
          </div>
          <span className="axis-node bottom">消融</span>
        </div>

        {/* 右侧：将融尽（塌陷下垂 + B-1 冰裂纹 + 边缘挂糖珠） */}
        <div className="contrast-pane">
          <span className="section-badge" style={{ background: 'var(--caramel-warn)' }}>
            将融态 · 冰裂垂珠
          </span>
          <svg viewBox="0 0 100 112" style={{ width: '180px', height: '196px' }} aria-label="将融尽带有冰裂纹与糖珠的午马糖人">
            <line x1="50" y1="78" x2="50" y2="108" stroke="#BA7517" strokeWidth="3.8" strokeLinecap="round" />
            <ellipse cx="52" cy="84" rx="28" ry="5.5" fill="#BA7517" fillOpacity="0.45" />
            <g transform="translate(50, 84) rotate(7) scale(1.26, 0.72) translate(-50, -84)">
              <path
                d={horse.path}
                fill="#BA7517"
                fillOpacity="0.72"
                stroke="#412402"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path d={horse.path} fill="url(#iceCracklePat)" />
              <path d={horse.cloudPath} fill="#FFFDF8" fillOpacity="0.28" />
              {horse.eyes.map((e, i) => (
                <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="#412402" />
              ))}
            </g>
            <circle cx="29" cy="74" r="2.4" fill="#EF9F27" stroke="#412402" strokeWidth="1" />
            <circle cx="71" cy="72" r="2.8" fill="#EF9F27" stroke="#412402" strokeWidth="1" />
            <circle cx="63" cy="81" r="2.0" fill="#FAC775" stroke="#412402" strokeWidth="1" />
          </svg>
          <strong className="serif-title">将融尽 · 釉裂归饴</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            糖身微塌、浮现糖壳冰裂纹，边缘垂落糖珠
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * 【B-11】糖的遗憾博物馆
 */
function RegretMuseumSection() {
  const renderRegretSvg = (id) => {
    switch (id) {
      case 'burst-membrane':
        return (
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <path d="M18,28 L28,22 L24,36 Z M36,20 L48,26 L38,34 Z M26,40 L40,42 L32,50 Z" fill="#FAC775" stroke="#412402" strokeWidth="2" strokeLinejoin="round" />
            <line x1="32" y1="46" x2="32" y2="60" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'broken-silk':
        return (
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <path d="M12,48 Q22,26 28,34" fill="none" stroke="#EF9F27" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M52,16 Q42,36 36,28" fill="none" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="31" r="2.2" fill="#B91C1C" />
          </svg>
        );
      case 'bad-cut':
        return (
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <path d="M18,44 C18,28 46,28 46,44" fill="#FAC775" stroke="#412402" strokeWidth="2" />
            <path d="M24,30 L20,18 M32,28 L32,16 M40,30 L43,24" stroke="#412402" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="43" cy="24" r="2.5" fill="#B91C1C" />
          </svg>
        );
      case 'burnt-caramel':
      default:
        return (
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <ellipse cx="32" cy="44" rx="20" ry="8" fill="#712B13" stroke="#412402" strokeWidth="2" />
            <path d="M24,32 Q22,22 26,16 M38,30 Q40,20 36,14" fill="none" stroke="#412402" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          </svg>
        );
    }
  };

  return (
    <section aria-labelledby="regret-museum-heading" style={{ marginTop: '12px' }}>
      <header className="section-header">
        <span className="section-badge">
          <CraftIcon name="scissors" />
          非遗手艺人的坦诚 · 败亦是艺
        </span>
        <h2 id="regret-museum-heading" className="section-title">
          糖的遗憾博物馆
        </h2>
        <p className="section-subtitle">
          吹破、拉断、剪坏、熬焦——没有一位老手艺人天生百发百中，那些化回锅里的失败，同样是百年手艺的一部分。
        </p>
        <SealStamp text="悟" onceKey="regret-museum-seal" />
      </header>

      <div className="regret-museum-grid">
        {REGRET_MUSEUM_ITEMS.map((item) => (
          <article key={item.id} className="regret-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div className="regret-icon-box">{renderRegretSvg(item.id)}</div>
              <div>
                <h3 className="serif-title" style={{ fontSize: '1.15rem' }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.source}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {item.symptom}
            </p>
            <blockquote className="craft-proverb">{item.remedy}</blockquote>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Studio() {
  // 游戏 1：火候与糖温实验状态
  const [temperature, setTemperature] = useState(96);
  const tempCanvasRef = useRef(null);
  // 用 useMemo 稳定引用：仅 temperature 变化时重建。
  // ⚠️ 不能写成 getTempStageConfig(temperature) 直接求值——那会每次渲染返回新对象，
  //   导致下方 Canvas 动画 useEffect(..., [tempConfig]) 被反复重启（本轮已是第三次踩到）。
  const tempConfig = useMemo(() => getTempStageConfig(temperature), [temperature]);

  // 游戏 2：【B-4】十二生肖“一口气”吹糖人叙事状态
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIAC_DATA[6]);
  const [blowPercent, setBlowPercent] = useState(55);
  const [stamina, setStamina] = useState(100);
  const [blowOutcome, setBlowOutcome] = useState('partial'); // 'ready' | 'blowing' | 'success' | 'partial' | 'burst'
  const [sugarColor, setSugarColor] = useState(SUGAR_SWATCHES[1].hex);
  const [postcardUrl, setPostcardUrl] = useState('');
  const [showMobileModal, setShowMobileModal] = useState(false);

  // 使用 Ref 同步维护吹气进度与丹田气量，杜绝在 setState updater 内部调用副作用函数
  const isHoldingBlowRef = useRef(false);
  const blowRafIdRef = useRef(null);
  const lastBlowFrameTimeRef = useRef(0);
  const blowPercentRef = useRef(55);
  const staminaRef = useRef(100);

  const colorStyle = getSugarColorStyle(sugarColor);
  const blowPhysics = getBlowPhysics(blowPercent);

  // 【B-4】按住“一口气”帧率无关 rAF 推进（松手即停，空闲零 rAF！）
  const stopHoldingBlow = () => {
    if (!isHoldingBlowRef.current) return;
    isHoldingBlowRef.current = false;
    if (blowRafIdRef.current) {
      cancelAnimationFrame(blowRafIdRef.current);
      blowRafIdRef.current = null;
    }

    const currentBlow = blowPercentRef.current;
    if (currentBlow > 96) {
      setBlowOutcome('burst');
      blowPercentRef.current = 100;
      setBlowPercent(100);
    } else if (currentBlow >= 65) {
      setBlowOutcome('success');
    } else {
      const settled = Math.max(8, currentBlow - 4);
      blowPercentRef.current = settled;
      setBlowPercent(settled);
      setBlowOutcome('partial');
    }
  };

  const startHoldingBlow = () => {
    if (blowOutcome === 'burst' || isHoldingBlowRef.current) return;
    if (staminaRef.current <= 1) return;

    isHoldingBlowRef.current = true;
    setBlowOutcome('blowing');
    lastBlowFrameTimeRef.current = performance.now();

    const stepBlowFrame = (now) => {
      if (!isHoldingBlowRef.current) return;
      const dt = Math.min(64, Math.max(1, now - lastBlowFrameTimeRef.current));
      lastBlowFrameTimeRef.current = now;

      // 一口气上限约 3.5 秒 (3500ms 消耗 100% 气量)
      const nextStamina = Math.max(0, staminaRef.current - (dt / 3500) * 100);
      const nextBlow = blowPercentRef.current + (dt / 2900) * 100;

      staminaRef.current = nextStamina;
      setStamina(nextStamina);

      if (nextBlow > 96) {
        blowPercentRef.current = 100;
        setBlowPercent(100);
        isHoldingBlowRef.current = false;
        blowRafIdRef.current = null;
        setBlowOutcome('burst');
        return;
      }

      blowPercentRef.current = nextBlow;
      setBlowPercent(nextBlow);

      if (nextStamina <= 0.5) {
        stopHoldingBlow();
        return;
      }

      blowRafIdRef.current = requestAnimationFrame(stepBlowFrame);
    };

    blowRafIdRef.current = requestAnimationFrame(stepBlowFrame);
  };

  const handleResetSugarParison = () => {
    if (blowRafIdRef.current) {
      cancelAnimationFrame(blowRafIdRef.current);
      blowRafIdRef.current = null;
    }
    isHoldingBlowRef.current = false;
    blowPercentRef.current = 12;
    staminaRef.current = 100;
    setBlowPercent(12);
    setStamina(100);
    setBlowOutcome('ready');
  };

  useEffect(() => {
    return () => {
      if (blowRafIdRef.current) cancelAnimationFrame(blowRafIdRef.current);
    };
  }, []);

  // 【自检修复】游戏 1：火候与糖温 Canvas 仅在温度变化后运行 36 帧（约 600ms）微态过渡即停止，严守“禁止常驻 rAF 循环 / 空闲零循环”！
  useEffect(() => {
    const canvas = tempCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId = null;
    let frameCount = 0;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maxFrames = isReducedMotion ? 1 : 36;

    const renderSugarBlob = () => {
      frameCount += 1;
      const tick = frameCount * 0.12;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.fillStyle = 'rgba(65, 36, 2, 0.08)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 72, 86, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = tempConfig.color;
      ctx.strokeStyle = '#412402';
      ctx.lineWidth = 2.5;

      const settleDamp = frameCount >= maxFrames ? 0 : 1 - frameCount / maxFrames;

      if (tempConfig.stage === 1) {
        const jitterX = Math.sin(tick * 6) * 2.2 * settleDamp;
        const jitterY = Math.cos(tick * 8) * 1.6 * settleDamp;
        ctx.beginPath();
        ctx.arc(cx + jitterX, cy + jitterY, 58, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 253, 248, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx + jitterX - 16, cy + jitterY - 16, 26, Math.PI * 1.1, Math.PI * 1.55);
        ctx.stroke();
      } else if (tempConfig.stage === 2) {
        const stretch = 10 + Math.sin(tick * 2) * 6 * settleDamp;
        const rx = 76 + stretch;
        const ry = 46 - stretch * 0.25;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#FAC775';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - rx + 8, cy);
        ctx.quadraticCurveTo(cx, cy - ry - 26, cx + rx - 8, cy);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 253, 248, 0.55)';
        ctx.beginPath();
        ctx.ellipse(cx - 22, cy - 14, 24, 9, -0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (tempConfig.stage === 3) {
        const wobble = Math.sin(tick * 3) * 4 * settleDamp;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 12, 82 + wobble, 42 - wobble * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const bubbleOffsets = [
          { dx: -28, r: 9, rise: 10 },
          { dx: 2, r: 12, rise: 18 },
          { dx: 30, r: 8, rise: 6 }
        ];
        bubbleOffsets.forEach((b) => {
          const bx = cx + b.dx;
          const by = cy - 26 - b.rise - settleDamp * 6;
          ctx.fillStyle = '#EF9F27';
          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFDF8';
          ctx.beginPath();
          ctx.arc(bx - b.r * 0.3, by - b.r * 0.3, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 34, 96, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(250, 199, 117, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 48, cy + 30);
        ctx.quadraticCurveTo(cx, cy + 42, cx + 48, cy + 30);
        ctx.stroke();

        for (let i = 0; i < 2; i++) {
          const smokeY = cy - 14 - i * 18 - settleDamp * 8;
          ctx.strokeStyle = 'rgba(113, 43, 19, 0.35)';
          ctx.beginPath();
          ctx.arc(cx - 15 + i * 30, smokeY, 10, 0, Math.PI);
          ctx.stroke();
        }
      }

      ctx.restore();

      if (frameCount < maxFrames) {
        animFrameId = requestAnimationFrame(renderSugarBlob);
      } else {
        animFrameId = null;
      }
    };

    renderSugarBlob();
    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [temperature, tempConfig]);

  // 离线 Canvas 绘制宣纸纪念卡（支持十二生肖与 B-3 拔丝金线艺术真实图形双模式）
  const handleGeneratePostcard = (silkCustomData = null) => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 720;
    offCanvas.height = 960;
    const ctx = offCanvas.getContext('2d');

    ctx.fillStyle = '#F7F1E1';
    ctx.fillRect(0, 0, 720, 960);

    // B-1 冰裂纹底纹装饰
    ctx.strokeStyle = 'rgba(186, 117, 23, 0.14)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 64; i++) {
      const rx = (i * 83) % 720;
      const ry = (i * 113) % 960;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 22, ry + 14);
      ctx.lineTo(rx + 12, ry + 34);
      ctx.stroke();
    }

    ctx.strokeStyle = '#BA7517';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 648, 888);
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, 628, 868);

    ctx.fillStyle = '#412402';
    ctx.font = 'bold 34px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillText('一勺糖稀 · 非遗百年', 360, 112);

    const cardSubtitle = silkCustomData
      ? `传统拔丝金线艺术纪念卡 · 【金丝长 ${silkCustomData.length}px】`
      : `传统吹糖人数字工坊纪念卡 · 【${selectedZodiac.title}】`;
    ctx.fillStyle = '#7A5832';
    ctx.font = '20px "Noto Sans SC", sans-serif';
    ctx.fillText(cardSubtitle, 360, 152);

    ctx.save();
    ctx.beginPath();
    ctx.arc(360, 420, 195, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFDF8';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.42)';
    ctx.stroke();
    ctx.clip();

    if (silkCustomData) {
      // 【自检修复】当从 B-3 拔丝台点击“盖印收录”时，在月洞窗内真实绘制出铜锅与所拉出的金丝曲线！
      ctx.save();
      ctx.translate(180, 290);
      ctx.scale(1.0, 1.0);

      // 绘制拉出的二次贝塞尔金丝
      ctx.strokeStyle = '#EF9F27';
      ctx.lineWidth = Math.max(3, parseFloat(silkCustomData.silkWidth || 4) * 1.8);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(silkCustomData.potOrigin.x, silkCustomData.potOrigin.y);
      ctx.quadraticCurveTo(
        silkCustomData.midX,
        silkCustomData.midY,
        silkCustomData.endX,
        silkCustomData.endY
      );
      ctx.stroke();

      // 金丝高光
      ctx.strokeStyle = '#FFFDF8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 牵引竹签圆头
      ctx.fillStyle = '#BA7517';
      ctx.beginPath();
      ctx.arc(silkCustomData.endX, silkCustomData.endY, 8, 0, Math.PI * 2);
      ctx.fill();

      // 底部铜锅
      ctx.fillStyle = '#712B13';
      ctx.strokeStyle = '#412402';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(silkCustomData.potOrigin.x, silkCustomData.potOrigin.y + 12, 34, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      const baseScale = 2.6;
      const anchorX = 360;
      const anchorY = 505;

      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.scale(baseScale, baseScale);
      ctx.translate(-50, -82);
      ctx.strokeStyle = '#BA7517';
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(50, 78);
      ctx.lineTo(50, 114);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.scale(
        baseScale * parseFloat(blowPhysics.scaleX),
        baseScale * parseFloat(blowPhysics.scaleY)
      );
      ctx.translate(-50, -82);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const bodyPath2D = new Path2D(selectedZodiac.path);

      ctx.save();
      ctx.globalAlpha = parseFloat(blowPhysics.svgOpacity);
      ctx.fillStyle = sugarColor;
      ctx.fill(bodyPath2D);
      ctx.restore();

      ctx.strokeStyle = colorStyle.strokeColor;
      ctx.lineWidth = parseFloat(blowPhysics.wallStroke);
      ctx.stroke(bodyPath2D);

      if (selectedZodiac.patches) {
        selectedZodiac.patches.forEach((p) => {
          ctx.save();
          ctx.fillStyle = p.fill;
          ctx.globalAlpha = p.opacity;
          ctx.fill(new Path2D(p.d));
          ctx.restore();
        });
      }

      if (selectedZodiac.featureStrokePath) {
        ctx.save();
        ctx.strokeStyle = colorStyle.strokeColor;
        ctx.lineWidth = 2.1;
        ctx.stroke(new Path2D(selectedZodiac.featureStrokePath));
        ctx.restore();
      }

      if (selectedZodiac.cloudPath) {
        ctx.save();
        ctx.fillStyle = '#FFFDF8';
        ctx.globalAlpha = 0.45;
        ctx.fill(new Path2D(selectedZodiac.cloudPath));
        ctx.restore();
      }

      selectedZodiac.eyes.forEach((eye) => {
        ctx.fillStyle = '#412402';
        ctx.beginPath();
        ctx.arc(eye.cx, eye.cy, eye.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
    ctx.restore();

    ctx.fillStyle = '#412402';
    ctx.font = 'bold 30px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      silkCustomData
        ? `拔丝金线 · 离火三秒化龙须`
        : `${selectedZodiac.name} · ${selectedZodiac.blessing}`,
      360,
      690
    );

    ctx.fillStyle = '#7A5832';
    ctx.font = '20px "Noto Sans SC", sans-serif';
    ctx.fillText(
      silkCustomData
        ? `金丝长度：${silkCustomData.length}px（丝径 ${silkCustomData.silkWidth}mm · 凝丝成器）`
        : `一口气吹塑：${Math.round(blowPercent)}%（横向鼓腹 ${blowPhysics.scaleX}× / 丹田余气 ${Math.round(stamina)}%）`,
      360,
      735
    );

    const now = new Date();
    const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 制`;
    ctx.fillStyle = '#412402';
    ctx.font = '20px "Noto Serif SC", serif';
    ctx.textAlign = 'left';
    ctx.fillText(`岁次丙午 · ${dateStr}`, 84, 855);

    ctx.save();
    ctx.translate(556, 796);
    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(0, 0, 76, 76);
    ctx.strokeStyle = '#FFFDF8';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 66, 66);
    ctx.fillStyle = '#FFFDF8';
    ctx.font = 'bold 22px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillText('非遗', 38, 34);
    ctx.fillText('糖艺', 38, 62);
    ctx.restore();

    const dataUrl = offCanvas.toDataURL('image/png');
    setPostcardUrl(dataUrl);
    setShowMobileModal(true);
  };

  return (
    <main className="page-container">
      <header className="section-header">
        <span className="section-badge">
          <CraftIcon name="pot" />
          中国非遗 · 互动工坊
        </span>
        <h1 className="section-title" tabIndex="-1">
          掌中熬糖、一口气吹塑与拔丝实验室
        </h1>
        <p className="section-subtitle">
          亲手体验“铜锅看火候”、“一口气苇管吹生肖”与“拉丝金线”三道非遗绝活，并观赏一吹一融对照展与糖的遗憾博物馆。
        </p>
        <SealStamp text="坊" onceKey="header-seal-studio" />
      </header>

      {/* ==================== 游戏 1：火候与糖温小实验 ==================== */}
      <section className="studio-game-block" aria-labelledby="game1-heading">
        <div className="section-header sub-plaque">
          <h2
            id="game1-heading"
            className="serif-title"
            style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <CraftIcon name="ladle" />
            实验一：火候与糖温四态实验
          </h2>
          <p className="section-subtitle">
            民间谚语云：“熬糖差一秒，吹塑全白费”。拖动下方温度滑块（40°C ~ 160°C），观察麦芽糖稀的物理形态变化。
          </p>
        </div>

        <div className="studio-split-layout">
          <div className="canvas-stage-box">
            <span className="corner-ornament tl" />
            <span className="corner-ornament tr" />
            <span className="corner-ornament bl" />
            <span className="corner-ornament br" />
            <canvas
              ref={tempCanvasRef}
              width={420}
              height={280}
              className="sugar-temp-canvas"
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              {tempConfig.tag}
            </span>
          </div>

          <div className="control-panel-box">
            <div className="temp-readout-row">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CraftIcon name="pot" />
                当前灶膛糖温
              </span>
              <span className="temp-big-number" style={{ color: tempConfig.color }}>
                {temperature}°C
              </span>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label htmlFor="temp-slider">调节熬糖火候 (40°C ~ 160°C)</label>
                <span style={{ color: 'var(--cinnabar-red)' }}>黄金区：75°C ~ 115°C</span>
              </div>
              <input
                id="temp-slider"
                type="range"
                min="40"
                max="160"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="sugar-range-input"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span>40°C 凝硬</span>
                <span>75°C 软化</span>
                <span>115°C 适塑</span>
                <span>140°C 焦苦</span>
              </div>
            </div>

            <div
              className={`temp-status-banner ${tempConfig.isWarn ? 'warn-caramel' : ''}`}
              role="status"
            >
              {tempConfig.tip}
            </div>
          </div>
        </div>
      </section>

      <PatternDivider variant="cloud" />

      {/* ==================== 游戏 2：【B-4】十二生肖“一口气”吹糖人叙事 ==================== */}
      <section className="studio-game-block" aria-labelledby="game2-heading">
        <div className="section-header sub-plaque">
          <h2
            id="game2-heading"
            className="serif-title"
            style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <CraftIcon name="reed" />
            实验二：十二生肖“一口气”吹糖人叙事
          </h2>
          <p className="section-subtitle">
            按住「一口气吹糖」按钮送气入腹：气到黄金区（65%~95%）松手即可盖印成器；半途松手保留未完成态；吹过头（&gt;96%）糖膜将会崩裂！
          </p>
        </div>

        <div className="studio-split-layout">
          <div className="canvas-stage-box" style={{ minHeight: '360px' }}>
            <span className="corner-ornament tl" />
            <span className="corner-ornament tr" />
            <span className="corner-ornament bl" />
            <span className="corner-ornament br" />

            <svg
              viewBox="0 0 100 116"
              style={{ width: '248px', height: '276px', overflow: 'visible' }}
              aria-label={`当前吹制生肖：${selectedZodiac.name}`}
            >
              <defs>
                <radialGradient id="sugarGloss" cx="35%" cy="28%" r="65%">
                  <stop
                    offset="0%"
                    stopColor="#FFFDF8"
                    stopOpacity={colorStyle.glossTopOpacity}
                  />
                  <stop offset="48%" stopColor={sugarColor} stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#412402" stopOpacity="0.22" />
                </radialGradient>

                <radialGradient id="airCavityGlow" cx="48%" cy="54%" r="50%">
                  <stop
                    offset="0%"
                    stopColor="#FFFDF8"
                    stopOpacity={blowPhysics.cavityOpacity}
                  />
                  <stop
                    offset="60%"
                    stopColor="#FAC775"
                    stopOpacity={(parseFloat(blowPhysics.cavityOpacity) * 0.45).toFixed(2)}
                  />
                  <stop offset="100%" stopColor={sugarColor} stopOpacity="0" />
                </radialGradient>

                <clipPath id="zodiacCavityClip">
                  <path d={selectedZodiac.path} />
                </clipPath>
              </defs>

              <g className="reed-blowpipe-group">
                <line
                  x1="50"
                  y1="78"
                  x2="50"
                  y2="113"
                  stroke="#BA7517"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <line
                  x1="49"
                  y1="79"
                  x2="49"
                  y2="112"
                  stroke="#FAC775"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeOpacity="0.75"
                />
                {blowOutcome === 'blowing' && (
                  <line
                    x1="50"
                    y1="111"
                    x2="50"
                    y2="81"
                    stroke="#FFFDF8"
                    strokeWidth="1.8"
                    strokeDasharray="2.5 4.5"
                    strokeLinecap="round"
                    className="airflow-stream-line"
                  />
                )}
              </g>

              {blowOutcome === 'burst' ? (
                <g>
                  <path
                    d="M22,38 L36,28 L32,48 Z"
                    fill={sugarColor}
                    stroke="#412402"
                    strokeWidth="2"
                  />
                  <path
                    d="M66,30 L78,42 L62,48 Z"
                    fill={sugarColor}
                    stroke="#412402"
                    strokeWidth="2"
                  />
                  <path
                    d="M28,64 L42,58 L36,74 Z"
                    fill={sugarColor}
                    stroke="#412402"
                    strokeWidth="2"
                  />
                  <path
                    d="M60,62 L74,68 L64,76 Z"
                    fill={sugarColor}
                    stroke="#412402"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="50"
                    cy="81"
                    rx="18"
                    ry="6"
                    fill={sugarColor}
                    stroke="#412402"
                    strokeWidth="2"
                  />
                </g>
              ) : (
                <g
                  transform={`translate(50, 82) scale(${blowPhysics.scaleX}, ${blowPhysics.scaleY}) translate(-50, -82)`}
                >
                  {colorStyle.showInnerRim && (
                    <path
                      d={selectedZodiac.path}
                      fill="none"
                      stroke="#FFFDF8"
                      strokeWidth={parseFloat(blowPhysics.wallStroke) + 1.3}
                      strokeOpacity="0.72"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}

                  <path
                    d={selectedZodiac.path}
                    fill={sugarColor}
                    fillOpacity={blowPhysics.svgOpacity}
                    stroke={colorStyle.strokeColor}
                    strokeWidth={blowPhysics.wallStroke}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  <ellipse
                    cx="49"
                    cy="55"
                    rx={blowPhysics.cavityRx}
                    ry={blowPhysics.cavityRy}
                    fill="url(#airCavityGlow)"
                    clipPath="url(#zodiacCavityClip)"
                    pointerEvents="none"
                  />

                  <path
                    d={selectedZodiac.path}
                    fill="url(#sugarGloss)"
                    pointerEvents="none"
                  />

                  <ellipse
                    cx="50"
                    cy="82.5"
                    rx="4.8"
                    ry="2"
                    fill={sugarColor}
                    stroke={colorStyle.strokeColor}
                    strokeWidth="2"
                  />

                  {selectedZodiac.patches &&
                    selectedZodiac.patches.map((patch, idx) => (
                      <path
                        key={`patch-${idx}`}
                        d={patch.d}
                        fill={patch.fill}
                        fillOpacity={patch.opacity}
                        pointerEvents="none"
                      />
                    ))}

                  {selectedZodiac.featureFillPath && (
                    <path
                      d={selectedZodiac.featureFillPath}
                      fill={colorStyle.strokeColor}
                      fillOpacity="0.85"
                    />
                  )}
                  {selectedZodiac.featureStrokePath && (
                    <path
                      d={selectedZodiac.featureStrokePath}
                      fill="none"
                      stroke={colorStyle.strokeColor}
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  <path
                    d={selectedZodiac.cloudPath}
                    fill="#FFFDF8"
                    fillOpacity="0.45"
                    pointerEvents="none"
                  />

                  {selectedZodiac.eyes.map((eye, idx) => (
                    <circle
                      key={`eye-${idx}`}
                      cx={eye.cx}
                      cy={eye.cy}
                      r={eye.r}
                      fill="#412402"
                    />
                  ))}

                  {selectedZodiac.dots &&
                    selectedZodiac.dots.map((dot, idx) => (
                      <circle
                        key={`dot-${idx}`}
                        cx={dot.cx}
                        cy={dot.cy}
                        r={dot.r}
                        fill={dot.fill || '#412402'}
                      />
                    ))}
                </g>
              )}
            </svg>

            {blowOutcome === 'burst' && (
              <div
                style={{
                  background: 'var(--surface-paper)',
                  border: '1.5px solid var(--cinnabar-red)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  marginTop: '6px',
                  color: 'var(--cinnabar-red)',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700
                }}
                role="alert"
              >
                糖膜破了，重来！
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <strong className="serif-title" style={{ fontSize: '1.15rem' }}>
                {selectedZodiac.name} · {selectedZodiac.title}
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--cinnabar-red)', fontWeight: 600, marginTop: '2px' }}>
                {blowPhysics.stageLabel}
              </p>
            </div>
          </div>

          <div className="control-panel-box">
            <div>
              <div className="slider-label-row" style={{ marginBottom: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CraftIcon name="scissors" />
                  1. 选择十二生肖模具（4×3 网格）
                </span>
                <span style={{ color: 'var(--cinnabar-red)' }}>当前：{selectedZodiac.name}</span>
              </div>
              <div className="zodiac-grid">
                {ZODIAC_DATA.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`zodiac-btn ${selectedZodiac.id === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedZodiac(item);
                      if (blowOutcome === 'burst') handleResetSugarParison();
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CraftIcon name="reed" />
                  2. 丹田气量计（余气 {Math.round(stamina)}% · 糖泡 {Math.round(blowPercent)}%）
                </span>
                <span style={{ color: blowPercent >= 65 && blowPercent <= 96 ? 'var(--cinnabar-red)' : 'var(--text-muted)' }}>
                  黄金成型区：65% ~ 95%
                </span>
              </div>

              <div className="dantian-meter-track" aria-label="丹田气量计">
                <div
                  className="dantian-meter-fill"
                  style={{ width: `${stamina.toFixed(1)}%` }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="action-primary-btn"
                  style={{ flex: 1, userSelect: 'none', touchAction: 'none' }}
                  onPointerDown={startHoldingBlow}
                  onPointerUp={stopHoldingBlow}
                  onPointerLeave={stopHoldingBlow}
                  onPointerCancel={stopHoldingBlow}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                      e.preventDefault();
                      startHoldingBlow();
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      stopHoldingBlow();
                    }
                  }}
                >
                  {blowOutcome === 'blowing' ? '正在送气…（松手定型）' : '按住吹一口气（松手定型）'}
                </button>
                <button
                  type="button"
                  className="zodiac-btn"
                  onClick={handleResetSugarParison}
                >
                  重揉糖胎 / 换气
                </button>
              </div>

              <input
                id="blow-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(blowPercent)}
                aria-label="吹气饱满度微调滑块"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  blowPercentRef.current = val;
                  setBlowPercent(val);
                  if (val > 96) setBlowOutcome('burst');
                  else if (val >= 65) setBlowOutcome('success');
                  else setBlowOutcome('partial');
                }}
                className="sugar-range-input"
              />
            </div>

            <div>
              <div className="slider-label-row" style={{ marginBottom: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CraftIcon name="skewer" />
                  3. 调制糖稀色泽
                </span>
              </div>
              <div className="swatch-row">
                {SUGAR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    className={`swatch-btn ${sugarColor === swatch.hex ? 'active' : ''}`}
                    onClick={() => setSugarColor(swatch.hex)}
                  >
                    <span
                      className="swatch-dot"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.label.split('（')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                className="action-primary-btn"
                disabled={blowOutcome === 'burst'}
                style={{ opacity: blowOutcome === 'burst' ? 0.5 : 1 }}
                onClick={() => handleGeneratePostcard(null)}
              >
                {blowOutcome === 'success'
                  ? '黄金品相 · 盖朱砂印生成纪念卡'
                  : '保存当前糖人生成纪念卡'}
              </button>

              {blowOutcome === 'success' && <SealStamp text="成" size={30} animate />}

              {postcardUrl && (
                <a
                  href={postcardUrl}
                  download={`非遗吹糖人纪念卡_${selectedZodiac.name}.png`}
                  className="action-primary-btn"
                  style={{
                    background: '#412402',
                    textDecoration: 'none'
                  }}
                >
                  下载纪念卡至电脑 (PNG)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <PatternDivider variant="fret" />

      {/* ==================== 【B-3】拉丝金线（铜锅拔丝台） ==================== */}
      <SugarPullingStage onCollectSilkPostcard={(silkData) => handleGeneratePostcard(silkData)} />

      <PatternDivider variant="cloud" />

      {/* ==================== 【B-6】一吹一融对照展 ==================== */}
      <BlowMeltContrastExhibit />

      <PatternDivider variant="fret" />

      {/* ==================== 【B-11】糖的遗憾博物馆 ==================== */}
      <RegretMuseumSection />

      {/* ==================== 纪念卡预览弹窗（含 B-5 落印洇墨动效） ==================== */}
      {showMobileModal && postcardUrl && (
        <div
          className="postcard-modal-backdrop"
          onClick={() => setShowMobileModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="非遗糖人纪念卡预览与盖章打卡"
        >
          <div
            className="postcard-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-save-tip">
              手机端长按下方宣纸卡即可保存相册 · 电脑端可一键下载
            </div>
            <div className="postcard-preview-wrapper">
              <img
                src={postcardUrl}
                alt="非遗糖人纪念卡"
                className="postcard-preview-img"
              />
              <div style={{ position: 'absolute', right: '26px', bottom: '42px' }}>
                <SealStamp text="非遗" size={50} animate />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a
                href={postcardUrl}
                download={`非遗吹糖人纪念卡_${selectedZodiac.name}.png`}
                className="action-primary-btn"
                style={{ flex: 1, fontSize: '0.9rem' }}
              >
                直接下载图片
              </a>
              <button
                type="button"
                className="zodiac-btn"
                style={{ flex: 1 }}
                onClick={() => setShowMobileModal(false)}
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}