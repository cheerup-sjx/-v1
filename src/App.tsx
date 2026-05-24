/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Compass, 
  Sliders, 
  Layers, 
  FileCheck, 
  ArrowRight,
  Info,
  ChevronRight,
  AlertOctagon,
  Database,
  RefreshCw,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MobileFrame from './components/MobileFrame';
import StageOneMVP from './pages/StageOneMVP';
import StageTwoBattle from './pages/StageTwoBattle';

export default function App() {
  const [activeStage, setActiveStage] = useState<'stage1' | 'stage2'>('stage1');
  
  // Toast Alert System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle stage switching with beautiful feedback
  const handleStageSwitch = (stage: 'stage1' | 'stage2') => {
    setActiveStage(stage);
    showToast(
      stage === 'stage1' 
        ? '已进入：第一阶段 主站行为初始化MVP 报告' 
        : '已进入：第二阶段 Battle 持续选车工单闭环版',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#ECEFF1] text-slate-800 flex flex-col md:flex-row font-sans" id="applet-dashboard-root">
      
      {/* Dynamic Toast Alert Portal */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-sm max-w-sm ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : toast.type === 'warning' 
                ? 'bg-amber-50 border-amber-200 text-amber-800' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}
          >
            <span className="text-base">
              {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="font-semibold leading-snug">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPANION PANEL (Left side on large desktops, top on mobiles) */}
      <div className="w-full md:w-[480px] bg-slate-900 text-white flex flex-col border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0" id="sidebar-companion-panel">
        
        {/* Header Title branding */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
              AI PROTOTYPE HUB
            </span>
            <span className="text-slate-400 font-mono text-[11px]">V2.0.demo</span>
          </div>
          <h1 className="text-lg font-black tracking-tight mt-1 bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
            个性化对比选车报告 两阶段智能 Demo
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            专为汽车选车决策链打造的 AI 智能工单，针对高意向购买用户的“纠结状态”，设计并论证从轻命中到持续跟进的闭环链路。
          </p>
        </div>

        {/* Stage selection controllers */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
            🛎️ 请选择要评估的产品研发阶段：
          </span>
          
          <div className="flex flex-col gap-2.5">
            {/* Stage 1 selector buttons */}
            <button 
              onClick={() => handleStageSwitch('stage1')}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                activeStage === 'stage1' 
                  ? 'bg-slate-800 border-amber-500/80 shadow-md translate-x-1' 
                  : 'bg-slate-950/30 border-slate-800 hover:bg-slate-800/40 opacity-70'
              }`}
              id="sidebar-stage1-tab"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-amber-400">第一阶段 MVP</span>
                <span className={`text-[9px] px-1.5 rounded font-bold ${
                  activeStage === 'stage1' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  主站行为初始化
                </span>
              </div>
              <h2 className="font-bold text-sm mt-1 text-white">「 命中度与轻首屏验证 」</h2>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                验证通过主站高价值行为（空间、价格、对比）是否能直接映射成一套极为精准的诊断首屏，不做复杂滑块及SKU。
              </p>
              {activeStage === 'stage1' && (
                <div className="absolute right-3 bottom-3 text-amber-500">
                  <CheckCircle2 className="w-4 h-4 fill-current stroke-slate-900" />
                </div>
              )}
            </button>

            {/* Stage 2 selector buttons */}
            <button 
              onClick={() => handleStageSwitch('stage2')}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                activeStage === 'stage2' 
                  ? 'bg-slate-800 border-amber-500/80 shadow-md translate-x-1' 
                  : 'bg-slate-950/30 border-slate-800 hover:bg-slate-800/40 opacity-70'
              }`}
              id="sidebar-stage2-tab"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-amber-400">第二阶段 Battle 闭环</span>
                <span className={`text-[9px] px-1.5 rounded font-bold ${
                  activeStage === 'stage2' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  持续选车工单
                </span>
              </div>
              <h2 className="font-bold text-sm mt-1 text-white">「 对比决策推进与闭环收网 」</h2>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                AI双车智能体Battle。打通<strong>权重滑块、车型库Plus事实底座、反证风险审计、四类反馈纠偏和SKU版本拆解</strong>，致力于推进候选收缩与留资。
              </p>
              {activeStage === 'stage2' && (
                <div className="absolute right-3 bottom-3 text-amber-500">
                  <CheckCircle2 className="w-4 h-4 fill-current stroke-slate-900" />
                </div>
              )}
            </button>
          </div>

          {/* OKR Spec checklist based on Stage */}
          <div className="pt-4 border-t border-slate-800 mt-2 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
              📊 阶段性OKR目标与范围对照
            </span>

            {activeStage === 'stage1' ? (
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    【第一阶段 MVP 验证聚焦】
                  </h4>
                  <ul className="space-y-1 pl-3.5 list-disc text-[11px] text-slate-400">
                    <li>报告目标卡首屏解释 (基于上海SUV行为)</li>
                    <li>用户状态评估 (五六座大空间纠结)</li>
                    <li>1-2条主站在意证据展开 (车型库比对)</li>
                    <li>保留 / 弱化 / 排除 梯度架构互动</li>
                    <li>前台最短决策链路 (落地价、试驾、生成海报)</li>
                  </ul>
                </div>

                <div className="bg-red-950/20 p-3 rounded-xl border border-red-900/30 text-rose-300/90 space-y-1">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1 text-[11.5px]">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    第一阶段 MVP 明确【不予开发】：
                  </h4>
                  <ul className="space-y-0.5 text-[10.5px] text-rose-200/60 list-disc pl-3.5">
                    <li>关闭权重滑块</li>
                    <li>不接入版本确认卡 (不介入SKU级)</li>
                    <li>不做多轮智能体角色包装</li>
                    <li>不做真实差评和口碑争议文本深度聚类</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    【第二阶段 Battle 闭环验证聚焦】
                  </h4>
                  <ul className="space-y-1 pl-3.5 list-disc text-[11px] text-slate-400">
                    <li>Battle双车求解对局 (Model Y vs 极氪001)</li>
                    <li><strong>动态权重阻阻阻</strong>，拖拽滑块重排指数</li>
                    <li><strong>反证与风险安全卡</strong> 避坑审计，点击表达在意</li>
                    <li><strong>SKU版本确认卡</strong>, 支持切换对比口径</li>
                    <li><strong>完整反馈纠偏</strong>：否定/约束/排斥/偏好多类</li>
                    <li>一键小红书笔记草稿输出 &amp; 交给买方微信暗谈</li>
                  </ul>
                </div>

                <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-900/30 text-amber-300/90 space-y-1">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1 text-[11.5px]">
                    <Info className="w-3.5 h-3.5" />
                    第二阶段 P1 增强与后续预留：
                  </h4>
                  <ul className="space-y-0.5 text-[10.5px] text-amber-200/60 list-disc pl-3.5">
                    <li>小红书笔记草稿已增强呈现，不占主干</li>
                    <li>专家观点及多重智能体团队设为P2后续预留状态</li>
                    <li>主客观分层、SPU→SKU演进符合高质截图需求</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 font-mono text-[10px] text-slate-500 text-center flex justify-between items-center">
          <span>汽车之选 AI Prototype</span>
          <span>© 1999 - 2026 Autohome</span>
        </div>
      </div>

      {/* RENDER CELLPHONE FRAME VIEWPORT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#F3F4F6] relative overflow-hidden" id="simulator-viewport-area">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0"></div>

        {/* View mode indicator tag floating above */}
        <div className="z-10 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-xs border border-slate-200/50 text-xs flex items-center gap-2 mb-2 font-medium" id="stage-badge-indicator">
          <Smartphone className="w-4 h-4 text-slate-700" />
          <span>正在模拟 iPhone 16 · 正在运行：</span>
          <span className="font-bold text-amber-800">
            {activeStage === 'stage1' ? '第一阶段 MVP 轻首屏报告' : '第二阶段 Battle 持续选车工单'}
          </span>
        </div>

        {/* The Frame chassis hosting target app view */}
        <div className="relative z-10 select-none">
          {activeStage === 'stage1' ? (
            <MobileFrame 
              navTitle="车系深度对比"
              onBackClick={() => showToast('这已经是第一阶段初始化报告的首屏。', 'info')}
            >
              <StageOneMVP showToast={showToast} />
            </MobileFrame>
          ) : (
            <MobileFrame 
              navTitle="AI双车Battle工单"
              onBackClick={() => {
                setActiveStage('stage1');
                showToast('已回退至第一阶段主站行为MVP报告。', 'info');
              }}
            >
              <StageTwoBattle showToast={showToast} />
            </MobileFrame>
          )}
        </div>

        {/* Reset tool helper */}
        <div className="mt-2 text-center text-xs text-slate-400 z-10">
          <span>提示：可以在左侧 Companion 随时切换验证机制以对比差异，右侧手机内元素均可交互。</span>
        </div>

      </div>

    </div>
  );
}
