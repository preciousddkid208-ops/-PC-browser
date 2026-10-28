import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Sparkles } from 'lucide-react';

interface ViewportScaleSliderProps {
  scale: number;
  onScaleChange: (newScale: number) => void;
  containerWidth: number;
  targetDesktopWidth: number;
  onAutoFit: () => void;
  onReset: () => void;
}

export const ViewportScaleSlider: React.FC<ViewportScaleSliderProps> = ({
  scale,
  onScaleChange,
  containerWidth,
  targetDesktopWidth,
  onAutoFit,
  onReset,
}) => {
  const percentage = Math.round(scale * 100);
  const virtualWidth = Math.round(containerWidth / scale);
  const isClippedAt100 = targetDesktopWidth > containerWidth && scale >= 0.95;

  const presets = [
    { label: '25%', value: 0.25 },
    { label: '33%', value: 0.33 },
    { label: '50%', value: 0.50 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1.00 },
  ];

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col gap-2 relative z-30">
      {/* Header Info Row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Viewport Scale:</span>
          </span>
          <span className="font-mono font-bold text-sky-400 text-sm">{percentage}%</span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            (Virtual: {virtualWidth}px wide)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAutoFit}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/40 text-sky-300 hover:bg-sky-500/25 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Automatically scale to fit target desktop width without clipping"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Auto-Fit ({Math.round((containerWidth / targetDesktopWidth) * 100)}%)</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
            title="Reset scale to 100%"
          >
            <RotateCcw className="w-3 h-3" />
            <span>100%</span>
          </button>
        </div>
      </div>

      {/* Main Range Slider with +/- icons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onScaleChange(Math.max(0.25, parseFloat((scale - 0.05).toFixed(2))))}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          />
        </div>

        <button
          onClick={() => onScaleChange(Math.min(1.0, parseFloat((scale + 0.05).toFixed(2))))}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Presets & Status Indicator */}
      <div className="flex items-center justify-between pt-0.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onScaleChange(preset.value)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                Math.abs(scale - preset.value) < 0.02
                  ? 'bg-sky-400 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="text-[11px]">
          {isClippedAt100 ? (
            <span className="text-amber-400 font-medium">
              ⚠️ Wide desktop site clipped at 100% · Drag slider down or tap Auto-Fit
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              ✓ Desktop layout rendered without clipping
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
