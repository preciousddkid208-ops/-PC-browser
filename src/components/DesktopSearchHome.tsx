/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ArrowRight, Monitor, Compass } from 'lucide-react';
import { QUICK_BOOKMARKS } from '../data/desktopSearchSites';

interface DesktopSearchHomeProps {
  onSearchOrNavigate: (query: string) => void;
  scale: number;
}

export const DesktopSearchHome: React.FC<DesktopSearchHomeProps> = ({
  onSearchOrNavigate,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchOrNavigate(searchInput.trim());
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-6 bg-[#121214] text-slate-100 select-none overflow-y-auto">
      <div className="w-full max-w-xl flex flex-col items-center gap-7 my-auto">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B71C1C] via-[#D32F2F] to-[#EF4444] flex items-center justify-center shadow-xl shadow-red-900/30 ring-1 ring-red-400/30">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Desktop <span className="text-[#EF4444]">Search</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Forced Desktop Viewport</span>
            <span aria-hidden="true">·</span>
            <span>Edge-to-Edge Chrome UI</span>
            <span aria-hidden="true">·</span>
            <span>25%–100% Zoom Engine</span>
          </div>
        </div>

        {/* Big Clean Chrome Omnibox */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center bg-[#1E1E22] hover:bg-[#25252A] focus-within:bg-[#1E1E22] border border-[#2D2D33] focus-within:border-[#D32F2F] focus-within:ring-2 focus-within:ring-[#D32F2F]/20 rounded-2xl px-4 py-3.5 shadow-xl transition-all">
            <Search className="w-5 h-5 text-[#EF4444] shrink-0 mr-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search or enter web address with Desktop Search"
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none font-medium"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
            {searchInput && (
              <button
                type="submit"
                className="ml-2 px-3 py-1.5 bg-[#D32F2F] hover:bg-[#E53935] text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-md shadow-red-900/30"
              >
                <span>Go</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Access Desktop Sites with Real Brand Logos and Colors */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Quick Desktop Sites</span>
            </span>
            <span className="text-[11px] text-slate-400">Desktop Mode On</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
            {QUICK_BOOKMARKS.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onSearchOrNavigate(bookmark.url)}
                className="flex flex-col items-center gap-2.5 p-3 bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D33] hover:border-[#D32F2F]/40 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25252A] group-hover:bg-[#2D2D35] flex items-center justify-center transition-colors border border-[#33333A] group-hover:border-[#D32F2F]/30 shadow-sm">
                  {bookmark.icon}
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-full">
                  {bookmark.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
