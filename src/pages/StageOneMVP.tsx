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
import { STAGE_1_CARS, STAGE_1_EVIDENCES } from '../data/mockData';
import { CarInfo, DecisionEvidence } from '../types';

interface StageOneProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function StageOneMVP({ showToast }: StageOneProps) {
  // Local state for candidates & their current status
  const [cars, setCars] = useState<CarInfo[]>(STAGE_1_CARS);
  
  // Local state for preferences & user inputs
  const [preferenceText, setPreferenceText] = useState('');
  const [activePreferences, setActivePreferences] = useState<string[]>([
    '注重华为ADS城区智驾',
    '家庭周末经常搭乘6人'
  ]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Evidence card expansion states (map of evidence ID to boolean)
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({
    'e1': true, // default first one expanded
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

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllEvidences = () => {
    const allIds = STAGE_1_EVIDENCES.map(e => e.id);
    const anyCollapsed = allIds.some(id => !expandedEvidence[id]);
    const newState: Record<string, boolean> = {};
    allIds.forEach(id => {
      newState[id] = anyCollapsed;
    });
    setExpandedEvidence(newState);
    showToast(anyCollapsed ? '已全部展开核心决策依据' : '已全部收起核心决策依据', 'info');
  };

  // Background poster rendering effect
  React.useEffect(() => {
    if (activeModal === '保存报告') {
      setIsRenderComplete(false);
      setRenderProgress(0);
      setRenderStep('🔍 正在提取当前候选车型的智能评测系数与纠偏结论...');
      
      const interval = setInterval(() => {
        setRenderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRenderComplete(true);
            setRenderStep('✅ 微信分享静态海报已在后台成功渲染！');
            showToast('海报已生成就绪，您可长按或点击保存。', 'success');
            return 100;
          }
          const next = prev + 10;
          if (next === 30) {
            setRenderStep('📊 正在拉取车型库Plus主网格以合成比对雷口...');
          } else if (next === 60) {
            setRenderStep('🎨 智能调色盘调色中：采用 “琥珀光感” 包置换极简模板...');
          } else if (next === 90) {
            setRenderStep('🛡️ 正在注入安全口径验证暗号与对应微信小程序动态码...');
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

  const handleAddPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferenceText.trim()) return;
    setActivePreferences(prev => [...prev, preferenceText.trim()]);
    showToast(`成功补充偏好条件: "${preferenceText.trim()}"`, 'success');
    setPreferenceText('');
  };

  const handleRemovePreference = (index: number) => {
    const textRemoved = activePreferences[index];
    setActivePreferences(prev => prev.filter((_, i) => i !== index));
    showToast(`已移除偏好: "${textRemoved}"`, 'info');
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
        className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent rounded-2xl p-4 border border-amber-500/20"
        id="report-target-card"
      >
        <div className="flex items-start gap-2.5">
          <div className="bg-amber-100 p-1.5 rounded-lg text-amber-700 mt-0.5">
            <Sparkles className="w-4 h-4 fill-amber-500 stroke-amber-700" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase block mb-0.5">
              💡 主站决策信号初始化报告 · MVP
            </span>
            <h1 className="text-sm font-bold text-slate-900 leading-snug">
              诊断依据：您近7天在中高端中大型六座新能源SUV工具页停留时长超24分钟。重点关注 “智驾领航成本” 与 “二排独立舒适座椅”。
            </h1>
            
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <span className="font-semibold text-slate-800">报告锁定目标：</span>
              分析您在<strong> 问界M7、理想L8、腾势N8</strong> 之间的真实买点偏好与政策缺口，推进第一轮候选收缩。
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs font-semibold text-amber-800 underline flex items-center gap-1 active:text-amber-950"
                id="view-diagnose-details"
              >
                {showExplanation ? '收起主站原始轨迹' : '查看数据采集与判定来源 ⚙️'}
              </button>
            </div>

            {/* Parallel verification indicator buttons */}
            <div className="mt-3.5 pt-3.5 border-t border-amber-500/10 grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  showToast('报告命中确认，继续为您推进决策...', 'success');
                }}
                className="py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1-some focus:ring-2 focus:ring-amber-500"
                id="hit-confirm-yes"
              >
                ✓ 这说的是我
              </button>
              <button 
                onClick={() => {
                  setShowCorrectionTip(true);
                  showToast('请在下方补充偏好，系统将重新调整', 'info');
                  const el = document.getElementById('override-text-input');
                  if (el) {
                    el.focus();
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="py-2.5 bg-white hover:bg-[#FAF9F5]/80 active:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1"
                id="hit-confirm-no"
              >
                不太准确
              </button>
            </div>

            {/* Lightweight correction hint panel */}
            <AnimatePresence>
              {showCorrectionTip && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2.5 p-2.5 bg-[#FAF9F5]/90 border border-amber-200/50 rounded-xl text-[11px] text-amber-800 leading-relaxed font-semibold shadow-2xs"
                >
                  💡 <strong>请在下方补充偏好，系统将重新调整</strong>：可使用下方的自选偏好补充功能追加您的个性要素，评估结论会自愈对齐。
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Diagnostic raw event list */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3 pt-3 border-t border-amber-500/10 text-[11px] text-slate-600 space-y-1.5 font-mono"
            >
              <div className="flex justify-between text-slate-400">
                <span>触发事件</span>
                <span>发生频率/时长</span>
              </div>
              <div className="flex justify-between bg-white/50 px-2 py-0.5 rounded">
                <span>🔍 车系PK：问界M7 vs 理想L8</span>
                <span>对比活跃3次</span>
              </div>
              <div className="flex justify-between bg-white/50 px-2 py-0.5 rounded">
                <span>📑 参排停留：二排空间及魔毯架构</span>
                <span>4.8 分钟停留</span>
              </div>
              <div className="flex justify-between bg-white/50 px-2 py-0.5 rounded">
                <span>💬 口碑页：“智驾版溢价”/“OTA体验”</span>
                <span>极度敏感 / 3次标签筛选</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>仅捕获脱敏行为链，未关联任何敏感实名信息</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. 用户状态与待确认项目台 */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3" id="user-status-card">
        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div>
            <span className="text-xs text-slate-500 block">系统研判当前决策阶段</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-sm font-bold text-slate-800">多车 Battle / 候选收缩 🏁</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">CONFIDENCE</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
              92% 很高
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 block">🕵️‍♂️ 您的核心纠结点研判：</span>
          <p className="text-xs text-slate-600 bg-[#FAF9F5] p-2 rounded-xl border-l-2 border-amber-500 leading-relaxed font-medium">
            &ldquo;30万高意向预算，高频带娃、喜欢无感智驾，理想L8二排高级舒适性是否值得为Max版本妥协？还是直接买问界M7的基础智驾包更省预算？&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="border border-slate-100 bg-[#fbfcfd] p-2.5 rounded-xl">
            <span className="text-xs font-bold text-slate-700 block mb-1">🛒 潜在待确认项</span>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-3 leading-snug">
              <li>不同智驾版本真实开通溢价</li>
              <li>车长超5.1米对自用车位限制</li>
              <li>二排儿童安全座椅拆装过道</li>
            </ul>
          </div>
          <div className="border border-slate-100 bg-[#fbfcfd] p-2.5 rounded-xl">
            <span className="text-xs font-bold text-slate-700 block mb-1">📉 当前状态分布</span>
            <div className="space-y-1 mt-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">主力保留:</span>
                <span className="font-bold text-green-600 font-mono">{keeps.length}款</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">可能弱化:</span>
                <span className="font-bold text-slate-500 font-mono">{weakens.length}款</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">主动排除:</span>
                <span className="font-bold text-red-500 font-mono">{excludes.length}款</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 候选状态 / 候选收缩卡（核心保留、弱化、排除互动） */}
      <div className="space-y-1.5" id="candidate-shrink-card">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1">
            <Layers className="w-4 h-4 text-slate-600" />
            候选车型梯度决策台
          </h2>
          <span className="text-[10px] text-slate-500 font-medium">
            点击标签可手动更改收缩状态
          </span>
        </div>

        <div className="space-y-2">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs ${
                car.keepStatus === 'keep' 
                  ? 'border-l-4 border-l-amber-500 border-slate-100 opacity-100' 
                  : car.keepStatus === 'weaken' 
                  ? 'border-l-4 border-l-slate-400 border-slate-200 opacity-80 scale-[0.98]' 
                  : 'border-l-4 border-l-red-400 border-slate-200 opacity-50 scale-[0.96] saturate-[0.2]'
              }`}
            >
              <div className="p-3">
                <div className="flex gap-2.5">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-16 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200 shadow-2xs self-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{car.brand}</span>
                        <h3 className="text-xs font-bold text-slate-900 leading-tight">{car.name}</h3>
                      </div>
                      <span className="text-[11px] font-bold text-red-600 font-mono">{car.guidePrice}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                      🎯 当前策略：
                      <span className={`px-1.5 py-0.2 rounded-md font-bold ${
                        car.keepStatus === 'keep' ? 'bg-amber-50 text-amber-700' : car.keepStatus === 'weaken' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'
                      }`}>
                        {car.decisionRole}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Keep reasons / Avoid conditions depending on status */}
                <div className="mt-2 bg-slate-50/70 p-2 rounded-xl text-[11px] leading-relaxed text-slate-600">
                  {car.keepStatus !== 'exclude' ? (
                    <p>
                      <span className="font-semibold text-slate-800 text-[10px] text-amber-700">推荐理由：</span>
                      {car.keepReason}
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold text-red-700 text-[10px]">避坑提醒：</span>
                      {car.riskWarning}
                    </p>
                  )}
                </div>

                {/* Row of interactive action togglers */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] text-slate-400">调整策略指向:</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleStatusChange(car.id, 'keep')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1 rounded-full border transition-all ${
                        car.keepStatus === 'keep' 
                          ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-2xs font-bold' 
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      保留候选
                    </button>
                    <button 
                      onClick={() => handleStatusChange(car.id, 'weaken')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1 rounded-full border transition-all ${
                        car.keepStatus === 'weaken' 
                          ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold' 
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      弱化备选
                    </button>
                    <button 
                      onClick={() => handleStatusChange(car.id, 'exclude')}
                      className={`text-[10px] font-medium leading-none px-2.5 py-1 rounded-full border transition-all ${
                        car.keepStatus === 'exclude' 
                          ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      排除此车
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 决策证据卡 MVP （展示3个关键证据，高度紧凑） */}
      <div className="space-y-1.5" id="decision-evidence-scroller">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-amber-600" />
            首期命中验证 · 核心决策依据
          </h2>
          <button 
            onClick={toggleAllEvidences}
            className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
          >
            展开/收起全部
          </button>
        </div>

        <div className="space-y-2">
          {STAGE_1_EVIDENCES.map((evidence) => {
            const isExpanded = !!expandedEvidence[evidence.id];
            return (
              <div 
                key={evidence.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden"
              >
                {/* Header of evidence */}
                <div 
                  onClick={() => toggleEvidence(evidence.id)}
                  className="p-3 flex items-start justify-between gap-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        问题 {evidence.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                        {evidence.sourceName}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 leading-snug">
                      {evidence.question}
                    </h3>
                  </div>
                  <div className="text-slate-400 mt-1 self-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded facts & actions */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-slate-50/40 border-t border-slate-100"
                    >
                      <div className="p-3 text-[11px] space-y-2 text-slate-600">
                        <div className="bg-amber-500/5 p-2 rounded-xl border-l-2 border-amber-400 text-slate-800 font-medium leading-relaxed">
                          🏁 AI 定理判断：{evidence.conclusion}
                        </div>
                        
                        <div className="space-y-1.5 mt-2">
                          <span className="font-semibold text-slate-700 text-[10px] block uppercase">
                            ✓ 汽车之家客观参配比对信息
                          </span>
                          {evidence.evidenceList.map((item, idx) => (
                            <div key={idx} className="flex gap-1.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                              <p className={`leading-relaxed ${item.highlight ? 'text-indigo-900 font-medium' : ''}`}>
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Direct action based on the evidence */}
                        <div className="pt-2 flex justify-end">
                          <button 
                            onClick={() => {
                              showToast(`正在为您在后台加载并回源车系详情以校验事实...`, 'success');
                            }}
                            className="text-[10px] font-bold text-slate-600 hover:text-amber-800 transition-colors flex items-center gap-0.5 hover:underline"
                          >
                            <Info className="w-3.5 h-3.5" />
                            回源车型库核实参数 ↗
                          </button>
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
      <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-amber-200/50 space-y-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✨ 轻量反馈：偏好自纠偏
          </h3>
          <p className="text-[11px] text-slate-500">
            觉得系统判断不够完美？请修改或一句话补充，系统将自动更正。
          </p>
        </div>

        {/* Existing bullet list */}
        {activePreferences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activePreferences.map((pref, i) => (
              <span 
                key={i} 
                className="text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-full pl-2 pr-1.5 py-0.5 flex items-center gap-1"
              >
                {pref}
                <button 
                  onClick={() => handleRemovePreference(i)}
                  className="rounded-full p-0.5 hover:bg-slate-100 text-slate-400 active:text-red-600"
                  title="Remove override"
                >
                  <Plus className="w-3 h-3 rotate-45 stroke-[3]" />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleAddPreference} className="flex gap-1.5">
          <input 
            type="text" 
            placeholder="例如：“我不考虑理想因为纯电里程还太少” 或 “预算改32万”"
            value={preferenceText}
            onChange={(e) => setPreferenceText(e.target.value)}
            className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-400 text-slate-700"
            id="override-text-input"
          />
          <button 
            type="submit" 
            className="text-xs font-bold bg-slate-800 text-white px-3.5 py-2 rounded-xl active:bg-slate-900 flex items-center gap-1 hover:bg-slate-700 transition"
          >
            提交纠偏
          </button>
        </form>
      </div>

      {/* 6. 最短决策动作区 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-150/80 flex flex-col gap-2.5" id="stage-one-actions">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider text-center block">
          ⚡ 推进买车最短闭环动作
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Action 1 */}
          <button 
            onClick={() => {
              setActiveModal('落地价');
              showToast('正在为您抓取上海市各大经销商落地计算价...', 'info');
            }}
            className="flex flex-col items-center justify-center p-2.5 text-center bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] border border-amber-200/50 text-slate-800 rounded-xl active:scale-95 transition-transform"
            id="action-view-local-price"
          >
            <span className="font-bold text-[11px] sm:text-xs">查看本地落地价</span>
            <span className="text-[8.5px] text-slate-400 mt-0.5">叠加置换补贴</span>
          </button>

          {/* Action 2 */}
          <button 
            onClick={() => {
              setActiveModal('预约试驾');
              showToast('请选择目标车型，极速安排销售送车上门...', 'info');
            }}
            className="flex flex-col items-center justify-center p-2.5 text-center bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] border border-amber-200/50 text-slate-800 rounded-xl active:scale-95 transition-transform"
            id="action-book-test-drive"
          >
            <span className="font-bold text-[11px] sm:text-xs">预约试驾</span>
            <span className="text-[8.5px] text-slate-400 mt-0.5">送车上门体验</span>
          </button>

          {/* Action 3 */}
          <button 
            onClick={() => {
              setActiveModal('保存报告');
              showToast('报告状态库已就绪，正在渲染微信名片海报...', 'success');
            }}
            className="flex flex-col items-center justify-center p-2.5 text-center bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl active:scale-95 transition-transform shadow-2xs"
            id="action-save-report"
          >
            <span className="font-bold text-[11px] sm:text-xs">保存报告</span>
            <span className="text-[8.5px] text-white/90 mt-0.5">生成分享海报</span>
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
                  <div className="text-center pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">上海市本地特惠提车价测算</h3>
                    <p className="text-[11px] text-slate-500">已自动叠加上海市置换促消补贴及金融贴息</p>
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
                  <div className="text-center pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">上门送车极致试驾服务预约</h3>
                    <p className="text-[11px] text-slate-500">专业评测团持证司机，随车携带原厂婴儿安全座椅供现场测试</p>
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
                      <div className="text-center pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">✅ 微信分享静态海报已在后台成功渲染</h3>
                        <p className="text-[11px] text-slate-500">已压缩为精美琥珀微卡片，可直接保存分享至家庭群讨论</p>
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
                            <span className="text-slate-300">核心诉求纠结点：</span>
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
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 transition text-white font-bold rounded-xl text-xs active:bg-amber-600 text-center"
                        >
                          保存高清图片
                        </button>
                        <button 
                          onClick={() => {
                            showToast('已复制名片专属密匙链接！发送给好友即可查看。', 'success');
                            setActiveModal('none');
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 transition text-slate-700 font-bold rounded-xl text-xs active:bg-slate-200 text-center"
                        >
                          复制名片链接
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
