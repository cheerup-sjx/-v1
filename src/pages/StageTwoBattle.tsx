/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Settings2, 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  FileText, 
  Info,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Database,
  ThumbsDown,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  STAGE_2_CARS, 
  STAGE_2_EVIDENCES, 
  STAGE_2_PARAMS, 
  REVIEWS_MOCK, 
  SKU_RECOM_M7, 
  SKU_RECOM_L8 
} from '../data/mockData';
import { CarInfo, SkuRecommend, ParameterRow } from '../types';

interface StageTwoProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function StageTwoBattle({ showToast }: StageTwoProps) {
  // 1. Core Reactive States
  const [cars, setCars] = useState<CarInfo[]>(STAGE_2_CARS);
  const [weights, setWeights] = useState({
    price: 70,
    space: 85,
    power: 60,
    intelligence: 80,
    risk: 75
  });

  // Dynamic status factors calculated based on slider weights
  const [modelYScore, setModelYScore] = useState(82);
  const [zeekrScore, setZeekrScore] = useState(85);
  const [suitabilityReason, setSuitabilityReason] = useState('当前空间与智驾权重均较高，问界M7在智驾成本上占优，但理想L8后排舒适性和空间天花板更高，取决于您更看重哪一项');

  // Recalculate suitability scores whenever sliders are dragged
  useEffect(() => {
    // Basic dynamic weights solver logic matching our specifications:
    const myS = Math.round(
      (100 - weights.price) * 0.15 + 
      weights.intelligence * 0.5 + 
      weights.power * 0.2 + 
      (100 - weights.space) * 0.1 - 
      weights.risk * 0.1 + 45
    );
    const zkS = Math.round(
      (100 - weights.price) * 0.1 + 
      weights.space * 0.5 + 
      weights.power * 0.4 + 
      weights.intelligence * 0.2 - 
      weights.risk * 0.1 + 35
    );

    // Bound scores between 40-100 for aesthetics
    const boundedY = Math.max(45, Math.min(99, myS));
    const boundedZ = Math.max(45, Math.min(99, zkS));
    
    // ADJUST MATCH COEFFICIENTS BASED ON CARS' STRATEGIC STATUS
    const m7Car = cars.find(c => c.id === 'm7');
    const l8Car = cars.find(c => c.id === 'l8');

    let finalY = boundedY;
    let finalZ = boundedZ;

    if (m7Car?.keepStatus === 'weaken') finalY = Math.max(40, finalY - 15);
    if (m7Car?.keepStatus === 'exclude') finalY = 0;

    if (l8Car?.keepStatus === 'weaken') finalZ = Math.max(40, finalZ - 15);
    if (l8Car?.keepStatus === 'exclude') finalZ = 0;

    setModelYScore(finalY);
    setZeekrScore(finalZ);

    if (finalZ === 0 && finalY === 0) {
      setSuitabilityReason('由于两款主力车型均被设定为【主动排除】，请在纠偏处补充其他意向车型重新召回。');
    } else {
      setSuitabilityReason('当前空间与智驾权重均较高，问界M7在智驾成本上占优，但理想L8后排舒适性和空间天花板更高，取决于您更看重哪一项');
    }
  }, [weights, cars]);

  // Expandable sections
  const [expandedEvidences, setExpandedEvidences] = useState<Record<string, boolean>>({
    'se1': true, // Keep first open by default
  });
  const [activeParamTab, setActiveParamTab] = useState<'price' | 'space' | 'power' | 'intelligence' | 'risk'>('price');
  const [skuCompareTab, setSkuCompareTab] = useState<'high-sales' | 'same-price' | 'top-spec'>('high-sales');
  
  // Feedback selections
  const [riskAFeedback, setRiskAFeedback] = useState<Record<string, string>>({});
  const [riskBFeedback, setRiskBFeedback] = useState<Record<string, string>>({});
  
  // Custom feedback inputs
  const [customMsg, setCustomMsg] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<string[]>([
    '偏好型反馈：注重冬季北方续航衰弱控制（权重已修正）'
  ]);

  // Show detailed parameters overlay
  const [showDbOverlay, setShowDbOverlay] = useState(false);
  const [showRedBookDraft, setShowRedBookDraft] = useState(false);
  
  // Multi-steps drawers
  const [activeDrawer, setActiveDrawer] = useState<'none' | '落地价' | '询价' | '试驾' | '智能体' | '工单保存中'>('none');
  const [targetCar, setTargetCar] = useState('l8');
  const [userPhone, setUserPhone] = useState('');

  // Background docket save rendering states
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveStep, setSaveStep] = useState('');
  const [isSavingComplete, setIsSavingComplete] = useState(false);

  const toggleEvidence = (id: string) => {
    setExpandedEvidences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllEvidences = () => {
    const allIds = STAGE_2_EVIDENCES.map(e => e.id);
    const anyCollapsed = allIds.some(id => !expandedEvidences[id]);
    const newState: Record<string, boolean> = {};
    allIds.forEach(id => {
      newState[id] = anyCollapsed;
    });
    setExpandedEvidences(newState);
    showToast(anyCollapsed ? '已全部展开双车对比核心证据' : '已全部收起双车对比核心证据', 'info');
  };

  const handleStatusChange = (carId: string, newStatus: 'keep' | 'weaken' | 'exclude') => {
    setCars(prev => prev.map(car => {
      if (car.id === carId) {
        return { ...car, keepStatus: newStatus };
      }
      return car;
    }));
    
    // Trigger user-friendly Toast Alert
    const carObj = STAGE_2_CARS.find(c => c.id === carId);
    const carName = carObj ? `${carObj.brand} ${carObj.trimName || carObj.name}` : carId;
    const displayName = carObj ? `${carObj.brand} ${carObj.name.replace(carObj.brand, '').trim()}` : carId;
    const statusLabel = newStatus === 'keep' ? '保留' : newStatus === 'weaken' ? '弱化' : '彻底排除';
    
    if (newStatus === 'keep' && (carId === 'n8' || carId === 'modely')) {
      showToast(`已将${displayName}加入battle，页面将重新围绕新pair生成对比...`, 'info');
    } else {
      showToast(`已将 ${carName} 的对比决策状态变更为：【${statusLabel}】`, 'info');
    }
  };

  // Background docket rendering effect
  useEffect(() => {
    if (activeDrawer === '工单保存中') {
      setIsSavingComplete(false);
      setSaveProgress(0);
      setSaveStep('📨 正在提取当前的滑动纠偏权重和车型保留因子...');
      
      const interval = setInterval(() => {
        setSaveProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSavingComplete(true);
            setSaveStep('✅ 成功为您封锁当前的精简分析工单！');
            showToast('工单数据包已成功备份至汽车之家的云备份库！', 'success');
            return 100;
          }
          const next = prev + 10;
          if (next === 30) {
            setSaveStep('🛠️ 正在创建该Battle报告的持续升级工单容器号...');
          } else if (next === 60) {
            setSaveStep('🧬 正在将 2 组个性化弱化因子并入汽车之家车型比对流中...');
          } else if (next === 90) {
            setSaveStep('🔒 正在由系统注入永久快照加密签章并下发本地短信通知码...');
          }
          return next;
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [activeDrawer]);

  const handleSliderChange = (key: keyof typeof weights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
    // throttled toast triggers can be handled gracefully
  };

  const handleRiskFeedback = (carId: string, riskIdx: number, type: '很在意' | '能接受' | '此项不适用') => {
    if (carId === 'm7') {
      setRiskAFeedback(prev => ({ ...prev, [riskIdx]: type }));
    } else {
      setRiskBFeedback(prev => ({ ...prev, [riskIdx]: type }));
    }
    showToast(`已标记该顾虑点为【${type}】，已自动加入避坑决策矩阵审核。`, 'success');
  };

  const submitFeedback = (type: '否定' | '偏好' | '约束' | '排斥') => {
    if (!customMsg.trim()) return showToast('请输入反馈内容', 'warning');
    
    // Process input signals and adjust states dynamically
    if (type === '排斥') {
      showToast(`已将您的排斥信号 “${customMsg}” 读写入报告，自动重审排除备选车。`, 'success');
      setFeedbackHistory(prev => [...prev, `排斥型反馈：排除 ${customMsg}`]);
    } else if (type === '约束') {
      setWeights(prev => ({ ...prev, price: 95 })); // Raise budget constraint weight
      showToast(`已录入买车价格上限：${customMsg}，已自动更新版本推荐口径！`, 'success');
      setFeedbackHistory(prev => [...prev, `约束型反馈：${customMsg}`]);
    } else if (type === '偏好') {
      setWeights(prev => ({ ...prev, intelligence: 95 })); // Raise intelligence priority
      showToast(`优先响应高级诉求：${customMsg}，已提高相关科技证据排序！`, 'success');
      setFeedbackHistory(prev => [...prev, `偏好型反馈：更注重 ${customMsg}`]);
    } else {
      showToast(`否定型挑战已记录！重新召回真实口碑反对声音以作均衡。`, 'info');
      setFeedbackHistory(prev => [...prev, `否定型反馈：对参数结论提出异议`]);
    }
    
    setCustomMsg('');
  };

  // Get active SKU to display based on SKU Tab
  const activeModelYSku = SKU_RECOM_M7.find(s => s.badge === skuCompareTab);
  const activeZeekrSku = SKU_RECOM_L8.find(s => s.badge === skuCompareTab);

  // Filter parameter list to show corresponding tab
  const activeParamsFiltered = STAGE_2_PARAMS.filter(p => p.category === activeParamTab);

  return (
    <div className="flex-1 flex flex-col p-3 gap-3.5 select-text" id="stage-two-battle">
      
      {/* 1. 报告核心来源：Battle 初始化目标卡 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-2xl p-4 text-white border border-slate-700 shadow-md relative overflow-hidden"
        id="battle-target-card"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-start gap-2.5 relative z-10">
          <div className="bg-amber-500 text-slate-900 p-1.5 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-current stroke-none" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-1.5 py-0.2 rounded uppercase">
                🚀 Battle 智能化解题工单 · 持续更新版
              </span>
              <span className="text-[9px] text-slate-400 font-mono">ID: AUT-902B</span>
            </div>
            <h1 className="text-sm font-bold text-white leading-snug mt-1">
              基于你在 AI 对比中所发起的 【问界 M7 vs 理想 L8】深度碰撞结论初始化
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              报告与<strong>车型库 Plus</strong> 深度绑定，全面审计两台车的首期差异、车友偏见及反证风险。
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-2 relative z-10">
          <button 
            onClick={() => showToast('正在进入 Model Y vs 极氪001 车型库Plus对比详情页...', 'info')}
            className="text-[10px] text-amber-400 underline hover:text-amber-300 transition-colors"
          >
            进入车型库Plus对比详情 ↗
          </button>
        </div>
      </motion.div>

      {/* 2. 用户档案升级版：决策权重滑块+双车匹配指数 */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4" id="portfolio-upgrade-card">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Sliders className="w-4 h-4 text-amber-600" />
            偏好画像与实时权重
          </span>
          <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">
            局部重排激活首选
          </span>
        </div>

        {/* Sliders layout */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">💴 落地和保值敏感度</span>
              <span className="font-bold font-mono text-slate-700">{weights.price}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.price}
              onChange={(e) => handleSliderChange('price', Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">🛋️ 后排豪华及轴距空间</span>
              <span className="font-bold font-mono text-slate-700">{weights.space}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.space}
              onChange={(e) => handleSliderChange('space', Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">⚡ 高速续航与800V架构</span>
              <span className="font-bold font-mono text-slate-700">{weights.power}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.power}
              onChange={(e) => handleSliderChange('power', Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">🤖 无图城区智驾领航</span>
              <span className="font-bold font-mono text-slate-700">{weights.intelligence}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.intelligence}
              onChange={(e) => handleSliderChange('intelligence', Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* 5th Slider: Risk Sensitivity */}
          <div className="space-y-1 col-span-2 pt-1 border-t border-slate-50">
            <div className="flex justify-between text-[11px]">
              <span className="text-amber-800 font-bold flex items-center gap-1">
                ⚠️ 避坑门槛以及缺点敏感度 (风险系数)
              </span>
              <span className="font-black font-mono text-amber-700">{weights.risk}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.risk}
              onChange={(e) => handleSliderChange('risk', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Dynamic score dashboard */}
        <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-amber-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-900">🧬 AI 自动匹配结果评估</span>
            <span className="text-[10px] text-slate-400 font-mono">SLIDER SOLUTION</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Model Y */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                  问界 M7 (SPU)
                  {cars.find(c => c.id === 'm7')?.keepStatus === 'exclude' && (
                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 rounded line-through scale-90">已排除</span>
                  )}
                  {cars.find(c => c.id === 'm7')?.keepStatus === 'weaken' && (
                    <span className="text-[9px] bg-slate-105 text-slate-500 font-bold px-1.5 rounded scale-90">已弱化</span>
                  )}
                </span>
                <span className="font-extrabold text-amber-700 font-mono">{modelYScore} 分</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${cars.find(c => c.id === 'm7')?.keepStatus === 'exclude' ? 'bg-red-200' : 'bg-slate-500'}`}
                  animate={{ width: `${modelYScore}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                />
              </div>
            </div>

            {/* Zeekr 001 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                  理想 L8 (SPU)
                  {cars.find(c => c.id === 'l8')?.keepStatus === 'exclude' && (
                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 rounded line-through scale-90">已排除</span>
                  )}
                  {cars.find(c => c.id === 'l8')?.keepStatus === 'weaken' && (
                    <span className="text-[9px] bg-slate-105 text-slate-500 font-bold px-1.5 rounded scale-90">已弱化</span>
                  )}
                </span>
                <span className="font-extrabold text-amber-700 font-mono">{zeekrScore} 分</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${cars.find(c => c.id === 'l8')?.keepStatus === 'exclude' ? 'bg-red-200' : 'bg-amber-500'}`}
                  animate={{ width: `${zeekrScore}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                />
              </div>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-600 bg-white p-1.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
            🚩 推荐分析：{suitabilityReason}
          </p>
        </div>
      </div>

      {/* 2.5 候选车型决策台 */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
            候选保留、弱化与排除决策台
          </span>
          <span className="text-[9px] text-slate-400 font-medium bg-slate-50 px-1.5 rounded border border-slate-100">
            重置推荐状态
          </span>
        </div>

        <div className="space-y-2">
          {cars.map((car) => {
            const isKeeper = car.keepStatus === 'keep';
            const isWeakened = car.keepStatus === 'weaken';
            const isExcluded = car.keepStatus === 'exclude';
            
            return (
              <div 
                key={car.id} 
                className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                  isKeeper 
                    ? 'bg-amber-50/30 border-amber-200 shadow-2xs' 
                    : isWeakened 
                      ? 'bg-slate-50 border-slate-100 text-slate-500' 
                      : 'bg-red-50/10 border-red-100 opacity-60 text-slate-400'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <span className={isExcluded ? "line-through text-slate-400" : ""}>{car.name}</span>
                    {isKeeper && (
                      <span className="text-[8px] bg-amber-500 text-white font-black px-1 py-0.2 rounded scale-90">
                        保留候选
                      </span>
                    )}
                    {isWeakened && (
                      <span className="text-[8.5px] bg-slate-200 text-slate-600 font-medium px-1 py-0.2 rounded scale-90">
                        弱化考量
                      </span>
                    )}
                    {isExcluded && (
                      <span className="text-[8.5px] bg-red-100 text-red-700 font-medium px-1 py-0.2 rounded scale-90">
                        主动排除
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-450">
                    配置对齐：{car.trimName} (约{car.priceRange})
                  </p>
                </div>

                {/* Status action togglers */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleStatusChange(car.id, 'keep')}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${
                      isKeeper 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs font-black' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    保留
                  </button>
                  <button 
                    onClick={() => handleStatusChange(car.id, 'weaken')}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${
                      isWeakened 
                        ? 'bg-slate-650 border-slate-650 text-white font-black' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    弱化
                  </button>
                  <button 
                    onClick={() => handleStatusChange(car.id, 'exclude')}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${
                      isExcluded 
                        ? 'bg-red-500 border-red-500 text-white font-black' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    排除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 决策证据卡升级版 (行为/车型库plus数据/口碑/切片/风险) */}
      <div className="space-y-1.5" id="evidence-scroller-upgrade">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-slate-600" />
            车型库 Plus 结构多维证据
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleAllEvidences}
              className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors"
            >
              展开/收起全部
            </button>
            <button 
              onClick={() => setShowDbOverlay(true)}
              className="text-[11px] font-bold text-amber-700 flex items-center gap-0.5"
            >
              📊 基础配置 ↗
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {STAGE_2_EVIDENCES.map((evidence) => {
            const isExpanded = !!expandedEvidences[evidence.id];
            return (
              <div 
                key={evidence.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden"
              >
                {/* Header click triggers expand */}
                <div 
                  onClick={() => toggleEvidence(evidence.id)}
                  className="p-3 flex items-start justify-between gap-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400">
                        {evidence.id === 'se5' ? '⚠️ 避坑专项' : `维度差异 ${evidence.id.toUpperCase()}`}
                      </span>
                      <span className={`text-[9.5px] font-bold px-1.5 rounded border ${
                        evidence.type === 'risk' 
                          ? 'bg-red-50 text-red-700 border-red-100' 
                          : 'bg-[#FAF4EC] text-amber-800 border-[#F5EADF]'
                      }`}>
                        {evidence.sourceName}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 leading-snug">
                      {evidence.question}
                    </h3>
                  </div>
                  <div className="text-slate-400 self-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                    >
                      <div className="p-3 text-[11px] space-y-2 text-slate-600 leading-relaxed">
                        <div className="bg-amber-500/5 text-slate-900 font-bold p-2.5 rounded-xl border-l-2 border-amber-500">
                          🎯 BATTLE 判定结论：{evidence.conclusion}
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {evidence.evidenceList.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                              <p className={item.highlight ? 'text-indigo-900 font-semibold' : ''}>
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Audit / user acceptance feedback */}
                        <div className="pt-2 border-t border-slate-100/50 flex justify-between items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-slate-400">这部分研判信息是否符合您的实际？</span>
                          <div className="flex gap-1.5 flex-wrap justify-end">
                            <button 
                              onClick={() => showToast('已吸收此项客观比对作为决策基础', 'success')}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold hover:bg-slate-50 hover:text-amber-700"
                            >
                              非常客观 👍
                            </button>
                            <button 
                              onClick={() => showToast('正在跳转至汽车之家官方参数配置页，数据与车型库完全一致...', 'info')}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold hover:bg-slate-50"
                            >
                              查看参数配置页 ↗
                            </button>
                            <button 
                              onClick={() => {
                                showToast('已自动载入详细数据源核实，反馈至车辆智能体纠偏。', 'info');
                                setShowDbOverlay(true);
                              }}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold hover:bg-slate-50"
                            >
                              有出入/回源车型库
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 反证与风险：不适合用户的条件安全卡（新增） */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3" id="risk-audit-card">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
          反证与避坑审计：谁绝对不能买？
        </h2>
        <p className="text-[11px] text-slate-500">
          为了确保您的决策客观，系统不仅给优势，而且深挖每台车最可能劝退您购买的原因（不适合条件）：
        </p>

        <div className="space-y-3 pt-1">
          {/* Car A: AITO M7 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-1.5">
              <span className="text-xs font-bold text-slate-800">1. 问界 M7 劝退缺点</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 px-1.5 rounded uppercase font-bold">
                  3200+ 人吐槽
                </span>
                <button 
                  onClick={() => showToast('正在进入口碑争议详情页，包含完整差评分布与风险证据...', 'info')}
                  className="text-[9px] bg-white text-slate-500 border border-slate-200 px-1.5 rounded font-medium hover:bg-slate-50"
                >
                  查看争议证据详情 ↗
                </button>
              </div>
            </div>
            
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed font-medium">
              <li>避震极度生硬像卡丁车，如果您经常走颠簸的水泥渣子路，后座家属可能晕车抛售；</li>
              <li>车内完全无实体仪表盘、无隔音遮阳帘，高速胎噪实测噪音偏大。</li>
            </ul>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 flex-wrap gap-2">
              <span className="text-[10.5px] text-amber-800 font-medium">您的接受度：</span>
              <div className="flex items-center gap-2 flex-wrap flex-grow justify-between">
                <div className="flex gap-1">
                  {(['很在意', '能接受', '此项不适用'] as const).map((t) => (
                    <button 
                      key={t}
                      onClick={() => handleRiskFeedback('m7', 0, t)}
                      className={`text-[9.5px] px-1.5 py-0.5 border rounded-full ${
                        riskAFeedback[0] === t 
                          ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => showToast('正在进入汽车之家口碑评价列表页，可查看真实车主评价分布...', 'info')}
                  className="text-[10px] text-slate-500 underline ml-auto font-medium hover:text-slate-700"
                >
                  查看全部口碑评价 ↗
                </button>
              </div>
            </div>
          </div>

          {/* Car B: Li L8 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-1.5">
              <span className="text-xs font-bold text-slate-800">2. 理想 L8 劝退缺点</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 px-1.5 rounded uppercase font-bold">
                  宽体特种兵
                </span>
                <button 
                  onClick={() => showToast('正在进入口碑争议详情页，包含完整差评分布与风险证据...', 'info')}
                  className="text-[9px] bg-white text-slate-500 border border-slate-200 px-1.5 rounded font-medium hover:bg-slate-50"
                >
                  查看争议证据详情 ↗
                </button>
              </div>
            </div>

            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed font-medium">
              <li>车身宽度达 1999mm，极其逼近二米宽，如果您的小区多为路边狭小划线，或者经常去极其老旧的多层立体商场，泊车刮蹭风险极高；</li>
              <li>车重达2.3吨底盘扎实，但百公里冬季纯电电耗控制一般。</li>
            </ul>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 flex-wrap gap-2">
              <span className="text-[10.5px] text-amber-800 font-medium">您的接受度：</span>
              <div className="flex items-center gap-2 flex-wrap flex-grow justify-between">
                <div className="flex gap-1">
                  {(['很在意', '能接受', '此项不适用'] as const).map((t) => (
                    <button 
                      key={t}
                      onClick={() => handleRiskFeedback('l8', 0, t)}
                      className={`text-[9.5px] px-1.5 py-0.5 border rounded-full ${
                        riskBFeedback[0] === t 
                          ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => showToast('正在进入汽车之家口碑评价列表页，可查看真实车主评价分布...', 'info')}
                  className="text-[10px] text-slate-500 underline ml-auto font-medium hover:text-slate-700"
                >
                  查看全部口碑评价 ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 车型版本确认卡 SKU 级推进（新：一键切换高销量/同价位/顶配） */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3" id="version-configuration-card">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-600" />
            推进到 SKU：推荐版本选择
          </span>
          <span className="text-[10px] text-slate-400 font-mono">SPU → SKU LEVEL</span>
        </div>

        {/* Dynamic SPU vs SKU Toggle controls */}
        <div className="bg-slate-100 p-1 rounded-xl flex">
          {[
            { id: 'high-sales', label: '🔥 高销量版本' },
            { id: 'same-price', label: '⚖️ 同价位版本PK' },
            { id: 'top-spec', label: '👑 顶配对顶配' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setSkuCompareTab(tab.id as any);
                showToast(`已为您切换版本比对口径为：${tab.label.split(' ')[1]}`, 'success');
              }}
              className={`flex-1 text-center text-[11px] py-1.5 rounded-lg transition-all ${
                skuCompareTab === tab.id 
                  ? 'bg-white text-slate-900 font-bold shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 font-semibold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {skuCompareTab === 'high-sales' && (
          <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100/60 leading-relaxed font-medium">
            💡 <strong>热销口碑对齐规则</strong>：对比双方在汽车之家热度排行前 15% 的王牌配置，更契合公认性价比及真实转卖残值，避开小众冷门配置。
          </p>
        )}
        {skuCompareTab === 'same-price' && (
          <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100/60 leading-relaxed font-medium">
            💡 <strong>同价对位对齐规则</strong>：对比双方在 25万~33万 核心落地价格带的配置实力，单纯进行硬核技术与高频使用场景大Battle。
          </p>
        )}
        {skuCompareTab === 'top-spec' && (
          <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100/60 leading-relaxed font-medium">
            💡 <strong>旗舰大满配对齐规则</strong>：对比问界 M7 Ultra 六座四驱智驾版（32.98万）与理想 L8 Ultra 增程版（35.98万）的配置顶配大满配，评估高阶智驾、智能魔毯空气悬盘和空间舒适天花板。
          </p>
        )}

        {/* Recommended SKU Cards layout */}
        <div className="space-y-2.5 pt-1">
          {/* Model Y recommended Sku */}
          {activeModelYSku && (
            <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-slate-400">问界 M7 对应版本建议</span>
                <span className="text-[11px] font-bold text-slate-800">{activeModelYSku.priceText}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-0.5">{activeModelYSku.title}</h4>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-normal font-medium">
                🎯 {activeModelYSku.recomReason}
              </p>
              <div className="mt-1.5 bg-white p-1 px-2 rounded border border-slate-100 text-[10px] text-indigo-900 font-mono">
                硬件配置：{activeModelYSku.keyFeatureDiff}
              </div>
              <button 
                onClick={() => showToast('正在进入车型版本对比模块，可横向对比所有在售配置差异...', 'info')}
                className="text-[10px] text-amber-700 underline block text-right mt-1 ml-auto hover:text-amber-600 transition-colors"
              >
                进入版本对比模块 ↗
              </button>
            </div>
          )}

          {/* Zeekr 001 recommended Sku */}
          {activeZeekrSku && (
            <div className="border border-amber-100 rounded-xl p-2.5 bg-amber-50/20">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-amber-700">理想 L8 对应版本建议</span>
                <span className="text-[11px] font-bold text-amber-800">{activeZeekrSku.priceText}</span>
              </div>
              <h4 className="text-xs font-bold text-amber-900 mt-0.5">{activeZeekrSku.title}</h4>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-normal font-medium">
                🎯 {activeZeekrSku.recomReason}
              </p>
              <div className="mt-1.5 bg-white p-1 px-2 rounded border border-amber-100 text-[10px] text-amber-900 font-mono">
                特色差异：{activeZeekrSku.keyFeatureDiff}
              </div>
              <button 
                onClick={() => showToast('正在进入车型版本对比模块，可横向对比所有在售配置差异...', 'info')}
                className="text-[10px] text-amber-700 underline block text-right mt-1 ml-auto hover:text-amber-600 transition-colors"
              >
                进入版本对比模块 ↗
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. 完整反馈纠偏模块 (否定型、偏好型、约束型、排斥型输入) */}
      <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-amber-200 shadow-xs space-y-3" id="feedback-mechanism-card">
        <div>
          <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide block">
            🛎️ 深度反馈驱动与持续状态机更新
          </span>
          <h3 className="text-xs font-bold text-slate-800 mt-0.5">
            录入买车偏好变更，动态调整此报告工单
          </h3>
        </div>

        {/* Existing feedback actions log */}
        <div className="space-y-1.5">
          <span className="text-[10.5px] font-semibold text-slate-700 block">偏好回写历史：</span>
          <div className="space-y-1">
            {feedbackHistory.map((item, idx) => (
              <div key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 text-[10px] text-slate-600 font-mono flex items-center justify-between">
                <span>{item}</span>
                <span className="text-[8px] bg-slate-100 text-slate-400 px-1 rounded">已应用更新</span>
              </div>
            ))}
          </div>
        </div>

        {/* Choice of feedback buttons */}
        <div className="space-y-2">
          <textarea 
            rows={2}
            placeholder="例如：“我不考虑后驱版车款”（排斥型），或 “落地预算控制在28万以内”（约束型），或 “由于小孩大，座椅横向宽度最核心”（偏好型）"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="w-full text-xs p-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-400 text-slate-700"
            id="battle-feedback-input"
          />

          <div className="grid grid-cols-4 gap-1">
            <button 
              onClick={() => submitFeedback('偏好')}
              className="py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold text-center active:opacity-90 active:scale-95 transition"
            >
              偏好型录入
            </button>
            <button 
              onClick={() => submitFeedback('约束')}
              className="py-1 bg-slate-800 text-white rounded-lg text-[10px] font-bold text-center active:opacity-90 active:scale-95 transition"
            >
              约束型限定
            </button>
            <button 
              onClick={() => submitFeedback('排斥')}
              className="py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold text-center active:opacity-90 active:scale-95 transition"
            >
              排斥型：排除此车
            </button>
            <button 
              onClick={() => submitFeedback('否定')}
              className="py-1 bg-slate-250 text-slate-700 border hover:bg-slate-100 rounded-lg text-[10px] font-bold text-center active:opacity-90 active:scale-95 transition"
            >
              挑战此结论
            </button>
          </div>
        </div>
      </div>

      {/* 7. 第二阶段升级下一步行动台 */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 space-y-2" id="stage-two-actions">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider text-center block">
          🛒 SPU/SKU 留资与试驾高意向通道
        </span>

        <div className="grid grid-cols-3 gap-1.5">
          <button 
            onClick={() => {
              setTargetCar('l8');
              setActiveDrawer('落地价');
              showToast('抓取理想L8最新首发落地减免补贴...', 'info');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-amber-50/50 hover:bg-amber-50 border border-amber-200 text-amber-900 rounded-xl active:scale-95 transition"
          >
            <span className="font-bold text-xs">算提车落地</span>
            <span className="text-[9px] text-amber-700">含政企双补</span>
          </button>

          <button 
            onClick={() => {
              setTargetCar('l8');
              setActiveDrawer('询价');
              showToast('正在对接上海同城4家理想零售中心经销商询底价...', 'info');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-[#FAF9F5] border border-slate-200 text-slate-800 rounded-xl active:scale-95 transition"
          >
            <span className="font-bold text-xs">询底价/暗补</span>
            <span className="text-[9px] text-slate-500">2小时极速回</span>
          </button>

          <button 
            onClick={() => {
              setTargetCar('l8');
              setActiveDrawer('试驾');
              showToast('正在匹配上门高架NOA智驾测试资质司机...', 'info');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-slate-800 text-white rounded-xl active:scale-95 transition"
          >
            <span className="font-bold text-xs">预约送车试驾</span>
            <span className="text-[9px] text-slate-300">体验极限泊车</span>
          </button>
        </div>

        <button 
          onClick={() => {
            setActiveDrawer('智能体');
            showToast('已将选车状态转交买车助手，准备帮您底价暗战微信谈...', 'success');
          }}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-xl text-xs font-bold text-center"
        >
          🤝 交给买车代言人极谈底价
        </button>

        <button 
          onClick={() => {
            setActiveDrawer('工单保存中');
            showToast('正在提取报告纠便系数，集成车型库Plus离线加密工单中...', 'info');
          }}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center border border-slate-200 transition-colors"
          id="save-continuous-docket"
        >
          📁 保存为此对比持续升级工单容器
        </button>

        <div className="pt-1.5 border-t border-slate-100/50 flex flex-col gap-1 items-center">
          <span className="text-[10px] text-slate-400 font-semibold">保存后可选：</span>
          <button 
            onClick={() => {
              setShowRedBookDraft(true);
              showToast('小红书选车草稿笔记文案已由 AI 模型渲染完成！', 'success');
            }}
            className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-500 rounded-xl text-[10px] font-bold text-center transition-colors"
          >
            📕 生成小红书选车草稿笔记
          </button>
        </div>
      </div>

      {/* OVERLAY S1: DETAILED VEHICLE DB COMPARISON OVERLAY */}
      <AnimatePresence>
        {showDbOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[120] p-3 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-h-[90%] p-4 overflow-y-auto space-y-4"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs bg-amber-500 text-slate-900 px-2 py-0.5 rounded font-bold uppercase">
                  Autohome Database plus (可信)
                </span>
                <button 
                  onClick={() => setShowDbOverlay(false)}
                  className="text-xs font-mono font-bold bg-slate-100 p-1 px-2.5 rounded-full hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-800">官方车型参数并集核实事实</h3>
                <p className="text-[10px] text-slate-400">所有数值深度拉取自汽车之家官方API，不写套色营销话术：</p>
              </div>

              {/* Dynamic Categories selection tab */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'price', label: '落地与折弯' },
                  { id: 'space', label: '车长轴距空间' },
                  { id: 'power', label: '补能与平台' },
                  { id: 'intelligence', label: '智驾與算力' },
                  { id: 'risk', label: '质保与雷区' }
                ].map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setActiveParamTab(p.id as any)}
                    className={`text-[10px] px-2 py-1 rounded-md border ${
                      activeParamTab === p.id 
                        ? 'bg-slate-800 border-slate-900 text-white font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Dynamic database list */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 border-b">
                      <th className="p-2 font-semibold">参数项目</th>
                      <th className="p-2 font-semibold text-slate-700">问界 M7</th>
                      <th className="p-2 font-semibold text-slate-700">理想 L8</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeParamsFiltered.map((p, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50/50">
                        <td className="p-2 text-slate-500 font-medium">{p.parameterName}</td>
                        <td className="p-2 font-bold font-mono text-slate-800">{p.modelAValue}</td>
                        <td className="p-2 font-bold font-mono text-slate-800">{p.modelBValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Difference callouts */}
              <div className="bg-amber-500/5 p-2 rounded-xl border border-amber-100 text-[10px] text-amber-900 font-mono">
                💡 两车主要差异：{activeParamsFiltered[0]?.differenceText || '无重大硬缺项'}
              </div>

              <button 
                onClick={() => setShowDbOverlay(false)}
                className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-xl active:bg-slate-900"
              >
                确定并返回报告
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY S2: RED BOOK BLOG POST DRAFT BOX */}
      <AnimatePresence>
        {showRedBookDraft && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[120] p-4 flex items-end"
          >
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-white rounded-t-[32px] w-full p-5 max-h-[85%] overflow-y-auto space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowRedBookDraft(false)}
                className="absolute top-4 right-4 text-xs font-bold bg-slate-100 text-slate-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>

              <div className="text-center pb-2 border-b border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-500">RED BOOK GENERATOR</span>
                <h3 className="text-sm font-bold text-slate-900">小红书极速生成笔记草稿箱</h3>
                <p className="text-[10px] text-slate-500">已提取客观参配和高拟合偏见，助您在小红书提问集美们：</p>
              </div>

              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-amber-100 space-y-2 text-xs">
                <div className="flex gap-2 items-center">
                  <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">标题建议：</span>
                  <p className="font-bold text-slate-850">纠结了3个月！问界 M7 vs 理想 L8，奶爸奶妈选大SUV真实避坑实测...</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-serif leading-relaxed h-44 overflow-y-auto space-y-1">
                  <p>亲们！！帮帮我这个纠结怪吧！</p>
                  <p>今年想给全家人换辆舒适的中大型SUV。最近专门对比了配置：希望第二排老人孩子坐着舒服、隔音要好，能让小宝宝踏实午睡。高架NOA智驾要靠谱些，目前在这两台爆款里二选一：</p>
                  <p>1️⃣ 【问界 M7】鸿蒙智行全家桶太棒了，智能驾驶体验确实遥遥领先、起步门槛也给力（Pro版24.98万起就很好用）。但是五座版纵向第二排腿部空间相比隔壁的大六座，极限奢侈感还是有一点差距的。</p>
                  <p>2️⃣ 【理想 L8】全车冰箱彩电大沙发标配，后排还带顶棚大屏幕，高级感直接拉满，奶爸和宝宝都顶不住这个诱惑！但如果要升级高阶智驾（Max版）预算得多加两三万，而且增程发动机的高速馈电油耗有点让人纠结😭。</p>
                  <p>姐妹们奶爸们救救孩子，到底买不合适的一台？求真实车主指路！避雷！</p>
                  <p>#选车纠结 #问界M7 #理想L8 #家庭SUV #大六座SUV #奶爸买车</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    showToast('文案已复制到剪切板，可以粘贴到小红书了！', 'success');
                    setShowRedBookDraft(false);
                  }}
                  className="flex-1 py-2.5 bg-rose-500 text-white font-bold rounded-xl text-xs active:bg-rose-600 text-center"
                >
                  复制笔记正文到剪贴板
                </button>
                <button 
                  onClick={() => setShowRedBookDraft(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs text-center active:bg-slate-200"
                >
                  返回选车工单
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWER FOR CLOSING ACTIONS (Inquire, local discount, test drive booking) */}
      <AnimatePresence>
        {activeDrawer !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[100] p-4 flex items-end animate-fade-in"
          >
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-white rounded-t-[32px] rounded-b-[16px] w-full p-5 max-h-[85%] overflow-y-auto space-y-4"
            >
              {activeDrawer !== '工单保存中' && (
                <button 
                  onClick={() => setActiveDrawer('none')}
                  className="absolute top-4 right-4 text-xs font-bold bg-slate-100 text-slate-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              )}

              {activeDrawer === '工单保存中' ? (
                <div className="space-y-4">
                  {!isSavingComplete ? (
                    <div className="py-6 px-4 flex flex-col items-center justify-center text-center space-y-4">
                      {/* Loading spinner with elegant amber circle */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-14 h-14 border-4 border-amber-100 rounded-full animate-spin border-t-amber-500"></div>
                        <span className="absolute text-xs font-black font-mono text-amber-700">{saveProgress}%</span>
                      </div>
                      
                      <div className="space-y-1 max-w-xs">
                        <h4 className="text-xs font-bold text-slate-800 animate-pulse">正在精简备份当前分析快照...</h4>
                        <p className="text-[10px] text-slate-500 font-medium h-10 flex items-center justify-center">
                          {saveStep}
                        </p>
                      </div>

                      {/* Visual Progress Line */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-505 h-full transition-all duration-300 bg-amber-550"
                          style={{ width: `${saveProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-850">✅ 持续选车服务容器封锁成功</h3>
                        <p className="text-[11px] text-slate-500">已形成专属自适应升级容器包，永久可查</p>
                      </div>

                      {/* Poster Mockup of Save Container */}
                      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 p-4 rounded-2xl text-white space-y-3 shadow-md border border-indigo-750">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest bg-indigo-500 text-white px-1.5 py-0.2 rounded font-bold">
                              Autohome Active Docket
                            </span>
                            <h4 className="text-xs font-black mt-1">
                              持续双车升级对比名片 #DK-029B
                            </h4>
                          </div>
                          <span className="text-[10px] text-indigo-300 font-mono">ID: SEC-803</span>
                        </div>

                        <div className="bg-white/10 p-2.5 rounded-xl space-y-1 backdrop-blur-xs text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-300">对比核心：</span>
                            <span className="font-semibold text-amber-300">问界 M7 (保留) vs 理想 L8 ({cars.find(c => c.id === 'l8')?.keepStatus === 'keep' ? '保留' : '弱化边缘'})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">焦点考量：</span>
                            <span className="font-semibold text-slate-200">
                              后排空间 {weights.space}% | 缺点敏感 {weights.risk}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">AI自适应推荐：</span>
                            <span className="text-indigo-200 font-bold">
                              {zeekrScore > modelYScore ? '理想 L8 Pro 增程版' : '问界 M7 Pro 五座后驱版'} ({Math.max(zeekrScore, modelYScore)}分)
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 text-[9px] border-t border-white/10">
                          <div>
                            <span className="block text-slate-400">已并回汽车之家偏好引擎库：</span>
                            <span className="font-semibold font-mono text-indigo-200">#928-DK-VOL2</span>
                          </div>
                          <div className="text-right">
                            <span className="inline-block p-1 bg-white rounded">
                              <span className="block w-6 h-6 border border-slate-300 flex items-center justify-center font-bold text-[8px] text-emerald-700 scale-90 animate-pulse">
                                PASS
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveDrawer('none')}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-950 transition text-white font-bold rounded-xl text-xs text-center"
                        >
                          收回并同步至分析首页
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-center pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">
                      {activeDrawer === '落地价' ? '极速落地点单计算' : activeDrawer === '询价' ? '深度询问底价及暗补' : activeDrawer === '试驾' ? '预约送车尊贵上门试驾' : '转交买车智能体'}
                    </h3>
                    <p className="text-[11px] text-slate-500">已匹配上海市自营经销商最新金融贴息及折算免税额度</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">选定版本意向：</label>
                      <select className="w-full p-2 bg-slate-50 border rounded-xl font-medium">
                        <option value="l8">理想 L8 Pro 增程版 (32.18万起) - 空间舒适强烈推荐款</option>
                        <option value="m7">问界 M7 Pro 五座后驱版 (24.98万起) - 智能辅助高性价比款</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">联系手机号码（免费秒回密匙）：</label>
                      <input 
                        type="tel" 
                        placeholder="请输入您的手机号，以便核实暗补资质" 
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>

                    {activeDrawer === '智能体' ? (
                      <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-150 text-[11px] text-indigo-900 leading-normal font-mono">
                        🤖 智能体工作：此服务将把您当前的权重、偏好历史、在意避坑点直接生成一条密文工单。本地多方谈价主智能体会帮您在微信直接暗中谈底价，绝不公开暴露号码导致骚扰骚扰，底价出来后再邀您微信对话审核。
                      </div>
                    ) : (
                      <div className="p-2.5 bg-[#FAF9F5] rounded-xl border border-amber-100 text-[11px] text-slate-600 leading-normal font-medium">
                        ✓ 我们承约：一经提交，2小时内反馈折成详细报价书。绝不对外散布虚假短信或电话，终身免骚扰。
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if (!userPhone) return showToast('请输入手机号匹配优惠', 'warning');
                        showToast('申请极速提写成功！专属顾问2小时内为您反馈比价详情。', 'success');
                        setActiveDrawer('none');
                      }}
                      className="w-full py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl active:bg-slate-900"
                    >
                      极速提交申请
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
