/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarInfo, DecisionEvidence, ParameterRow, ReviewItem, SkuRecommend } from '../types';

// ================== STAGE 1 (MVP) DATA ==================
// Candidates:
// Car A: 问界 M7 Pro 五座后驱版 (24.98万起)
// Car B: 理想 L8 Pro 增程版 (32.18万起)
// Car C: 腾势 N8 旗舰六座版 (31.98万起)
export const STAGE_1_CARS: CarInfo[] = [
  {
    id: 'm7',
    brand: '问界',
    name: '问界 M7 Pro 五座后驱版',
    badge: '问界 M7',
    guidePrice: '24.98万起',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400',
    tagline: '搭载华为ADS基础智驾，高性价比纯电级舒适体验',
    keepStatus: 'keep',
    decisionRole: '智驾与预算首选',
    keepReason: '该车标配华为ADS 2.0基础包、高精中控与全景泊车，近期上海现车双重补贴红利扣减1.5万，使23.5万实际落地门槛下的智驾安全品质领先同级，如果偏好高阶安全与质胜智驾则首选此版本。',
    riskWarning: '外观风格偏沉稳克制，增程馈电状态下高速亏电油耗达11L/100km，不适合极度执着低油耗的用户。',
    unsuitableConditions: [
      '不适合增程馈电状态下长期跑高速且要求超低油耗的用户',
      '不适合对后座零重力座椅极致腿部空间有绝对要求的六人家庭'
    ],
    trimName: 'Pro五座后驱版',
    priceRange: '折后落地约23.5万'
  },
  {
    id: 'l8',
    brand: '理想',
    name: '理想 L8 Pro 增程版',
    badge: '理想 L8',
    guidePrice: '32.18万起',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
    tagline: '魔毯空气悬架标配，大六座家庭头等舱体验',
    keepStatus: 'keep',
    decisionRole: '舒适与空间天花板',
    keepReason: '标配魔毯空气悬挂第二代，全舱静音双层玻璃配二排独立按摩座椅。二三排通透性及进出过道达160mm无对手，如果家庭出行成员在5-6人且极度关注后排奢享舒适底盘，则推荐首选。',
    riskWarning: '车体过宽，在老旧小区停放极费周折。城区无图高阶NOA功能仅配置在35.98w的Max版上，不适合预算受限且执着于城区高阶自动驾驶的高科极客。',
    unsuitableConditions: [
      '不适合预算严格控制在28万以内且对首年保费极度敏感的家庭买家',
      '不适合主要在狭窄城区小巷与老旧小区穿行、强烈对大车身有焦虑的驾驶人'
    ],
    trimName: 'Pro增程版',
    priceRange: '折后落地约32.18万'
  },
  {
    id: 'n8',
    brand: '腾势',
    name: '腾势 N8 旗舰六座版',
    badge: '腾势 N8',
    guidePrice: '31.98万起',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    tagline: '比亚迪云辇底盘加持，兼备越野脱困能力与豪华感',
    keepStatus: 'weaken',
    decisionRole: '越野与性能备选',
    keepReason: '搭载比亚迪DM-p超级混动四驱，配置云辇-C电控阻尼悬挂，零百加速4.3秒。如果家庭偶尔需要郊区中度脱困越野，且要求超强四驱动力，则是非常优秀的运动备选方向。',
    riskWarning: '整体车机与城区辅助驾驶NOA等高阶算法升级频率略慢于理想和问界，且车身短使得第三排乘坐成人感到明显局促，不适合对高阶智驾有高热情的家庭。',
    unsuitableConditions: [
      '不适合追求前沿科技车机交互和频繁OTA迭代的极客用户',
      '不适合需要第三排长途满载且希望三排乘员正襟危坐、无拥挤感的成年大家庭'
    ],
    trimName: '旗舰六座版',
    priceRange: '折后落地约31.5万'
  }
];

export const STAGE_1_EVIDENCES: DecisionEvidence[] = [
  {
    id: 'e1',
    sourceName: '车型库Plus',
    question: '30万级大六/五座，高阶智驾谁成本最低？',
    conclusion: '如果预算24-26万且智驾是首选，问界M7华为ADS基础包入门即可开；如果预算30万以上且后排是核心，理想L8魔毯底盘+独立座椅优势明显',
    evidenceList: [
      { text: '问界M7 Pro：华为ADS 2.0基础包全国高速/高架开启流畅车道领航，入门款即可使用，无需额外付费', highlight: true },
      { text: '理想L8 基础Pro：智驾仅支持高速NOA，若要获得城区路况无图NOA必须买MAX顶配，预算陡升3.8万', highlight: false },
      { text: '腾势N8：搭载DiPilot 300，支持高速NOA，城区NOA需选装，选装价格约8000元', highlight: false },
      { text: '汽车之家口碑2341条评价中，67%问界M7车主提及"智驾体验超预期"；理想L8相关评价中43%提及"基础版智驾不够用"', highlight: false }
    ],
    type: 'parameter'
  },
  {
    id: 'e2',
    sourceName: '主站行为轨迹/参配表',
    question: '两排三人和三排两娃，哪台座椅分布更符合家庭用车？',
    conclusion: '如果日常只有3-5人出行且看重后备箱装载，问界M7五座版性价比极高；若必须坐满6人且要求二排独立进出，理想L8大六座布局魔毯底盘是天花板',
    evidenceList: [
      { text: '特斯拉/理想等主战对比轨迹显示您的对比核心在于"二排独立"：理想L8采用2+2+2布局，二排中间留出160mm宽通道，两个独立座椅标配按摩，儿童进出三排极其轻松', highlight: true },
      { text: '问界M7五座版：后备箱纵深达1100mm、容积高达686L，能够完美堆放婴儿车、露营装备等，比理想六座满载储物空间多出约400L', highlight: false },
      { text: '腾势N8：2+2+2布局，第二排设独立头等舱座椅，但由于轴距2830mm为同级最小，二排推至最前时膝部空间仅剩一拳，且无魔毯空悬', highlight: false },
      { text: '汽车之家2105条车主实际行为链条中，58%的二胎家庭最终因为"满载长途后备箱不够"从理想L8流回问界M7五座，42%因为"二排按摩"坚持理想L8', highlight: false }
    ],
    type: 'behavior'
  },
  {
    id: 'e3',
    sourceName: '主站报价核算工具',
    question: '上海本地真实落地价、补贴红利及隐藏置换暗补谁最大？',
    conclusion: '如果预算25万以内，问界M7近期叠加地方现车双重补贴，综合落地性价比碾压理想L8和腾势N8；如果预算充裕在31万以上，理想和腾势暂无超大额地补',
    evidenceList: [
      { text: '问界M7 Pro五座后驱版：厂商指导价24.98万，核算上海政企专属促消费与线下门店提车双补贴1.5万后，上海本地真实落地折算价低至23.5万', highlight: true },
      { text: '理想L8 Pro增程版：指导价32.18万，线下门店近期平均现金折让约3000-8000元不整，购置税全免，最终实际落地价维持在31.8万-32.1万', highlight: false },
      { text: '腾势N8 旗舰六座版：指导价31.98万，近期支持最高1.5万置换暗补及2000元保养包，折后实际落地在31.5万左右', highlight: false },
      { text: '系统精准比对上海主站32万级落地价走势：问界M7平均购车决策耗时7天（受限时大降促单），而理想L8受品牌高端保值支撑平均决策耗时18天', highlight: false }
    ],
    type: 'behavior'
  }
];

// ================== STAGE 2 (BATTLE) DATA ==================
// Initial state: m7 and l8 keepStatus="keep", n8 and modely keepStatus="weaken"
export const STAGE_2_CARS: CarInfo[] = [
  {
    id: 'm7',
    brand: '问界',
    name: '问界 M7 Pro 五座后驱版',
    badge: '当前battle主车',
    guidePrice: '24.98万起',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400',
    tagline: '标配华为ADS基础高阶安全，上海双补折合门槛爆表',
    keepStatus: 'keep',
    decisionRole: '智驾与预算首选',
    keepReason: '标配华为ADS 2.0基础包，鸿蒙4.0车机流畅，近期叠加上海双重补贴落地价低至23.5万，智驾安全极高。',
    riskWarning: '增程馈电状态下大电量消耗偏快，高速实测亏电油耗达11L/100km，不适合极执着低能耗用户。',
    unsuitableConditions: [
      '不适合需要长期三排满载家庭',
      '不适合极执着低油耗长途奔袭客户'
    ],
    trimName: 'Pro五座后驱版',
    priceRange: '折后落地约23.5万'
  },
  {
    id: 'l8',
    brand: '理想',
    name: '理想 L8 Pro 增程版',
    badge: '当前battle主车',
    guidePrice: '32.18万起',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
    tagline: '标配魔毯空气悬吊，大六座保姆车高通透全家桶',
    keepStatus: 'keep',
    decisionRole: '舒适与空间天花板',
    keepReason: '标配魔毯空气悬挂与二排独立按摩椅，二排通道宽160mm无对手，三排进出方便，是大家庭舒适极选。',
    riskWarning: '车宽超1.9米，城市窄位停车考验车技，基础版主驾高阶智驾需要升Max配置（贵3.8万）。',
    unsuitableConditions: [
      '不适合预算卡在25万内的家庭',
      '不适合车位特别窄或只爱小巧车的开家'
    ],
    trimName: 'Pro增程版',
    priceRange: '折后落地约32.18万'
  },
  {
    id: 'n8',
    brand: '腾势',
    name: '腾势 N8 旗舰六座版',
    badge: '运动豪华性能备选',
    guidePrice: '31.98万起',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    tagline: '云辇-C悬挂四驱动力霸道，兼具轻度极限脱困',
    keepStatus: 'weaken',
    decisionRole: '越野与性能备选',
    keepReason: 'DM-p超级四混动，提供零百4.3秒加速，配云辇-C阻尼悬架兼顾越野性能。',
    riskWarning: '第三排腿部略局促，车机生态圈与城区高能NOA迭代速率对比理想和问界相对缓慢。',
    unsuitableConditions: [
      '不适合极度强求高精车机交互用户',
      '不适合追求极致平整大六座成人乘区者'
    ],
    trimName: '旗舰六座版',
    priceRange: '折后落地约31.5万'
  },
  {
    id: 'modely',
    brand: '特斯拉',
    name: 'Model Y 后轮驱动版',
    badge: '均衡通勤硬朗款',
    guidePrice: '25.89万起',
    image: 'https://images.unsplash.com/photo-1619551719011-b136f1b9f041?auto=format&fit=crop&q=80&w=400',
    tagline: '成熟电热泵效能代表，极简运动高操控高保值',
    keepStatus: 'weaken',
    decisionRole: '能耗与极简标杆',
    keepReason: '超充覆盖极强，冬季能效控制优秀，操控指哪打哪极其好懂，3年保值率高居65%上下。',
    riskWarning: '运动悬挂实测极硬，路感抛跳明显，车辆后座常坐老人或儿童易引发晕车抱怨。',
    unsuitableConditions: [
      '不适合腰椎敏感的坐车老人',
      '不适合要求纯真皮豪华软装、仪表盘常备的车主'
    ],
    trimName: '后轮驱动版',
    priceRange: '折后落地约26.65万'
  }
];

export const STAGE_2_EVIDENCES: DecisionEvidence[] = [
  {
    id: 'se1',
    sourceName: '车型库Plus / 购车价格清单',
    question: '同是30万级家用SUV，问界M7和理想L8买齐常用配置谁落地更合算？',
    conclusion: '如果预算控制在26万以内，问界M7 Pro智驾配置更全且落地更低；如果预算32万以上且后排体验是核心，理想L8魔毯底盘值这个溢价',
    evidenceList: [
      { text: '问界M7 Pro五座后驱版：官方指导价24.98万，标配华为ADS 2.0基础包、鸿蒙车机、双排通风座椅，上海双补后落地约23.5万', highlight: true },
      { text: '理想L8 Pro增程版：官方指导价32.18万，标配魔毯空气悬架、第二排独立座椅按摩，购置税全免后落地约32.18万', highlight: false },
      { text: '3年保值率：问界M7 58.1%（汽车之家保值率榜单），理想L8 61.2%（同榜单），理想高3.1个百分点，持有3年差价约8300元', highlight: false },
      { text: '汽车之家口碑3127条评价中，52%问界M7车主提及"价格很香/性价比高"；理想L8相关评价中48%提及"贵但值得/后排没对手"', highlight: false }
    ],
    type: 'parameter'
  },
  {
    id: 'se2',
    sourceName: '车型库Plus / 空间实测数据',
    question: '满载全家出行，问界M7五座版和理想L8大六座谁才是家用空间天花板？',
    conclusion: '如果常坐人数为3-5人，问界M7大五座的686L后备箱储物暗格装载更强；如果必须要常满6人且要孩子出入二排丝滑，理想L8二排160mm独立通道是绝对赢家',
    evidenceList: [
      { text: '二排横向跨度与高度：理想L8轴距高达3005mm，二排座椅中心间距160mm通往三排，全车双层隔音玻璃物阻感全优，是真正的六座头等舱', highlight: true },
      { text: '问界M7 Pro：轴距2820mm，大五座布局二排纵向可享990mm绝对腿部空间，翻折后可扩充至1619L全平床铺，装载旅行大软包装能力突出', highlight: false },
      { text: '汽车之家空间实测：理想L8满载6人时后备箱纵深仅350mm（只能竖着放下2个20寸行李箱），问界M7五座模式下完美吞下5个24寸机长箱', highlight: false },
      { text: '主站口碑大数据：86%的六座理想L8购买者关键决策词为"二排孩子方便"，而72%的五座问界M7购买者更看重"后备箱露营储物极高上限"', highlight: false }
    ],
    type: 'parameter'
  },
  {
    id: 'se3',
    sourceName: '汽车之家冬季能效长测记录',
    question: '北方冬季-10℃极端路况长途，问界M7和理想L8馈电油耗和续航越冬谁更顶？',
    conclusion: '如果频繁长途且想用纯电通勤，理想L8百公里综合馈电油耗稍占优势且电池配比合理；如果注重中短途充电时间，两车综合油电总里程均超过1100km',
    evidenceList: [
      { text: '纯电续航：两车标配纯电续航实测均在215km，在冬季北方-10度空调暖风不歇状态下，理想L8纯电续航达成率48%（折合约103km），问界M7达成率46%（折合约99km）', highlight: false },
      { text: '冬季馈电油耗：汽车之家冬季车主实测长测，理想L8 Pro实测馈电油耗平均达8.9L/100km，问界M7 四驱版重载高速为9.8L/100km，后驱版大样本跑出8.5L/100km', highlight: true },
      { text: '快充峰值：在百核直流快充桩中，问界M7从30%-80%需时28分钟（电控峰值稳定在60kW上下），理想L8 Pro在75kW直流快充下需时30分钟', highlight: false },
      { text: '能效总账本：大样本车主一年累计1.5万纯电/增程总共总油电走势，两车能源折算支出差额低于320元，物理差极其微小', highlight: false }
    ],
    type: 'slice'
  },
  {
    id: 'se4',
    sourceName: '汽车之家OTA月度测评报告',
    question: '城区行车避障与高速自动NOA车道修正，华为ADS基础智驾与理想基础智驾谁更成熟拟人？',
    conclusion: '如果是高速/高架上的跟车自变道巡航，两车智驾均在标杆阶队行车顺畅；如果注重雨夜前方避停及车道抢障闪雷反应，问界M7基础硬件识别敏度更好',
    evidenceList: [
      { text: '智驾硬件对比：问界M7 Pro标配华为ADS基础智驾包、3个毫米波雷达、12个超声波及10个高清摄像头，突出的全天候主动安全在行车内测中达到防撞安全标口', highlight: true },
      { text: '理想L8 Pro：全系标配单个征程5智驾芯片、1个毫米波雷达及11个摄像头，支持出色的自导航上下匝道，但面对极端静态横障时其系统反应车身动作表现稍急', highlight: false },
      { text: '汽车之家OTA实测评定：雨夜AEB动态识别中，问界M7系统在60km/h下能够提前32米探测并完全稳妥停停，理想L8系统对50km/h假人横穿报警极速且制动力陡增', highlight: false },
      { text: '百万里程车主问卷提及中：问界M7因"智能避坑并拟人化变道效率"获得76%满好度评价，理想L8以"跟车变道求稳妥"获81%大众家用合格度', highlight: false }
    ],
    type: 'opinion'
  },
  {
    id: 'se5',
    sourceName: '车型库口碑雷达大数据',
    question: '真实避坑审计，关于高速风燥以及车宽划痕，老旧口碑最严重的缺点有哪些？',
    conclusion: '如果绝对无法容忍高速风噪大以及馈电抖动，请避坑问界M7的增程震动；如果害怕窄车位卡死倒车轮毂擦伤并嫌质保期短，请谨慎衡量理想L8大车身体重',
    evidenceList: [
      { text: '问界M7口碑槽点：大样本库共1820条反馈，其中32%车主直言"120km/h高速下，A柱风噪及门板密封实测明显较同价位油车吵，且三排由于离尾门近胎噪偏响"', highlight: true },
      { text: '理想L8口碑反馈：1590条真实车主记录，42%集中于"5080mm车长和1995mm车宽，进老旧狭小立体车库或路边划线窄位时极其费力，轮毂胎壁平均刮擦2次以上"', highlight: false },
      { text: '故障分布比率：问界M7偶发车机高频细微滋滋盲区鸣响占比1.2%；理想L8魔毯悬挂1年内偶发打气泵慢充气过载偶发报错比1.8%（均由售后免费升级更换）', highlight: false },
      { text: '质保限制差异：问界M7整车质保4年或10万公里，三电不限首任终身保护（限年1万公里内）；理想L8整车质保5年或10万公里，首任享受基础终身质保（需特定尊享权益包）', highlight: false }
    ],
    type: 'risk'
  },
  {
    id: 'se6',
    sourceName: '车型库Plus / 保值率与维保清单',
    question: '持有3-5年谁的折旧亏损最少，日常每年保养周期费用开支谁更省心？',
    conclusion: '若3年内有换车换购算盘，理想L8靠口碑优势累计保值多换取约1万元；若执着常年不坏保修保本，问界M7保养计划维合油路养路费用稍微便宜',
    evidenceList: [
      { text: '保值率实测：根据汽车之家2025年最新大保值报告，理想L8三年残值保值率61.2%（前三标杆），问界M7三年车辆保值58.1%，三年算折损差大约在8300元上下', highlight: false },
      { text: '基础保养价格：问界M7每跑1万公里或12个月进行首批机油滤更换保养，基础费用在560元/次。理想L8同等级小保养官方维卡费用按标准约为680元/次', highlight: true },
      { text: '核心质保：问界M7对首任非商用提供三电无限终身质保（单年限制少于10万公里内），理想L8首任无特定购买包时，三电延保期至8年或16万公里', highlight: false },
      { text: '综合持有折旧：首年保费问界M7约5800元，理想L8因多空悬大件商业险提价至7100元。问界在车本身24w售价基数上，总折旧金额风险相比理想低约6.8万', highlight: false }
    ],
    type: 'risk'
  }
];

export const STAGE_2_PARAMS: ParameterRow[] = [
  //分类 price 5行
  {
    category: 'price',
    parameterName: '官方指导价',
    modelAValue: '24.98万起 (M7 Pro)',
    modelBValue: '32.18万起 (L8 Pro)',
    differenceText: '问界 M7 购车账面便宜 7.20 万'
  },
  {
    category: 'price',
    parameterName: '3年保值残值率',
    modelAValue: '58.1% (三年评估平均)',
    modelBValue: '61.2% (常年在前三名位)',
    differenceText: '理想 L8 二手残值率高出 3.1%'
  },
  {
    category: 'price',
    parameterName: '置换升级大包优惠',
    modelAValue: '上海专属补贴折合超 15000 元',
    modelBValue: '购置全免，线下送最高 8000 权益',
    differenceText: '问界 享受地方更强专属双补贴红利'
  },
  {
    category: 'price',
    parameterName: '整车质保里程',
    modelAValue: '四年或 10 万公里',
    modelBValue: '五年或 10 万公里',
    differenceText: '理想 整车质保比问界高出 1 年覆盖'
  },
  {
    category: 'price',
    parameterName: '三电专属质保承诺',
    modelAValue: '首任车主无限里程终身安全(除限额)',
    modelBValue: '原厂 8 年或 16 万公里常规保修',
    differenceText: '问界 无故障三电焦虑，终身更有保障'
  },

  //分类 space 5行
  {
    category: 'space',
    parameterName: '车身总长度 (mm)',
    modelAValue: '5020',
    modelBValue: '5080',
    differenceText: '理想 L8 车身更长 60mm，二排纵深更大'
  },
  {
    category: 'space',
    parameterName: '车体极限轴距 (mm)',
    modelAValue: '2820',
    modelBValue: '3005',
    differenceText: '理想 L8 跨级多出 185mm 轴长'
  },
  {
    category: 'space',
    parameterName: '后排极限大腿部空间',
    modelAValue: '990mm (大五座宽体姿能)',
    modelBValue: '1020mm (二排单人舒躺椅距)',
    differenceText: '理想 独立座椅后退拥有更完美的舒展空间'
  },
  {
    category: 'space',
    parameterName: '后备箱最大装载容积',
    modelAValue: '686升 - 翻折最高达 1619升',
    modelBValue: '满员 350升 - 放倒后最大达 1090升',
    differenceText: '问界 大五座储物能力直接翻倍大胜'
  },
  {
    category: 'space',
    parameterName: '第二排座椅科技配置',
    modelAValue: '双排加热、通风、八向调配等',
    modelBValue: '双独立通道座椅、按摩震动腰托',
    differenceText: '理想 多大160mm中央进出通道及靠椅全身按摩'
  },

  //分类 power 5行
  {
    category: 'power',
    parameterName: '最大混动马力/性能',
    modelAValue: '单电机后驱版输出 / 272 匹',
    modelBValue: '双电机智能智能四驱 / 449 匹',
    differenceText: '理想 零百5.5秒四驱性能胜过问界后驱7.8秒'
  },
  {
    category: 'power',
    parameterName: '纯电续航里程CLTC',
    modelAValue: '215km',
    modelBValue: '225km',
    differenceText: '纯电续航极其相似，理想略多 10km'
  },
  {
    category: 'power',
    parameterName: '满油满电CLTC综合续航',
    modelAValue: '1100km / 约60升大油箱',
    modelBValue: '1315km / 约65升全负荷油箱',
    differenceText: '理想 综合极限超跑续航比问界多 215km'
  },
  {
    category: 'power',
    parameterName: '直流高压快充功率峰值',
    modelAValue: '最大快充支持算约 60kW',
    modelBValue: '峰值快充功率最大支持 75kW',
    differenceText: '理想 充30%-80%约快出2分钟物理峰值'
  },
  {
    category: 'power',
    parameterName: '增程混动燃油机排量',
    modelAValue: '1.5T 涡轮高效四气缸 152马力',
    modelBValue: '1.5T 涡轮增程器低震动四缸发电机',
    differenceText: '均用 1.5T 排量增程发电机系统，技术同代'
  },

  //分类 intelligence 5行
  {
    category: 'intelligence',
    parameterName: '智驾传感器大组合',
    modelAValue: '3个毫米波 / 12个超声波 / 10个相机',
    modelBValue: '1个前置毫米波 / 12个超声波 / 11个相机',
    differenceText: '问界 标配多出 2 个侧向防拉防擦毫米波雷达'
  },
  {
    category: 'intelligence',
    parameterName: '高速NOA长途自并线',
    modelAValue: '标配高速/高架领航导航变道辅助',
    modelBValue: '标配高速NOA全自动化行车',
    differenceText: '在封闭快速路上两车巡航避阻均属高标梯队'
  },
  {
    category: 'intelligence',
    parameterName: '城区NOA城区导航领航',
    modelAValue: '当前基础版本均不支持城区无图导航',
    modelBValue: '基础Pro不支持，均需升级更贵Max版本',
    differenceText: '需要城区黑科技的客户都需要承担约3.8万大溢价'
  },
  {
    category: 'intelligence',
    parameterName: '多车位自动识别自动泊车',
    modelAValue: '鸿蒙OTA精细算法车位泊车(高通过率)',
    modelBValue: '自动泊车辅助、钥匙物理一键前后直移',
    differenceText: '问界 在极狭窄以及无划线线槽下泊回通过率高'
  },
  {
    category: 'intelligence',
    parameterName: 'OTA软件更新频率',
    modelAValue: '平均 45 天一推送更新，紧密追赶手机链',
    modelBValue: '平均 60 天一迭代推送，偏向合规统合安全',
    differenceText: '问界 深度绑定开发者社区体验升级节奏更新鲜'
  },

  //分类 risk 5行
  {
    category: 'risk',
    parameterName: '悬空底盘设计形式',
    modelAValue: '前麦弗逊式独立 / 后多连杆式悬架',
    modelBValue: '前双叉臂 / 后五连杆 / 标配二代魔毯空悬',
    differenceText: '理想 具备高规格空悬阻尼自清洗，滤震明显碾压'
  },
  {
    category: 'risk',
    parameterName: '120码高速隔音实测NVH',
    modelAValue: '实测 68.5 分贝 (风噪通过A柱透风感略高)',
    modelBValue: '实测 66.2 分贝 (全舱玻璃防噪用料扎实)',
    differenceText: '理想 高速整体风阻底阻静谧度明显更佳'
  },
  {
    category: 'risk',
    parameterName: '窄弯以及特殊地库开拔',
    modelAValue: '轴距2.82米，车宽1945mm，掉头开行偏顺手',
    modelBValue: '轴距3.0米，车宽1995mm，极其考验盲区控制',
    differenceText: '理想 倒车极其累，极易发生侧框轮胎擦损'
  },
  {
    category: 'risk',
    parameterName: '北方极端低温纯电续航達成率',
    modelAValue: '低温达成率实测约 46% (冬季快充衰耗)',
    modelBValue: '低温达成率实测约 48% (带预热极效功)',
    differenceText: '锂电特质相同，冬季北方纯电机开暖气均有5折衰竭'
  },
  {
    category: 'risk',
    parameterName: '口碑大雷区及投诉点',
    modelAValue: '满配A柱风噪吐槽多且馈电增程器震动噪音大',
    modelBValue: '底盘常气泵偶报错且老街停车体积太宽太累车',
    differenceText: '双边短板显性：理想死于超宽，问界死于行车风噪'
  }
];

export const REVIEWS_MOCK: ReviewItem[] = [
  // Wanjie M7: 10 reviews (5 positive, 5 negative)
  {
    id: 'm1_pos1',
    author: '上海浦东车主-老张',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    date: '2025-06-15',
    tag: '智驾高性价比',
    content: '问界M7 Pro智驾体验超出一包想象！在南北高架上被突然横插出来的单车急刹，华为ADS系统能提前近25米刹停，比人反应快多，而且在上海双补拿完23万多的落地成本确实香。'
  },
  {
    id: 'm1_pos2',
    author: '华为忠实粉丝-科技发烧友',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    date: '2025-07-20',
    tag: '鸿蒙车机无敌',
    content: '鸿蒙4.0车机真的是目前车机天花板，手机无感流转太爽了！坐在前排操作任何软件完全是零延迟零卡顿，而且华为ADS高速巡航很稳，开长途基本上不需要使劲调整方向盘。'
  },
  {
    id: 'm1_pos3',
    author: '二胎奶爸-陈先生',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    date: '2025-08-12',
    tag: '超大储物仓',
    content: '买的问界M7大五座，后备箱空间真的是神级能装！全家去露营把婴儿折叠椅、大立式帐篷、4箱水和3个置物包塞进去，盖上挡板居然毫无压力，底部的地板下方居然还掏出了100多升隐私分格。'
  },
  {
    id: 'm1_pos4',
    author: '安驾车队-陆师兄',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    date: '2025-09-02',
    tag: '纯电平顺质感',
    content: '虽然是增程式，但是起步那一下提速完全就是高档纯电的质感，而且电机调教非常线性，日常上下班用纯电模式在拥堵的市区跟车，动能回收几乎没有传统电车的眩晕抛跃感。'
  },
  {
    id: 'm1_pos5',
    author: '置换买家-王叔叔',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    date: '2025-10-05',
    tag: '地方补贴真香',
    content: '原先开的是老雅阁，通过主站报价渠道参与了上海现车置换，问界销售帮我办齐了所有退补申报，核算下来比同行的指导价底了一万五，这个真实到手价格配上这个安全性，直接闭眼入。'
  },
  {
    id: 'm1_neg1',
    author: '高速长途客-阿辉',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100',
    date: '2025-09-18',
    tag: '电消快高速油耗高',
    content: '增程馈电状态下高速油耗偏高，实测跑高速亏电油耗达11L/100km，长途成本比同等规格的紧凑型油车高不少，如果你有一半时间单程跑超400公里，电量耗光后增程加油是不容小觑的开支。'
  },
  {
    id: 'm1_neg2',
    author: '敏感噪声控-李女士',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    date: '2025-08-04',
    tag: '高速A柱风噪大',
    content: '新车上高速跑110-120码时，两边A柱传出来的细密透风声和轮胎拍击水泥路的声音太吵了，风噪真的很明显，比不上那些标配全车隔音舱密封的老牌豪华车，建议追求极度静音的朋友慎重试驾。'
  },
  {
    id: 'm1_neg3',
    author: '底盘驾驶迷-小段',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
    date: '2025-07-15',
    tag: '麦弗逊底盘软',
    content: '问界M7前底盘采用常规的前麦弗逊独立悬挂，过颠簸路面或急转弯变道时车身支撑软了点，尤其是车速到60拐大弯时，侧弯晃荡感有些明显，底盘高级感和运动性能确实不如前双叉臂结构。'
  },
  {
    id: 'm1_neg4',
    author: '大家庭成员-陈陈',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100',
    date: '2025-06-28',
    tag: '外观颜值古板',
    content: '问界M7这副传统的车头前脸和中规中矩的腰线在聚光灯下显得太老成，甚至有点像传统的燃油老面包。车尾平直缺乏未来时尚质感，没有其他新能源猎装轿跑或者硬顶运动风格那种惊艳。'
  },
  {
    id: 'm1_neg5',
    author: '寒地通勤者-哈尔滨小白',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100',
    date: '2025-11-10',
    tag: '冬季纯电大缩水',
    content: '黑龙江进入11月零下8度左右，满电CLTC标称215公里实测跑个100公里不到增程器就会强制干预开动，冬季纯电达成率连一半都比较勉强。如果指望完全用电不加油越冬，可能需要调整心理预期。'
  },

  // Li L8: 10 reviews (5 positive, 5 negative)
  {
    id: 'l8_pos1',
    author: '温馨三胎爸-郭哥',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    date: '2025-03-30',
    tag: '全家头等舱舒享',
    content: '买理想L8 Pro最满意的就是魔毯悬空！后排坐老婆和两个孩子，老人家在二排大独立座椅上放平做按摩。高速过烂路非常稳，完全是把大坑洼熨烫平整的回馈快感，开长途谁也不累。'
  },
  {
    id: 'l8_pos2',
    author: '完美细节妈-珍妮',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100',
    date: '2025-05-18',
    tag: '二排160mm大通道',
    content: '大六座太实用了！二排两个座椅各带有电动扶手和160mm中间过道，大女儿和小儿子平时在后面打闹去三排可以直接顺着过道爬。全舱都是高级真皮软装，质感摸得到，奶爸专车确实到位。'
  },
  {
    id: 'l8_pos3',
    author: '上海静享人-林先生',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=100',
    date: '2025-06-11',
    tag: '隔音极佳NVH出色',
    content: '全系标配大双层隔音降噪夹层，在时速120km的高速上外界大卡车的呼啸被过滤得只剩下极细微的声音，隔音测试实测仅66分贝左右，是30w级别里能让车里人安稳睡觉的最佳空间。'
  },
  {
    id: 'l8_pos4',
    author: '置换通勤客-徐阿姐',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
    date: '2025-08-25',
    tag: '四驱动能极其底足',
    content: '看中四驱智能系统在冬季湿滑路上的安全性。L8标配双电机，起步极平稳，百公里加速5.5秒性能在满载状态下爬陡坡、高架变道心里特别有底气，魔毯空悬还能随超高速自适应降低。'
  },
  {
    id: 'l8_pos5',
    author: '高端露营家-大麦',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100',
    date: '2025-09-14',
    tag: '外放电完美匹配',
    content: '理想L8的3.5kW静音对外放电接口真的是带娃野营不卡顿利器。去郊野公园放平二三排，插上投影和高压电电磁炉，给孩子们煮肉饼配上微风，这趟周折体验是前未有过的舒奢。'
  },
  {
    id: 'l8_neg1',
    author: '狭窄老区车主-老胡',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=100',
    date: '2025-10-12',
    tag: '车宽超宽难停',
    content: '车身太长太宽，5米2的车进老小区地库每次都提心吊胆，内转弯半径大停车位经常刮来刮去。车宽逼近2米，在上海老弄堂里会车或倒车入库太痛苦了，胎侧橡胶不小心蹭烂爆漆两次了。'
  },
  {
    id: 'l8_neg2',
    author: '科技极致粉-小廖',
    avatar: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=100',
    date: '2025-07-28',
    tag: '智驾硬件基础城区差',
    content: '地平线征程5那套基础硬件只适合当一个常规自导航高速，不能升级无图城区智驾，碰到城区各种临时封道或者水马只能靠自己接管。想用真正的黑科技就必须加3.8万买顶级Max，太偏心。'
  },
  {
    id: 'l8_neg3',
    author: '自律能耗哥-周先',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100',
    date: '2025-06-03',
    tag: '车重过载油耗偏高',
    content: '车体净重达2.3吨太大了，日常馈电油耗绝对下不了9.5升/百公里。只要不装家用大充电桩每天单靠加油的话，持有花销堪比一辆高能2.0T纯油大卡车，没有网上吹的那样零能耗支出。'
  },
  {
    id: 'l8_neg4',
    author: '保费高折旧派-精明钱',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
    date: '2025-04-19',
    tag: '高端车首年保费贵',
    content: '因为全系带有空气悬架、高规格真电多显示屏配置，商业险首年保费直接核算开单到7100多。在没有大额补贴的情况下指导价死死在32.18万，首期首单置盘财务亏损支出太硬，高估置换成本。'
  },
  {
    id: 'l8_neg5',
    author: '第三排长乘坐-小罗',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=100',
    date: '2025-09-24',
    tag: '三排满员尾箱极小',
    content: '虽然是六座设计，如果三排要稍微舒服地坐满2个成年人，第二排座椅必须前推，此时二排脚跟位置完全卡死。而且最折磨人的是六座满员时尾箱只剩350升，出远门连3个稍微大行李也堆不下。'
  }
];

// SKU Recommendations
export const SKU_RECOM_M7: SkuRecommend[] = [
  {
    id: 'm7_s1',
    title: '问界M7 Pro 五座后驱版',
    priceText: '折后落地约23.5万',
    recomReason: '全系销量最高配置，华为ADS 2.0基础包标配开通无需额外付费，鸿蒙4.0车机流畅度在同级中领先，适合预算25万以内且智驾是第一优先级的用户',
    keyFeatureDiff: '后驱单电机 / 百公里加速7.8秒 / 纯电续航215km / WLTC综合续航1100km / 标配华为ADS 2.0基础包',
    badge: 'high-sales'
  },
  {
    id: 'm7_s2',
    title: '问界M7 Pro 六座后驱版',
    priceText: '折后落地约24.98万',
    recomReason: '适合对多成员乘坐有偶发需求的刚需二胎家庭。内置零重力右侧尊享座椅，近期叠加地方现车直接保税与保险补贴一万，性价比极其出色',
    keyFeatureDiff: '2+2+2六座布局 / 零重力副二椅 / 纯电195km(带防充大电芯) / CLTC综合1050km',
    badge: 'same-price'
  },
  {
    id: 'm7_s3',
    title: '问界M7 Max 六座四驱高阶智驾版',
    priceText: '折后落地约28.78万',
    recomReason: '极客家庭、安全追求无极限首选！顶配搭载顶尖192线激光雷达，享用城区真无图NOA代导航、夜间超高阻AEB防追死，前后电吸静音高档门',
    keyFeatureDiff: '双电机四向强驱 / 激光雷达智算高达508TOPS / 120km/h超速安全刹车 / 电吸舒适车门',
    badge: 'top-spec'
  }
];

export const SKU_RECOM_L8: SkuRecommend[] = [
  {
    id: 'l8_s1',
    title: '理想L8 Pro 增程版',
    priceText: '折后落地约32.18万',
    recomReason: '全系主销版本，标配二代魔毯空气悬架和第二排独立座椅腰托按摩，后排舒适性在30万级六座SUV中无对手，适合家庭用车且后排体验是核心诉求的用户',
    keyFeatureDiff: '增程四驱 / 百公里加速5.5秒 / 纯电续航225km / CLTC综合续航1315km / 标配空气悬架+魔毯系统',
    badge: 'high-sales'
  },
  {
    id: 'l8_s2',
    title: '理想L8 Ultra 智驾舒适版',
    priceText: '折后落地约35.98万',
    recomReason: '高配销量顶棚，不仅增配全舱铂金高传真声响、升级双冷热压缩大冰箱。更重要是由于加入Max高配雷达，完美获得城区不限图的高代智驾NOA体验',
    keyFeatureDiff: '激光雷达硬件+双Orin算脑 / 二排冷暖两用压冰柜 / 舱等21枚高保音音响大阵',
    badge: 'same-price'
  },
  {
    id: 'l8_s3',
    title: '理想L8 Max 顶级尊享豪华版',
    priceText: '折后落地约37.98万',
    recomReason: '六座顶峰形态，不仅配齐高规格阻泥空悬与多模雷达城区NOA。更有全舱17.3寸顶置大屏娱乐，极力升级全家三维沉浸出行头等舒适体验',
    keyFeatureDiff: '二排前置高精娱乐吊顶大屏 / Nappa真皮包覆升级 / 双机独立静音打气泵空悬',
    badge: 'top-spec'
  }
];
