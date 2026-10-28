import React from 'react';
import { Download, Smartphone, Code, Layers, BookOpen, Check } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'simulator' | 'code' | 'architecture' | 'setup';
  setActiveTab: (tab: 'simulator' | 'code' | 'architecture' | 'setup') => void;
  onExportZip: () => void;
  copiedNotice: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onExportZip,
  copiedNotice,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#simulator"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('simulator');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <span>DesktopViewport</span>
        </a>
      </div>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'simulator' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Interactive Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'code' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Native Codebases</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'architecture' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Engine Architecture</span>
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'setup' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Setup Guides</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportZip}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-sky-500/20 active:scale-95"
        >
          {copiedNotice ? (
            <>
              <Check className="w-3.5 h-3.5 text-slate-900" />
              <span>Project Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export Native Code</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
