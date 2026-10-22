/**
 * 文件：src/data/sugarCouplets.js
 * 作用：【B-7, B-8, B-10, B-11】非遗糖艺签文、时辰糖集、岁时八节令、糖的来路时间轴、遗憾博物馆数据池
 * 硬约束：严守内容诚实性——凡涉及批次、年代、地方习俗或口诀，均给出可考来源，或标注「」；无法证实的细节不作断言，也绝不编造。
 */

/**
 * 【B-10】今日糖签签文池（统一标注“团队原创”或“据传统行话整理”）
 */
export const DAILY_SUGAR_LOTS = [
  {
    id: 'lot-1',
    verse: '“火候看糖泡，吹气凭丹田；指尖三分力，瑞兽活眼前。”',
    note: '今日宜：沉心静气 · 把握火候',
    source: '据传统吹糖人行话整理'
  },
  {
    id: 'lot-2',
    verse: '“手腕悬空走龙蛇，铜勺倾处琥珀凝；一笔不断千钧力，方寸石板见丹青。”',
    note: '今日宜：一气呵成 · 落笔无悔',
    source: '据川派糖画技艺特征编写'
  },
  {
    id: 'lot-3',
    verse: '“离火三秒拉长丝，迎风一抖化金须；莫道糖人易消融，甜透人间几度秋。”',
    note: '今日宜：柔中带刚 · 顺势而为',
    source: '团队原创（致敬民间糖艺手艺人）'
  },
  {
    id: 'lot-4',
    verse: '“吹糖人儿嘞——小耗子偷油、孙猴儿翻跟头，铜锣一响胡同深……”',
    note: '今日宜：常怀童心 · 拾取微光',
    source: '据老北京胡同叫卖记忆整理'
  },
  {
    id: 'lot-5',
    verse: '“糖膜破了莫心焦，趁热揉团化糖瓜；手艺原从败里炼，回锅慢熬又一春。”',
    note: '今日宜：坦然试错 · 败中求进',
    source: '团队原创（糖的遗憾博物馆题签）'
  }
];

/**
 * 获取今日糖签：利用 localStorage 记录当天日期 (YYYY-MM-DD) 与抽取索引，同一天多次访问不重复抽，跨天自动重置；
 * 若浏览器禁用 localStorage（如隐私模式或严格沙箱），静默降级为随机抽取。
 */
export function getTodaySugarLot() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = 'sugar_heritage_daily_lot_v1';

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.date === todayKey &&
        typeof parsed.index === 'number' &&
        DAILY_SUGAR_LOTS[parsed.index]
      ) {
        return DAILY_SUGAR_LOTS[parsed.index];
      }
    }
    const randomIndex = Math.floor(Math.random() * DAILY_SUGAR_LOTS.length);
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ date: todayKey, index: randomIndex })
    );
    return DAILY_SUGAR_LOTS[randomIndex];
  } catch (_err) {
    const fallbackIndex = Math.floor(Math.random() * DAILY_SUGAR_LOTS.length);
    return DAILY_SUGAR_LOTS[fallbackIndex];
  }
}

/**
 * 【B-10】时辰糖集：按访问时间返回早市/午后/夜集问候与现有琥珀/米白叠层透明度参数（绝不引入新色相、不做暗色模式）
 */
export function getShichenMarketMood(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return {
      id: 'morning',
      badge: '早市 · 晨光初熬',
      greeting: '晨起支锅，麦芽初融，宣纸与糖稀正清亮',
      overlayBg: 'rgba(255, 253, 248, 0.06)',
      glowOpacity: 0.38
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      id: 'afternoon',
      badge: '午集 · 暖阳走勺',
      greeting: '日暖胡同，铜勺倾金，正是提气吹塑好时辰',
      overlayBg: 'rgba(250, 199, 117, 0.06)',
      glowOpacity: 0.52
    };
  }
  return {
    id: 'evening',
    badge: '夜集 · 灯下凝珀',
    greeting: '暮色收摊，余温尚存，一盏琥珀甜入旧梦',
    overlayBg: 'rgba(186, 117, 23, 0.06)',
    glowOpacity: 0.44
  };
}

/**
 * 【B-7】岁时节令糖艺（8 个节令）
 * 内容硬约束：只写有出处支撑的部分，并注明「民间习俗地域差异较大」；查不到出处的细节不复述、不臆测。
 */
export const SOLAR_TERM_SUGAR_LIST = [
  {
    id: 'spring-festival',
    term: '春节 · 正月初一',
    theme: '年糖与生肖吹糖人',
    icon: 'pot',
    proverb: '“正月庙会锣鼓喧，竹签挑起生肖甜。”',
    citation: '各地庙会常见习俗'
  },
  {
    id: 'lantern-festival',
    term: '元宵 · 正月十五',
    theme: '灯会走兽糖画',
    icon: 'ladle',
    proverb: '“花灯影里转糖轮，转出金龙兆丰年。”',
    citation: '民间灯会游艺，见于多地民俗记载'
  },
  {
    id: 'dragon-head',
    term: '二月二 · 龙抬头',
    theme: '龙须糖与金龙糖画',
    icon: 'skewer',
    proverb: '“二月春风拉万丝，银丝裹蜜化龙须。”',
    citation: '北方及部分地区节令食俗'
  },
  {
    id: 'qingming',
    term: '清明 · 寒食节',
    theme: '寒食饧糖（麦芽糖稀）',
    icon: 'pot',
    proverb: '“冷食佳节佐大麦，熬得清饧润春喉。”',
    citation: '古籍多载寒食食饧（麦芽糖），与近代糖画的渊源见诸民俗研究'
  },
  {
    id: 'dragon-boat',
    term: '端午 · 五月初五',
    theme: '五瑞辟邪糖人',
    icon: 'reed',
    proverb: '“苇管吹出虎与蟾，孩童执签保平安。”',
    citation: '民间岁时题材，地域差异较大'
  },
  {
    id: 'qixi',
    term: '七夕 · 七月初七',
    theme: '巧果与摩睺罗糖偶',
    icon: 'scissors',
    proverb: '“铜剪轻挑喜鹊桥，糖塑巧人乞巧忙。”',
    citation: '宋代《东京梦华录》载七夕“笑头儿/糖果”等，可视为糖塑的前身'
  },
  {
    id: 'mid-autumn',
    term: '中秋 · 八月十五',
    theme: '玉兔捣药糖画',
    icon: 'ladle',
    proverb: '“石板浇出团圆月，长耳玉兔伴桂香。”',
    citation: '中秋玉兔题材常见于市井糖画'
  },
  {
    id: 'layue',
    term: '腊月廿三 · 小年',
    theme: '祭灶糖瓜（关东糖）',
    icon: 'pot',
    proverb: '“二十三，糖瓜粘，灶君老爷要上天。”（据北方民谚整理）',
    citation: '见载于多地民俗志，各地祭灶糖形制不一'
  }
];

/**
 * 【B-8】糖的来路（卷轴式时间轴 5 节点）
 * 内容硬约束：每条必须给出处，或标注「」；禁止编造确切年代与事件。
 */
export const SUGAR_HISTORY_TIMELINE = [
  {
    id: 'tang-song',
    era: '唐宋时期',
    title: '甘蔗制糖与市井饧偶初兴',
    icon: 'pot',
    fact: '麦芽糖（饧）与甘蔗制糖技艺发展，宋代都市节令已出现以糖塑形的市井食品。',
    citation: '据孟元老《东京梦华录》等宋代笔记整理'
  },
  {
    id: 'ming-qing',
    era: '明清时期',
    title: '铜勺糖画与苇管吹糖人成型',
    icon: 'ladle',
    fact: '巴蜀地区“倒糖饼儿（糖画）”与北方“吹糖人”走街串巷规制渐趋成熟。',
    citation: '流传源起多据地方口述史，有明代宫廷说、祭祀起源说等'
  },
  {
    id: 'republic',
    era: '民国至二十世纪',
    title: '胡同庙会与挑担走巷盛景',
    icon: 'reed',
    fact: '手艺人挑木炭小炉、竹模与大理石转盘走入市井胡同，成为几代人的童年记忆。',
    citation: '据近代民俗口述记忆整理'
  },
  {
    id: 'ich-era',
    era: '当代保护',
    title: '列入各级非物质文化遗产代表性项目名录',
    icon: 'scissors',
    fact: '北京吹糖人、成都糖画、高唐糖画、天门糖塑等先后入选国家级或省市级非遗名录。',
    citation: '据中国非物质文化遗产网公开名录'
  },
  {
    id: 'digital-now',
    era: '数字今朝 · 本作品',
    title: '一勺糖稀 · 代码里的非遗新生',
    icon: 'skewer',
    fact: '以零外网依赖的纯前端 SVG / Canvas 交互，将熬糖、画糖、拔丝与吹塑留存于数字长卷。',
    citation: '全国大学生数字媒体科技作品及创意竞赛参赛作品（团队原创手写实现）'
  }
];

/**
 * 【B-11】糖的遗憾博物馆（糖艺的四种“失败”与手艺人补救智慧）
 */
export const REGRET_MUSEUM_ITEMS = [
  {
    id: 'burst-membrane',
    title: '遗憾一 · 吹破（糖膜裂）',
    symptom: '丹田送气过猛或局部糖胎过薄，糖泡“啪”地裂开数瓣，瑞兽瞬间塌落。',
    remedy: '“糖膜破了莫叹气，趁热拢回苇管头，揉作实心小糖瓜，一样甜进孩童口。”',
    source: '据民间吹糖人手艺经验编写'
  },
  {
    id: 'broken-silk',
    title: '遗憾二 · 拉断（丝垂落）',
    symptom: '拔丝时糖温已降或提腕过急，金丝半途崩断回弹，无法牵出连贯龙须。',
    remedy: '“金丝断处莫强牵，顺势盘作如意圈；断丝亦有凌云态，巧手点缀作云烟。”',
    source: '团队原创（糖艺拔丝补救口诀）'
  },
  {
    id: 'bad-cut',
    title: '遗憾三 · 剪坏（爪趾残）',
    symptom: '铜剪未蘸温水或下剪犹疑，粘连糖皮导致龙爪少趾、鸡冠缺角。',
    remedy: '“剪坏五爪改祥云，铜剪轻挑化瑞麟；世间本无十全器，拙中见巧是真人。”',
    source: '据传统糖塑捏剪技艺编写'
  },
  {
    id: 'burnt-caramel',
    title: '遗憾四 · 熬焦（锅底焦痕）',
    symptom: '灶火太旺越过 140°C 临界点，麦芽糖焦化发苦、色呈深褐，难以吹拉。',
    remedy: '“火过一分糖带苦，倾入清水洗铜锅；老手艺人千百遍，先尝焦苦后知甜。”',
    source: '据熬糖火候经验整理'
  }
];