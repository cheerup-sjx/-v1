/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, MoreHorizontal } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
  navTitle: string;
  onBackClick?: () => void;
  headerExtra?: ReactNode;
}

export default function MobileFrame({ children, navTitle, onBackClick, headerExtra }: MobileFrameProps) {
  return (
    <div className="relative mx-auto my-4 w-[375px] h-[812px] bg-[#F6F8FC] rounded-[48px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col font-sans select-none" id="mobile-iphone-frame">
      {/* Dynamic Island / Speaker Notch */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-[18px] bg-black rounded-full z-50 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 absolute right-6"></span>
      </div>

      {/* Top Mobile Status Bar */}
      <div className="h-10 px-6 pt-3 flex items-center justify-between text-xs font-semibold bg-white/90 backdrop-blur-md z-40 text-slate-800">
        <span>13:22</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-medium scale-90">100%</span>
            <Battery className="w-4 h-4 fill-current rotate-0" />
          </div>
        </div>
      </div>

      {/* App Mobile Header / Navigation Bar */}
      <div className="h-12 px-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-10 z-30 shadow-xs">
        <button 
          onClick={onBackClick}
          className="p-1 px-1.5 active:bg-slate-100 rounded-full transition-colors flex items-center justify-center text-slate-700"
          title="Back"
          id="mobile-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-slate-800 text-[16px] tracking-tight truncate max-w-[200px]" id="mobile-nav-title">
          {navTitle}
        </span>
        <div className="flex items-center gap-1">
          {headerExtra ? headerExtra : (
            <button className="p-1 active:bg-slate-100 rounded-full text-slate-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* App Body (Scrollable Screen Content) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-8 flex flex-col bg-[#F6F8FC]" id="mobile-scrollable-body">
        {children}
      </div>

      {/* Mobile iOS Home Indicator */}
      <div className="h-6 bg-[#F6F8FC] flex items-center justify-center relative w-full border-t border-slate-100 z-30">
        <div className="w-32 h-[4px] bg-slate-400 rounded-full"></div>
      </div>
    </div>
  );
}
