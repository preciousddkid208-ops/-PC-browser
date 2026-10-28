import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';

interface RedScaleSliderProps {
  scale: number;
  onScaleChange: (newScale: number) => void;
  onAutoFit: () => void;
}

export const RedScaleSlider: React.FC<RedScaleSliderProps> = ({
  scale,
  onScaleChange,
  onAutoFit,
}) => {
  const percentage = Math.round(scale * 100);

  const presets = [
    { label: '25%', value: 0.25 },
    { label: '33%', value: 0.33 },
    { label: '50%', value: 0.50 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1.00 },
  ];

  return (
    <div className="w-full bg-[#18181B] border-t border-[#2D2D33] px-4 py-2.5 flex flex-col gap-2 select-none z-30 transition-all">
      {/* Top Label & Auto-Fit */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>Desktop Viewport Zoom:</span>
          </span>
          <span className="font-mono font-bold text-[#EF4444] text-sm">{percentage}%</span>
        </div>

        <button
          onClick={onAutoFit}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D32F2F]/15 hover:bg-[#D32F2F]/25 text-[#EF4444] border border-[#D32F2F]/40 text-xs font-semibold transition-colors cursor-pointer active:scale-95 shadow-sm"
          title="Fit full desktop width into phone screen without horizontal clipping"
        >
          <Sparkles className="w-3 h-3 text-[#EF4444]" />
          <span>Fit Desktop</span>
        </button>
      </div>

      {/* Main Red Track Range Slider */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onScaleChange(Math.max(0.25, parseFloat((scale - 0.05).toFixed(2))))}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#25252A] transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min="0.25"
            max="1.00"
            step="0.01"
            value={scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#2D2D33] rounded-lg appearance-none cursor-pointer accent-[#D32F2F] focus:outline-none"
          />
        </div>

        <button
          onClick={() => onScaleChange(Math.min(1.0, parseFloat((scale + 0.05).toFixed(2))))}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#25252A] transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Percentage Presets */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <div className="flex items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onScaleChange(preset.value)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                Math.abs(scale - preset.value) < 0.02
                  ? 'bg-[#D32F2F] text-white shadow-sm shadow-red-900/40'
                  : 'bg-[#25252A] text-slate-400 hover:text-white hover:bg-[#33333A]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-slate-400">
          {scale < 0.99 ? 'Desktop scaled to fit screen' : '100% Native Desktop Width'}
        </span>
      </div>
    </div>
  );
};
