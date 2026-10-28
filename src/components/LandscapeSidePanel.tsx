/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Home,
  Monitor,
  Share2,
  X,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { RedScaleSlider } from './RedScaleSlider';
import { QUICK_BOOKMARKS } from '../data/desktopSearchSites';

interface LandscapeSidePanelProps {
  currentUrl: string;
  onSearchOrNavigate: (query: string) => void;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onHome: () => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  onAutoFit: () => void;
  onOpenInstallModal: () => void;
  isStandalone: boolean;
}

export const LandscapeSidePanel: React.FC<LandscapeSidePanelProps> = ({
  currentUrl,
  onSearchOrNavigate,
  isLoading,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onReload,
  onHome,
  scale,
  onScaleChange,
  onAutoFit,
  onOpenInstallModal,
  isStandalone,
}) => {
  const [inputValue, setInputValue] = React.useState(currentUrl);

  React.useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearchOrNavigate(inputValue.trim());
    }
  };

  return (
    <aside className="w-80 md:w-88 h-full bg-[#18181B] border-r border-[#2D2D33] flex flex-col z-30 shrink-0 select-none overflow-hidden pl-safe">
      {/* Brand & Landscape Identity Header */}
      <div className="bg-[#D32F2F] text-white p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight">Desktop Search</h2>
            <p className="text-[10px] text-white/80 font-medium">Landscape Split Layout</p>
          </div>
        </div>

        {!isStandalone && (
          <button
            onClick={onOpenInstallModal}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Add to Home Screen"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Omnibox / Search Row */}
      <div className="p-3 border-b border-[#2D2D33] bg-[#121214]">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 bg-[#1E1E22] rounded-xl px-3 py-2 border border-[#2D2D33] focus-within:border-[#D32F2F] transition-all">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search or enter web address with Desktop Search"
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none truncate font-medium"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="text-[#EF4444] hover:text-[#F87171] p-0.5 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Buttons Row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2D2D33] bg-[#18181B] text-slate-300">
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="p-2 rounded-lg hover:bg-[#25252A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="p-2 rounded-lg hover:bg-[#25252A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onReload}
            className="p-2 rounded-lg hover:bg-[#25252A] hover:text-white transition-colors cursor-pointer"
            title="Reload"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25252A] hover:bg-[#33333A] text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
      </div>

      {/* Red Viewport Zoom Slider (Pinned in Side Panel) */}
      <RedScaleSlider
        scale={scale}
        onScaleChange={onScaleChange}
        onAutoFit={onAutoFit}
      />

      {/* Quick Bookmarks List in Side Panel */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 border-t border-[#2D2D33]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 px-1 mb-1">
          <Compass className="w-3.5 h-3.5 text-[#EF4444]" />
          <span>Desktop Favorites</span>
        </div>

        <div className="space-y-1">
          {QUICK_BOOKMARKS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearchOrNavigate(item.url)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1E1E22] hover:bg-[#25252A] border border-[#2D2D33] hover:border-[#D32F2F]/40 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{item.domain}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1280px</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
