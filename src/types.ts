/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CarInfo {
  id: string;
  brand: string;
  name: string;
  badge?: string; // e.g. "问界", "理想", "特斯拉", "极氪"
  guidePrice: string;
  image: string;
  tagline?: string;
  // Deep data specifically used in comparison and evaluation
  keepStatus: 'keep' | 'weaken' | 'exclude'; // 保留, 弱化, 排除
  decisionRole: string; // e.g. "智驾首选", "家庭舒适王", "预算稳妥备选"
  keepReason: string; // 保留理由
  riskWarning: string; // 排除风险/不适合用户的条件
  unsuitableConditions: string[]; // 针对反证与风险卡
  trimName?: string;
  priceRange?: string;
}

export interface ParameterRow {
  parameterName: string;
  modelAValue: string;
  modelBValue: string;
  differenceText: string;
  category: 'price' | 'space' | 'power' | 'intelligence' | 'risk';
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  tag?: string; // "配置实用", "空间舒适", "动力充沛", etc.
}

export interface SkuRecommend {
  id: string;
  title: string; // e.g. "2024款 后驱超长续航版"
  priceText: string;
  recomReason: string;
  keyFeatureDiff: string;
  badge: 'high-sales' | 'same-price' | 'top-spec'; // 高销量版 | 同价位版 | 顶配
}

export interface DecisionDimension {
  id: string;
  label: string;        // 维度名称，如"价格/落地成本"
  conclusion: string;   // 一句话结论，必须有双边对比
  supportEvidence: string;  // 支持推荐的一条正向证据
  riskReminder: string;     // 一条反向提醒/风险提示
  isRelevant: boolean;  // 是否与当前用户相关，只展示true
}

export interface DecisionChainStep {
  id: string;
  title: string;          // 例如："家里人坐得舒服吗？"
  dimensions: string[];   // 关联维度标签
  conclusion: string;     // 一句话结论明示谁更占优
  supportEvidence: string; // 推荐理由 / 支持证据
  reverseReminder: string; // 反向提醒 / 风险提示
  impact: string;         // 对候选车的影响
  isRelevant?: boolean;   // 是否与当前用户相关
}

export interface DecisionEvidence {
  id: string;
  question: string; // 决策问题
  conclusion: string; // 结论
  evidenceList: { text: string; highlight?: boolean }[]; // 关键证据条目
  type: 'behavior' | 'parameter' | 'opinion' | 'review' | 'risk' | 'slice'; // 六类证据类型
  sourceName: string; // 来源, e.g. "主站行为", "车型库Plus", "真实口碑"
}

export interface UserPreferences {
  stage: string; // "候选形成" | "多车battle" | "版本确认" | "风险排查" | "决策临界"
  candidateIds: string[];
  userDebatePoint: string; // 核心纠结点, e.g. "空间舒适性 vs. 智驾体验 vs. 预算确定性"
  pendingItems: string[]; // 待确认项
  weights: {
    price: number;
    space: number;
    power: number;
    intelligence: number;
    safety: number;
    risk: number;
  };
}
