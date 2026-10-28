/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Sliders,
  Plus,
} from 'lucide-react';

interface ChromeToolBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onHome: () => void;
  onNewTab: () => void;
  scale: number;
  onToggleScaleSlider: () => void;
  isScaleSliderOpen: boolean;
}

export const ChromeToolBar: React.FC<ChromeToolBarProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onHome,
  onNewTab,
  scale,
  onToggleScaleSlider,
  isScaleSliderOpen,
}) => {
  return (
    <footer
      style={{
        paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) * 0.2), 6px)',
      }}
      className="w-full bg-[#18181B] border-t border-[#2D2D33]/70 px-4 pt-1 pb-1.5 flex items-center justify-between text-slate-300 relative z-50 select-none shrink-0 pointer-events-auto"
    >
      {/* 1. Back (<) - Compact & small */}
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-[#25252A] active:bg-[#33333A] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
        title="Back"
        aria-label="Back"
      >
        <ChevronLeft className="w-[18px] h-[18px]" />
      </button>

      {/* 2. Forward (>) - Compact & small */}
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-[#25252A] active:bg-[#33333A] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
        title="Forward"
        aria-label="Forward"
      >
        <ChevronRight className="w-[18px] h-[18px]" />
      </button>

      {/* 3. Red Zoom Pill (e.g. 31% / 40%) - Sleek, compact */}
      <button
        onClick={onToggleScaleSlider}
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer ${
          isScaleSliderOpen
            ? 'bg-[#D32F2F] text-white shadow-md shadow-red-900/50 ring-1 ring-[#EF4444]/50'
            : 'bg-[#25252A] text-slate-200 hover:bg-[#33333A] hover:text-white border border-[#33333A] active:scale-95'
        }`}
        title="Adjust Desktop Viewport Zoom (25% - 100%)"
        aria-label="Zoom Scale Slider"
      >
        <Sliders className={`w-3.5 h-3.5 ${isScaleSliderOpen ? 'text-white' : 'text-[#EF4444]'}`} />
        <span className="font-mono text-xs font-semibold">{Math.round(scale * 100)}%</span>
      </button>

      {/* 4. Home - Compact & small */}
      <button
        onClick={onHome}
        className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-[#25252A] active:bg-[#33333A] flex items-center justify-center transition-colors cursor-pointer"
        title="Desktop Search Home"
        aria-label="Desktop Search Home"
      >
        <Home className="w-[18px] h-[18px]" />
      </button>

      {/* 5. Plus (+) - Compact, small, low-profile as originally styled */}
      <button
        onClick={onNewTab}
        className="w-8 h-8 rounded-lg text-white bg-[#25252A] hover:bg-[#33333A] active:bg-[#3D3D45] border border-[#33333A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title="New Tab"
        aria-label="New Tab"
      >
        <Plus className="w-4 h-4 text-white" strokeWidth={2.2} />
      </button>
    </footer>
  );
};
