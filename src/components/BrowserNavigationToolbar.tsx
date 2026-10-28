import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Home,
  RotateCcw,
  Monitor,
  Smartphone,
  SlidersHorizontal,
  Maximize,
} from 'lucide-react';
import { UserAgentProfile } from '../types/browser';

interface BrowserNavigationToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onResetScale: () => void;
  onResetContainerSize: () => void;
  isDesktopMode: boolean;
  onToggleDesktopMode: () => void;
  currentUserAgent: UserAgentProfile;
  onChangeUserAgent: (profile: UserAgentProfile) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
}

export const BrowserNavigationToolbar: React.FC<BrowserNavigationToolbarProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onReload,
  onHome,
  onResetScale,
  onResetContainerSize,
  isDesktopMode,
  onToggleDesktopMode,
  currentUserAgent,
  onChangeUserAgent,
  isInspectorOpen,
  onToggleInspector,
}) => {
  return (
    <div className="w-full h-13 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
      {/* Essential Navigation: Back, Forward, Reload, Home */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onGoBack}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onGoForward}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Forward"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onReload}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:rotate-180"
          title="Reload page"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={onHome}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Center Forced Desktop Mode Badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDesktopMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            isDesktopMode
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sm shadow-sky-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Forced Desktop Mode"
        >
          {isDesktopMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Desktop Mode</span>
              <span className="text-[10px] bg-sky-500/30 px-1 rounded text-sky-200 font-mono">ON</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Mobile Mode</span>
              <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-300 font-mono">OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls: Scale Reset, Frame Size Reset, Inspector */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onResetScale}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset Viewport Scale to 100%"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onResetContainerSize}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset Frame Dimensions to Full Screen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleInspector}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isInspectorOpen
              ? 'bg-sky-500/20 text-sky-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Viewport Metrics & HUD Inspector"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
