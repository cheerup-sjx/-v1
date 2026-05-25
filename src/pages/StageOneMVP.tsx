/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Calendar, 
  FileText, 
  Check, 
  AlertCircle, 
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STAGE_1_CARS, STAGE_1_DECISION_CHAIN, STAGE_2_PARAMS } from '../data/mockData';
import { CarInfo, DecisionChainStep, ParameterRow } from '../types';

interface StageOneProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function StageOneMVP({ showToast }: StageOneProps) {
  // Local state for candidates & their current status
  const [cars, setCars] = useState<CarInfo[]>(STAGE_1_CARS);
  
  // Local state for feedback interaction
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Decision chain step card expansion states
  const [expandedDimensions, setExpandedDimensions] = useState<Record<string, boolean>>({
    's1_1': true, // default first one expanded
  });

  // Flow Modals
  const [activeModal, setActiveModal] = useState<'none' | '落地价' | '预约试驾' | '保存报告'>('none');
  const [testDriveSelectedCar, setTestDriveSelectedCar] = useState('l8');
  const [userPhone, setUserPhone] = useState('');
  const [userCity, setUserCity] = useState('上海市');

  // Background poster rendering states
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState('');
  const [isRenderComplete, setIsRenderComplete] = useState(false);
  const [showCorrectionTip, setShowCorrectionTip] = useState(false);
  const [showExtraCandidate, setShowExtraCandidate] = useState(false);
  const [showDbOverlay, setShowDbOverlay] = useState(false);
  const [activeParamTab, setActiveParamTab] = useState<'price' | 'space' | 'power' | 'intelligence' | 'risk'>('price');

  const activeParamsFiltered = STAGE_2_PARAMS.filter(p => p.category === activeParamTab);

  const FEEDBACK_OPTIONS = [
    '我更看重后排空间',
    '预算不能超过30万',
    '不考虑某个品牌',
    '想加一台车继续比',
    '我更在意智驾',
    '不接受纯电里程焦虑',
  ];

  const toggleDimension = (id: string) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllDimensions = () => {
    const relevantChain = STAGE_1_DECISION_CHAIN.filter(d => d.isRelevant === undefined || d.isRelevant);
    const allIds = relevantChain.map(d => d.id);
    const anyCollapsed = allIds.some(id => !expandedDimensions[id]);
    const newState: Record<string, boolean> = {};
    allIds.forEach(id => {
      newState[id] = anyCollapsed;
    });
    setExpandedDimensions(newState);
    showToast(anyCollapsed ? '已全部展开决策判断点' : '已全部收起决策判断点', 'info');
  };

  const toggleFeedback = (option: string) => {
    setSelectedFeedbacks(prev => 
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
    if (!selectedFeedbacks.includes(option)) {
      showToast('已根据你的反馈重新调整候选排序', 'success');
    }
  };

  // Background poster rendering effect
  React.useEffect(() => {
    if (activeModal === '保存报告') {
      setIsRenderComplete(false);
      setRenderProgress(0);
      setRenderStep('🔍 正在提取当前候选车型的比对细节与偏好要求...');
      
      const interval = setInterval(() => {
        setRenderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRenderComplete(true);
            setRenderStep('✅ 静态分享海报已生成！');
            showToast('海报已生成就绪，您可长按或点击保存。', 'success');
            return 100;
          }
          const next = prev + 10;
          if (next === 30) {
            setRenderStep('📊 正在拉取数据库车型多维比对参数...');
          } else if (next === 60) {
            setRenderStep('🎨 生成精美布局：采用“琥珀光感”极简视觉模板...');
          } else if (next === 90) {
            setRenderStep('🛡️ 正在注入安全口径验证与对应微信分享动态码...');
          }
          return next;
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [activeModal]);

  const handleStatusChange = (carId: string, newStatus: 'keep' | 'weaken' | 'exclude') => {
    setCars(prev => prev.map(car => {
      if (car.id === carId) {
        let role = car.decisionRole;
        if (newStatus === 'keep') role = '智驾首选';
        if (newStatus === 'weaken') role = '暂时搁置/对比观察';
        if (newStatus === 'exclude') role = '主动排除车款';
        return { ...car, keepStatus: newStatus, decisionRole: role };
      }
      return car;
    }));
    
    const carName = cars.find(c => c.id === carId)?.name || '';
    const statusLabels = { keep: '保留', weaken: '弱化', exclude: '排除' };
    showToast(`已将 ${carName.split(' ')[0]} 设为【${statusLabels[newStatus]}】状态`, 'info');
  };

  // Groups cars by their keep status for the status overview
  const keeps = cars.filter(c => c.keepStatus === 'keep');
  const weakens = cars.filter(c => c.keepStatus === 'weaken');
  const excludes = cars.filter(c => c.keepStatus === 'exclude');

  return (
    <div className="flex-1 flex flex-col p-3 gap-3.5 select-text" id="stage-one-mvp">
      
      {/* 1. 顶部微调导航栏下提示：首屏命中解释 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="ui-cot-block p-4 shadow-none"
        id="report-target-card"
      >
        <div className="flex items-start gap-2.5">
          <div className="bg-[#E9EFFC] p-1.5 rounded-lg text-[#0353E9] mt-0.5 border border-[#D1D8E6]/50">
            <Sparkles className="w-4 h-4 fill-[#0353E9]/20 stroke-[#0353E9]" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#0353E9] tracking-wider uppercase block mb-0.5">
              💡 你的选车报告已生成
            </span>
            <h1 className="text-sm font-bold text-[#111E36] leading-snug">
              你最近像是在比较30万级家庭新能源SUV，我们先帮你整理出这几台车该怎么取舍。重点关注 “智驾领航成本” 与 “二排独立舒适座椅”。
            </h1>
            
            <p className="text-xs text-[#667085] mt-2 leading-relaxed">
              <span className="font-semibold text-[#111E36]">报告锁定目标：</span>
              分析您在<strong> 问界M7、理想L8、腾势N8</strong> 之间的真实买点偏好与政策缺口，推进第一轮候选收缩。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. 用户状态与待确认项目台 */}
      <div className="ui-card-main p-4 space-y-3" id="user-status-card">
        <div className="bg-[#FFFDF5]/70 p-2.5 rounded-xl border-l-2 border-amber-400 mb-3 text-xs text-slate-700 leading-relaxed font-sans">
          你更像是在选一台30万级家庭新能源SUV：平时以家用为主，可能更关注后排舒适、智驾体验和落地价的稳定性。
        </div>

        <div className="flex justify-between items-center bg-[#F4F6F9] p-2.5 rounded-xl border border-[#D1D8E6]/50 gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-[#667085] block font-sans">你现在大概卡在这一步</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#0353E9] animate-pulse shrink-0"></span>
              <span className="text-xs font-bold text-[#111E36] leading-tight block truncate md:whitespace-normal">这几台车都能买，但还没确定谁最适合家用</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] text-[#98A2B3] block font-mono leading-none mb-1">CONFIDENCE</span>
            <span className="text-[10px] font-bold badge-green px-2 py-1 rounded-md whitespace-nowrap">
              92% 很高
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-[#111E36] block">🕵️‍♂️ 你现在主要还没确认这几件事：</span>
          <p className="text-xs text-[#B54708] bg-[#FFFAEB] p-2.5 rounded-lg border-l-[3px] border-[#B54708] leading-relaxed font-semibold">
            &ldquo;想买台30万左右带娃舒服的新能源车，又想要好阶智驾。多花几万去买理想L8，享受二排大沙发跟城区无图智驾到底值不值？还是简单点，直接买更省钱的问界M7，用基础智驾把这8万块钱省下来？&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="border border-[#D1D8E6] bg-[#FFFFFF] p-2.5 rounded-lg">
            <span className="text-xs font-bold text-[#111E36] block mb-1">🛒 还没想透的几点现实问题</span>
            <ul className="text-[11px] text-[#667085] space-y-1 list-disc pl-3 leading-snug font-sans">
              <li>不同版本的智驾差价格外多花几万值不值</li>
              <li>5.1米多的大车在自家车位和老小区好不好停</li>
              <li>装上安全座椅后，后排坐大人或者进出方不方便</li>
            </ul>
          </div>
          <div className="border border-[#D1D8E6] bg-[#FFFFFF] p-2.5 rounded-lg">
            <span className="text-xs font-bold text-[#111E36] block mb-1">📉 当前状态分布</span>
            <div className="space-y-1 mt-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#667085]">重点看:</span>
                <span className="font-bold text-[#039855] font-mono">{keeps.length}款</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">先放一边:</span>
                <span className="font-bold text-[#667085] font-mono">{weakens.length}款</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">暂不考虑:</span>
                <span className="font-bold text-[#D92D20] font-mono">{excludes.length}款</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 候选状态 / 候选收缩卡（核心保留、弱化、排除互动） */}
      <div className="space-y-1.5" id="candidate-shrink-card">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 px-1">
          <h2 className="text-xs font-bold text-[#111E36] flex items-center gap-1.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            这几台车，我建议你这样处理
          </h2>
          <span className="text-[10.5px] text-[#667085] font-normal font-sans">
            可以随时调整你对每台车的判断
          </span>
        </div>

        <div className="space-y-2">
          {cars.filter(car => car.id !== 'n8').map((car) => (
            <div 
              key={car.id} 
              className={`ui-card-main transition-all duration-300 shadow-none ${
                car.keepStatus === 'keep' 
                  ? 'border-l-[4px] border-l-[#039855] opacity-100' 
                  : car.keepStatus === 'weaken' 
                  ? 'border-l-[4px] border-l-[#98A2B3] opacity-80 scale-[0.98]' 
                  : 'border-l-[4px] border-l-[#D92D20] opacity-50 scale-[0.96] saturate-[0.2]'
               }`}
            >
              <div className="p-3">
                <div className="flex gap-2.5">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-16 h-12 object-cover rounded-lg bg-slate-100 border border-[#D1D8E6] shadow-none self-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#98A2B3] block">{car.brand}</span>
                        <h3 className="text-xs font-bold text-[#111E36] leading-tight font-sans">{car.name}</h3>
                      </div>
                      <span className="text-[11px] font-bold text-[#D92D20] font-mono">{car.guidePrice}</span>
                    </div>

                    <p className="text-[11px] text-[#667085] font-medium mt-1 leading-snug">
                      🎯 建议：
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        car.keepStatus === 'keep' ? 'badge-green border-none' : car.keepStatus === 'weaken' ? 'badge-gray border-none' : 'badge-red border-none'
                      }`}>
                        {car.decisionRole}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Keep reasons / Avoid conditions depending on status */}
                <div className={`mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed ${
                  car.keepStatus !== 'exclude' ? 'bg-[#ECFDF3]/50 text-[#039855] border-l-[3px] border-l-[#039855]' : 'bg-[#FEF3F2]/60 text-[#D92D20] border-l-[3px] border-l-[#D92D20]'
                }`}>
                  {car.keepStatus !== 'exclude' ? (
                    <p>
                      <span className="font-semibold text-[10px] text-[#039855] block mb-0.5">推荐理由：</span>
                      <span className="text-[#111E36]">{car.keepReason}</span>
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold text-[10px] text-[#D92D20] block mb-0.5">避坑提醒：</span>
                      <span className="text-[#111E36]">{car.riskWarning}</span>
                    </p>
                  )}
                </div>

                {/* Row of interactive action togglers */}
                <div className="mt-2.5 pt-2 border-t border-[#D1D8E6]/40 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] text-[#98A2B3]">修改选择:</span>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleStatusChange(car.id, 'keep')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                        car.keepStatus === 'keep' 
                          ? 'badge-green font-bold border-[#039855]' 
                          : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                      }`}
                    >
                      重点看这台
                    </button>
                    <button 
                      onClick={() => handleStatusChange(car.id, 'weaken')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                        car.keepStatus === 'weaken' 
                          ? 'badge-gray font-bold text-[#667085] border-slate-400' 
                          : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                      }`}
                    >
                      先放一边
                    </button>
                    <button 
                      onClick={() => handleStatusChange(car.id, 'exclude')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                        car.keepStatus === 'exclude' 
                          ? 'badge-red font-bold border-[#D92D20]' 
                          : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                      }`}
                    >
                      暂不考虑
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* 折叠区域标题 */}
          <div 
            onClick={() => setShowExtraCandidate(!showExtraCandidate)}
            className="text-[11px] text-slate-500 text-center py-2 border-t border-slate-100 cursor-pointer flex items-center justify-center gap-1 hover:text-[#0353E9] transition-colors font-sans"
            id="fold-trigger-segment"
          >
            <span>还有其他候选车？{showExtraCandidate ? '点击收起' : '点击展开'}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showExtraCandidate ? 'rotate-180' : ''}`} />
          </div>

          {/* 展开后显示的腾势 N8 卡片 */}
          <AnimatePresence>
            {showExtraCandidate && (
              <motion.div
                key="extra-candidate-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {cars.filter(car => car.id === 'n8').map((car) => (
                  <div 
                    key={car.id} 
                    className={`ui-card-main transition-all duration-300 shadow-none opacity-70 border border-[#D1D8E6] rounded-2xl ${
                      car.keepStatus === 'keep' 
                        ? 'border-l-[4px] border-l-[#039855]' 
                        : car.keepStatus === 'weaken' 
                        ? 'border-l-[4px] border-l-[#98A2B3] scale-[0.98]' 
                        : 'border-l-[4px] border-l-[#D92D20] scale-[0.96] saturate-[0.2]'
                     }`}
                  >
                    <div className="p-3">
                      <div className="flex gap-2.5">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-16 h-12 object-cover rounded-lg bg-slate-100 border border-[#D1D8E6] shadow-none self-center"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-[#98A2B3] block">{car.brand}</span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-xs font-bold text-[#111E36] leading-tight font-sans">{car.name}</h3>
                                <span className="bg-slate-100 text-[#667085] text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0">
                                  备选
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[#D92D20] font-mono">{car.guidePrice}</span>
                          </div>

                          <p className="text-[11px] text-[#667085] font-medium mt-1 leading-snug">
                            🎯 建议：
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              car.keepStatus === 'keep' ? 'badge-green border-none' : car.keepStatus === 'weaken' ? 'badge-gray border-none' : 'badge-red border-none'
                            }`}>
                              {car.decisionRole}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Keep reasons / Avoid conditions depending on status */}
                      <div className={`mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed ${
                        car.keepStatus !== 'exclude' ? 'bg-[#ECFDF3]/50 text-[#039855] border-l-[3px] border-l-[#039855]' : 'bg-[#FEF3F2]/60 text-[#D92D20] border-l-[3px] border-l-[#D92D20]'
                      }`}>
                        {car.keepStatus !== 'exclude' ? (
                          <p>
                            <span className="font-semibold text-[10px] text-[#039855] block mb-0.5">推荐理由：</span>
                            <span className="text-[#111E36]">{car.keepReason}</span>
                          </p>
                        ) : (
                          <p>
                            <span className="font-semibold text-[10px] text-[#D92D20] block mb-0.5">避坑提醒：</span>
                            <span className="text-[#111E36]">{car.riskWarning}</span>
                          </p>
                        )}
                      </div>

                      {/* Row of interactive action togglers */}
                      <div className="mt-2.5 pt-2 border-t border-[#D1D8E6]/40 flex items-center justify-between gap-1.5">
                        <span className="text-[10px] text-[#98A2B3]">修改选择:</span>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleStatusChange(car.id, 'keep')}
                            className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                              car.keepStatus === 'keep' 
                                ? 'badge-green font-bold border-[#039855]' 
                                : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                            }`}
                          >
                            重点看这台
                          </button>
                          <button 
                            onClick={() => handleStatusChange(car.id, 'weaken')}
                            className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                              car.keepStatus === 'weaken' 
                                ? 'badge-gray font-bold text-[#667085] border-slate-400' 
                                : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                            }`}
                          >
                            先放一边
                          </button>
                          <button 
                            onClick={() => handleStatusChange(car.id, 'exclude')}
                            className={`text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-full border transition-all ${
                              car.keepStatus === 'exclude' 
                                ? 'badge-red font-bold border-[#D92D20]' 
                                : 'bg-white hover:bg-slate-50 text-[#667085] border-[#D1D8E6]'
                            }`}
                          >
                            暂不考虑
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. 决策证据卡 MVP （展示3个关键证据，高度紧凑） */}
      <div className="space-y-1.5" id="decision-evidence-scroller">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-1">
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans leading-none">
              <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              基于你的需求，先拆成这几个判断点
            </h2>
            <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">
              你现在像是在选一台 30 万级家庭新能源 SUV，所以不用先看全量参数，先看这几件事就能缩小范围。
            </p>
          </div>
          <button 
            type="button"
            onClick={toggleAllDimensions}
            className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors font-sans whitespace-nowrap shrink-0 self-start mt-0.5 animate-pulse"
          >
            展开/收起全部
          </button>
        </div>

        <div className="space-y-2.5 mt-2">
          {STAGE_1_DECISION_CHAIN.map((step, idx) => {
            const isExpanded = !!expandedDimensions[step.id];
            return (
              <div 
                key={step.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden mb-2"
              >
                {/* Header of step */}
                <div 
                  onClick={() => toggleDimension(step.id)}
                  className="p-3 flex items-start justify-between gap-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-sans whitespace-nowrap">
                        判断点 {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#111E36] font-sans">
                        {step.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {step.dimensions.map((dimName) => (
                        <span key={dimName} className="text-[9px] text-[#667085] bg-slate-100 px-1.5 py-0.5 rounded font-sans">
                          {dimName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-slate-400 mt-1 self-center shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded content area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/40 border-t border-slate-100"
                    >
                      <div className="p-3 space-y-2.5">
                        {/* 一句话结论 */}
                        <div className="p-2 py-1.5 bg-amber-500/5 rounded-xl border-l-[3px] border-l-amber-400 text-[11px] font-medium leading-relaxed font-sans text-slate-800">
                          <span className="font-bold text-amber-800 block text-[10px] mb-0.5">结论：</span>
                          {step.conclusion}
                        </div>

                        {/* 支持推荐的证据 */}
                        <div>
                          <span className="inline-block text-[10px] font-bold text-green-700 bg-green-50 px-1.5 rounded mb-1 font-sans">
                            ✓ 支持证据
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                            {step.supportEvidence}
                          </p>
                        </div>

                        {/* 反向提醒 / 风险提示 */}
                        <div>
                          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 rounded mb-1 font-sans">
                            ⚠ 反向提醒
                          </span>
                          <p className="text-[11px] text-[#B54708] leading-relaxed font-sans">
                            {step.reverseReminder}
                          </p>
                        </div>

                        {/* 对候选车的影响 */}
                        <div className="pt-2 border-t border-slate-100/60 space-y-2 text-[10.5px] text-slate-500 font-sans">
                          <div className="flex items-start gap-1.5 w-full">
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[9.5px] shrink-0 mt-0.5">影响</span>
                            <span className="leading-relaxed text-[#475467]">{step.impact}</span>
                          </div>
                          
                          <div className="flex justify-end pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                let nextTab: 'price' | 'space' | 'power' | 'intelligence' | 'risk' = 'price';
                                if (step.id === 's1_1') nextTab = 'space';
                                else if (step.id === 's1_2') nextTab = 'intelligence';
                                else if (step.id === 's1_3') nextTab = 'price';
                                else if (step.id === 's1_4') nextTab = 'risk';
                                
                                setActiveParamTab(nextTab);
                                setShowDbOverlay(true);
                                showToast(`正在从官方车型库拉取“${step.title}”相关的核心参数比对事实...`, 'info');
                              }}
                              className="text-[10px] text-[#0353E9] hover:text-[#023eaf] flex items-center gap-1 font-bold font-sans cursor-pointer hover:underline bg-[#F4F6F9] hover:bg-slate-100 px-2 py-1 rounded-md border border-[#D1D8E6]/60 transition-colors shrink-0"
                            >
                              <span>ℹ️ 回源车型库核实参数</span>
                              <span className="text-[10px] leading-none shrink-0 text-[#0353E9]">↗</span>
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

      {/* 5. 轻量反馈输入：自选偏好补充 */}
      <div className="bg-[#FFFAEB] border border-[#FEDF89] rounded-xl p-4" id="feedback-interaction-card">
        <div>
          <h3 className="text-xs font-bold text-slate-800 font-sans">
            这份判断哪里不符合你的情况？
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
            可以多选，再次点击取消
          </p>
        </div>

        {/* 选项标签区 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {FEEDBACK_OPTIONS.map((option) => {
            const isSelected = selectedFeedbacks.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleFeedback(option)}
                className={isSelected 
                  ? "text-[11px] px-3 py-1.5 rounded-full border border-amber-400 bg-amber-50 text-amber-800 font-bold cursor-pointer transition-all font-sans"
                  : "text-[11px] px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 cursor-pointer hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-all font-sans"
                }
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* 已选中标签展示区 */}
        {selectedFeedbacks.length > 0 && (
          <div className="border-t border-slate-100 pt-3 mt-3">
            <h4 className="text-[10px] text-slate-400 mb-2 font-sans">已选择的条件：</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedFeedbacks.map((option) => (
                <span 
                  key={option}
                  className="text-[10.5px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full pl-2.5 pr-1.5 py-0.5 flex items-center gap-1 font-sans"
                >
                  {option}
                  <button 
                    type="button"
                    onClick={() => toggleFeedback(option)}
                    className="rounded-full p-0.5 hover:bg-amber-100 text-amber-600 w-3.5 h-3.5 flex items-center justify-center font-sans font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. 最短决策动作区 */}
      <div className="ui-card-main p-4 flex flex-col gap-2.5 shadow-none" id="stage-one-actions">
        <span className="text-[10px] text-[#98A2B3] uppercase font-black tracking-wider text-center block font-sans">
          ⚡ 接下来可以做这几件事
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Action 1 */}
          <button 
            onClick={() => {
              setActiveModal('落地价');
              showToast('正在为您抓取上海市各大经销商落地计算价...', 'info');
            }}
            className="flex flex-col items-center justify-center p-1.5 xs:p-2 sm:p-2.5 text-center bg-white hover:bg-[#F4F6F9] border border-[#D1D8E6] text-[#111E36] rounded-xl active:scale-95 transition-all shadow-none"
            id="action-view-local-price"
          >
            <span className="font-bold text-[9.5px] xs:text-[11px] sm:text-xs whitespace-nowrap tracking-tighter xs:tracking-normal">查看本地落地价</span>
            <span className="text-[8.5px] text-[#667085] mt-0.5 whitespace-nowrap">叠加置换补贴</span>
          </button>

          {/* Action 2 */}
          <button 
            onClick={() => {
              setActiveModal('预约试驾');
              showToast('请选择目标车型，极速安排销售送车上门...', 'info');
            }}
            className="flex flex-col items-center justify-center p-1.5 xs:p-2 sm:p-2.5 text-center bg-white hover:bg-[#F4F6F9] border border-[#D1D8E6] text-[#111E36] rounded-xl active:scale-95 transition-all shadow-none"
            id="action-book-test-drive"
          >
            <span className="font-bold text-[9.5px] xs:text-[11px] sm:text-xs whitespace-nowrap tracking-tighter xs:tracking-normal">预约试驾</span>
            <span className="text-[8.5px] text-[#667085] mt-0.5 whitespace-nowrap">送车上门体验</span>
          </button>

          {/* Action 3 */}
          <button 
            onClick={() => {
              setActiveModal('保存报告');
              showToast('报告状态库已就绪，正在渲染微信名片海报...', 'success');
            }}
            className="flex flex-col items-center justify-center p-1.5 xs:p-2 sm:p-2.5 text-center bg-[#0353E9] hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-all shadow-none"
            id="action-save-report"
          >
            <span className="font-bold text-[9.5px] xs:text-[11px] sm:text-xs whitespace-nowrap tracking-tighter xs:tracking-normal">保存报告</span>
            <span className="text-[8.5px] text-white/95 mt-0.5 whitespace-nowrap">生成分享海报</span>
          </button>
        </div>
      </div>

      {/* MODALS RENDERING */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[100] p-4 flex items-end"
          >
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-white rounded-t-[32px] rounded-b-[16px] w-full p-5 max-h-[85%] overflow-y-auto space-y-4 shadow-2xl relative"
            >
              {/* Close helper button */}
              <button 
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 text-xs font-bold bg-slate-100 text-slate-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>

              {/* Local Land Price modal */}
              {activeModal === '落地价' && (
                <div className="space-y-3">
                  <div className="text-left md:text-center pb-2 border-b border-slate-100 pr-10 pl-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">{userCity}本地特惠提车价测算</h3>
                    <p className="text-[11px] text-slate-500 mt-1">已自动叠加该城市置换促销补贴及金融贴息</p>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl">
                      <span className="font-semibold text-slate-700">城市定位</span>
                      <div className="flex items-center gap-1 text-amber-700 font-bold">
                        <MapPin className="w-4 h-4" />
                        <input 
                          type="text" 
                          value={userCity} 
                          onChange={(e) => setUserCity(e.target.value)}
                          className="w-16 text-right bg-transparent border-b border-amber-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="border border-slate-100 p-2.5 rounded-xl text-xs flex justify-between bg-[#FDFBF7]">
                        <div>
                          <span className="font-bold text-slate-800">问界 M7 五座智驾版</span>
                          <span className="text-[10px] text-slate-400 block">指导价：24.98万</span>
                        </div>
                        <div className="text-right">
                          <span className="text-amber-800 font-bold block">现车优惠: -15,000元</span>
                          <span className="text-slate-500 font-medium block">落地预估：23.48万起</span>
                        </div>
                      </div>

                      <div className="border border-slate-100 p-2.5 rounded-xl text-xs flex justify-between bg-white">
                        <div>
                          <span className="font-bold text-slate-800">理想 L8 Pro版</span>
                          <span className="text-[10px] text-slate-400 block">指导价：32.18万</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 font-bold block">限时购置税全免</span>
                          <span className="text-slate-500 font-medium block">落地预估：32.18万起</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">获取专属底价和优惠券，请输入手机号：</label>
                      <div className="flex gap-2">
                        <input 
                          type="tel" 
                          placeholder="请输入您的手机号码" 
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          className="flex-1 border text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button 
                          onClick={() => {
                            if (!userPhone) return showToast('请输入手机号', 'warning');
                            showToast('获取成功！稍后本地特惠顾问会与您核实补贴资质。', 'success');
                            setActiveModal('none');
                          }}
                          className="bg-amber-500 hover:bg-amber-600 font-bold text-xs text-white px-4 py-2 rounded-xl"
                        >
                          免费获取
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Test Drive Modal */}
              {activeModal === '预约试驾' && (
                <div className="space-y-3">
                  <div className="text-left md:text-center pb-2 border-b border-slate-100 pr-10 pl-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">上门送车极致试驾服务预约</h3>
                    <p className="text-[11px] text-slate-500 mt-1">专业评测团持证司机，随车携带原厂婴儿安全座椅供现场测试</p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">选择心仪车型：</label>
                      <select 
                        value={testDriveSelectedCar} 
                        onChange={(e) => setTestDriveSelectedCar(e.target.value)}
                        className="w-full p-2 bg-slate-50 border rounded-xl"
                      >
                        <option value="m7">问界 M7 五座智驾 (华为ADS高速巡航测试)</option>
                        <option value="l8">理想 L8 Pro 六座版 (带娃魔毯底盘滤震测试)</option>
                        <option value="n8">腾势 N8 旗舰六座 (比亚迪云辇野区脱困测试)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">手机号码：</label>
                      <input 
                        type="tel" 
                        placeholder="请输入手机号" 
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="font-semibold text-slate-700 block mb-1">预约时间</label>
                        <input type="date" className="w-full p-2 bg-slate-50 border rounded-xl" defaultValue="2026-05-25" />
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold text-slate-700 block mb-1">送配地址</label>
                        <input type="text" placeholder="上门写字楼、小区或商铺" className="w-full p-2 bg-slate-50 border rounded-xl" />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (!userPhone) return showToast('请输入手机号', 'warning');
                        showToast('试驾申请预约提交！专属送车司机会在24小时内和您联系。', 'success');
                        setActiveModal('none');
                      }}
                      className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl active:bg-slate-900 mt-2 hover:bg-slate-700"
                    >
                      提交上门试驾申请
                    </button>
                  </div>
                </div>
              )}

              {/* Save Report Poster Generator */}
              {activeModal === '保存报告' && (
                <div className="space-y-3">
                  {!isRenderComplete ? (
                    <div className="py-6 px-4 flex flex-col items-center justify-center text-center space-y-4">
                      {/* Loading spinner with elegant amber circle */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-14 h-14 border-4 border-amber-100 rounded-full animate-spin border-t-amber-500"></div>
                        <span className="absolute text-xs font-black font-mono text-amber-700">{renderProgress}%</span>
                      </div>
                      
                      <div className="space-y-1 max-w-xs">
                        <h4 className="text-xs font-bold text-slate-800 animate-pulse">正在调用自研渲染服务生成微信海报...</h4>
                        <p className="text-[10px] text-slate-500 font-medium h-8 flex items-center justify-center">
                          {renderStep}
                        </p>
                      </div>

                      {/* Visual Progress Line */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-left md:text-center pb-2 border-b border-slate-100 pr-10 pl-1">
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">✅ 静态分享海报已生成</h3>
                        <p className="text-[11px] text-slate-500 mt-1">已压缩为精美琥珀微卡片，可直接保存分享至家庭群讨论</p>
                      </div>

                      {/* Poster UI Card mockup preview */}
                      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-amber-950 p-4 rounded-2xl text-white space-y-3 shadow-md border border-slate-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">
                              Autohome AI Report
                            </span>
                            <h4 className="text-xs font-bold mt-1">
                              我的个性化对比选车报告.png
                            </h4>
                          </div>
                          <span className="text-[10px] text-amber-300 font-mono">ID: AUT-0524</span>
                        </div>

                        <div className="bg-white/10 p-2.5 rounded-xl space-y-1 backdrop-blur-xs text-[11px]">
                          <div>
                            <span className="text-slate-300">候选集：</span>
                            <span className="font-semibold">问界M7 Pro、理想L8 Pro</span>
                          </div>
                          <div>
                            <span className="text-slate-300">关键纠结项：</span>
                            <span className="font-semibold">智驾首选与舒适带娃空降之间的取舍</span>
                          </div>
                          <div>
                            <span className="text-slate-300">首屏诊断结果：</span>
                            <span className="text-amber-300 font-bold">建议在问界M7 Pro配置高性价比智驾。</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 text-[9px] border-t border-white/10">
                          <div>
                            <span className="block text-slate-400">已备份至系统状态码：</span>
                            <span className="font-semibold font-mono text-slate-200">#928-0524-7FBC</span>
                          </div>
                          <div className="text-right">
                            <span className="inline-block p-1 bg-white rounded">
                              {/* Mock QR Code representation */}
                              <span className="block w-6 h-6 border-2 border-slate-800 flex items-center justify-center font-bold text-[8px] text-slate-800 scale-90">
                                QR
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            showToast('正在为您保存图片到移动终端本地存储...', 'success');
                            setActiveModal('none');
                          }}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 transition text-white font-bold rounded-xl text-xs active:bg-amber-600 text-center font-sans"
                        >
                          保存高清图片
                        </button>
                        <button 
                          onClick={() => {
                            showToast('已复制名片专属密匙链接！发送给好友即可查看。', 'success');
                            setActiveModal('none');
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 transition text-slate-700 font-bold rounded-xl text-xs active:bg-slate-200 text-center font-sans"
                        >
                          复制名片链接
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed font-sans">
                        报告保存后，可通过这些入口再次查看：AI 对话内「我的对比记录」、首页、对比页报告入口
                      </p>
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY: DETAILED VEHICLE DB COMPARISON OVERLAY */}
      <AnimatePresence>
        {showDbOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[120] p-3 flex items-center justify-center font-sans text-xs"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-h-[90%] p-4 overflow-y-auto space-y-3.5 border border-[#D1D8E6] relative shadow-xl text-[#111E36]"
            >
              <div className="flex justify-between items-center border-b border-[#D1D8E6]/40 pb-2">
                <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded font-black uppercase">
                  车型库Plus 官方参数核实事实
                </span>
                <button 
                  onClick={() => setShowDbOverlay(false)}
                  className="text-xs font-mono font-bold bg-[#F4F6F9] text-[#667085] w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#111E36]">官方车型参数并集核实事实</h3>
                <p className="text-[10px] text-[#667085] mt-0.5">所有客观物理数值深度拉取自汽车之家官方车型库 API：</p>
              </div>

              {/* Dynamic Categories selection tab */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'price', label: '落地与优惠' },
                  { id: 'space', label: '车身尺寸空间' },
                  { id: 'power', label: '动力补能电耗' },
                  { id: 'intelligence', label: '智驾与座舱' },
                  { id: 'risk', label: '质保与雷区差评' }
                ].map(p => {
                  const isActive = activeParamTab === p.id;
                  return (
                    <button 
                      key={p.id}
                      onClick={() => setActiveParamTab(p.id as any)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-md border transition-colors ${
                        isActive 
                          ? 'bg-amber-600 border-amber-600 text-white font-bold' 
                          : 'bg-white border-[#D1D8E6] text-[#667085] hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic database list */}
              <div className="border border-[#D1D8E6]/60 rounded-xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F9] text-[#667085] border-b border-[#D1D8E6]">
                      <th className="p-2.5 font-bold">参数项目</th>
                      <th className="p-2.5 font-bold text-[#111E36]">问界 M7</th>
                      <th className="p-2.5 font-bold text-[#111E36]">理想 L8</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeParamsFiltered.map((p, idx) => (
                      <tr key={idx} className="border-b border-[#D1D8E6]/30 hover:bg-[#F6F8FC]/50">
                        <td className="p-2.5 text-[#667085] font-medium">{p.parameterName}</td>
                        <td className="p-2.5 font-bold font-mono text-[#111E36]">{p.modelAValue}</td>
                        <td className="p-2.5 font-bold font-mono text-[#111E36]">{p.modelBValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Difference callouts */}
              <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-200/50 text-[10.5px] text-[#111E36] leading-relaxed">
                💡 <strong>两车差异：</strong>{activeParamsFiltered[0]?.differenceText || '无重大硬性影响'}
              </div>

              <button 
                onClick={() => setShowDbOverlay(false)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl active:bg-amber-700 transition"
              >
                确定并返回报告
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
