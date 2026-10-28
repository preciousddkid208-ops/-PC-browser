import React from 'react';
import { X, CheckCircle, Info, Copy, Check } from 'lucide-react';
import { USER_AGENT_PROFILES } from '../data/userAgents';
import { UserAgentProfile } from '../types/browser';

interface ViewportInspectorHUDProps {
  isOpen: boolean;
  onClose: () => void;
  containerWidth: number;
  containerHeight: number;
  scale: number;
  targetDesktopWidth: number;
  currentUserAgent: UserAgentProfile;
  onSelectUserAgent: (ua: UserAgentProfile) => void;
  isDesktopMode: boolean;
}

export const ViewportInspectorHUD: React.FC<ViewportInspectorHUDProps> = ({
  isOpen,
  onClose,
  containerWidth,
  containerHeight,
  scale,
  targetDesktopWidth,
  currentUserAgent,
  onSelectUserAgent,
  isDesktopMode,
}) => {
  const [copiedUa, setCopiedUa] = React.useState(false);

  if (!isOpen) return null;

  const virtualWidth = Math.round(containerWidth / scale);
  const virtualHeight = Math.round(containerHeight / scale);

  const copyUa = () => {
    navigator.clipboard.writeText(currentUserAgent.userAgentString);
    setCopiedUa(true);
    setTimeout(() => setCopiedUa(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Viewport Engine & User-Agent Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Real-Time Mathematical Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Physical Container:</span>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {Math.round(containerWidth)} × {Math.round(containerHeight)} px
              </div>
              <span className="text-[10px] text-slate-500">Rendered frame on mobile device</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Virtual Desktop Canvas:</span>
              <div className="text-base font-bold font-mono text-sky-400 mt-0.5">
                {virtualWidth} × {virtualHeight} px
              </div>
              <span className="text-[10px] text-slate-500">
                Effective resolution seen by website
              </span>
            </div>
          </div>

          {/* Scale & Transform Equation */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Transform Matrix & Scaling Formula:</span>
              <span className="font-mono font-bold text-emerald-400">{(scale * 100).toFixed(1)}%</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <div>transform: scale({scale.toFixed(3)});</div>
              <div>transform-origin: 0 0;</div>
              <div>width: {((1 / scale) * 100).toFixed(1)}%;</div>
              <div>height: {((1 / scale) * 100).toFixed(1)}%;</div>
            </div>
          </div>

          {/* User-Agent Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Emulated User-Agent Profile:</span>
              <button
                onClick={copyUa}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                {copiedUa ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUa ? 'Copied' : 'Copy UA String'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {USER_AGENT_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onSelectUserAgent(profile)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUserAgent.id === profile.id
                      ? 'bg-sky-500/10 border-sky-500/60 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-200 flex items-center gap-2">
                      <span>{profile.name}</span>
                      {profile.isDesktop ? (
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                          DESKTOP
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          MOBILE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-sm mt-0.5">
                      {profile.userAgentString}
                    </div>
                  </div>
                  {currentUserAgent.id === profile.id && (
                    <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Injected Viewport Meta Tag */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-semibold">Injected HTML Head Meta Tag:</span>
            <div className="font-mono text-[11px] text-amber-300 bg-slate-900 p-2 rounded border border-slate-800 overflow-x-auto whitespace-nowrap">
              &lt;meta name="viewport" content="width={targetDesktopWidth}, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"&gt;
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mobile browsers ignore desktop User-Agents unless this meta tag is rewritten to prevent single-column responsive collapsing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
