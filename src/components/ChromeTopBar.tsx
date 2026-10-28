/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowRight,
  X,
  RotateCw,
  Home,
  Monitor,
  Share2,
} from 'lucide-react';

interface ChromeTopBarProps {
  currentUrl: string;
  onSearchOrNavigate: (query: string) => void;
  isLoading: boolean;
  onReload: () => void;
  onHome: () => void;
  onOpenInstallModal: () => void;
  isStandalone: boolean;
}

export const ChromeTopBar: React.FC<ChromeTopBarProps> = ({
  currentUrl,
  onSearchOrNavigate,
  isLoading,
  onReload,
  onHome,
  onOpenInstallModal,
  isStandalone,
}) => {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearchOrNavigate(inputValue.trim());
    }
  };

  return (
    <header className="w-full bg-[#D32F2F] text-white pt-safe shrink-0 shadow-md select-none z-40">
      {/* Top Chrome Brand Row */}
      <div className="flex items-center justify-between px-3.5 pt-2 pb-1.5 gap-2 text-xs">
        {/* Brand Wordmark & Icon */}
        <div
          onClick={onHome}
          className="flex items-center gap-2 cursor-pointer active:opacity-80"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shadow-inner">
            <Monitor className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-sm">
            Desktop Search
          </span>
        </div>

        {/* Right Actions: Home & Install to Home Screen */}
        <div className="flex items-center gap-1.5">
          {!isStandalone && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
              title="Add Desktop Search to Home Screen"
            >
              <Share2 className="w-3 h-3" />
              <span>Add to Home</span>
            </button>
          )}

          <button
            onClick={onHome}
            className="p-1.5 rounded-lg text-white hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            title="Desktop Search Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Omnibox Row */}
      <div className="px-3 pb-2.5 flex items-center gap-2">
        {/* Reload button */}
        <button
          onClick={onReload}
          className="p-2 rounded-xl text-white hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer shrink-0"
          title="Reload"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Chrome Address Bar / Omnibox */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div
            className={`flex items-center gap-2 bg-[#121214] rounded-xl px-3 py-2 border transition-all ${
              isFocused
                ? 'border-white shadow-lg ring-2 ring-white/20'
                : 'border-transparent hover:border-white/30'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search or enter web address with Desktop Search"
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none truncate font-medium"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />

            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <button
                type="submit"
                className="text-[#EF4444] hover:text-[#F87171] p-0.5 shrink-0 cursor-pointer"
                title="Search or Go"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
};
