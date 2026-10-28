import React, { useState, useEffect } from 'react';
import { Search, Lock, Globe, ArrowRight, X, Star, Sparkles } from 'lucide-react';
import { SAMPLE_DESKTOP_SITES, SampleSite } from '../data/sampleDesktopSites';

interface OmniboxProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  isLoading: boolean;
  onSelectSample: (site: SampleSite) => void;
}

export const Omnibox: React.FC<OmniboxProps> = ({
  currentUrl,
  onNavigate,
  isLoading,
  onSelectSample,
}) => {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [searchEngine, setSearchEngine] = useState<'google' | 'duckduckgo' | 'bing'>('google');

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let query = inputValue.trim();
    if (!query) return;

    // Check if input matches one of our sample sites
    const matchedSample = SAMPLE_DESKTOP_SITES.find(
      (s) => s.url.toLowerCase() === query.toLowerCase() || s.id.toLowerCase() === query.toLowerCase()
    );
    if (matchedSample) {
      onSelectSample(matchedSample);
      return;
    }

    if (!query.startsWith('http://') && !query.startsWith('https://')) {
      if (query.includes('.') && !query.includes(' ')) {
        query = `https://${query}`;
      } else {
        // Query search engine
        if (searchEngine === 'google') {
          query = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else if (searchEngine === 'duckduckgo') {
          query = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        } else {
          query = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        }
      }
    }
    onNavigate(query);
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-2.5 flex flex-col gap-2 relative z-30">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Omnibox input container */}
        <div
          className={`flex-1 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border transition-all ${
            isFocused ? 'border-sky-500 shadow-sm shadow-sky-500/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* SSL Lock */}
          <div className="flex items-center text-emerald-400 shrink-0" title="Secure TLS connection">
            <Lock className="w-3.5 h-3.5" />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search Google or enter web URL..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none truncate font-mono"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <button
              type="submit"
              className="text-sky-400 hover:text-sky-300 p-0.5 shrink-0 cursor-pointer"
              title="Navigate"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Quick Desktop Benchmark presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Desktop Benchmarks:</span>
        </span>
        {SAMPLE_DESKTOP_SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => onSelectSample(site)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-colors cursor-pointer border ${
              currentUrl === site.url
                ? 'bg-sky-500/15 border-sky-500/50 text-sky-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="mr-1">{site.favicon}</span>
            <span>{site.title.split('—')[0].trim()}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
