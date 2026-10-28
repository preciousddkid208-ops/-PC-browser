import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SampleSite } from '../data/sampleDesktopSites';
import { ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface ResizableWebContainerProps {
  containerWidth: number;
  containerHeight: number;
  onResize: (width: number, height: number) => void;
  scale: number;
  activeSample: SampleSite | null;
  customUrl: string;
  isDesktopMode: boolean;
  userAgent: string;
  maxAvailableWidth: number;
  maxAvailableHeight: number;
}

type DragHandleType = 'right' | 'left' | 'bottom' | 'bottom-right' | 'bottom-left' | null;

export const ResizableWebContainer: React.FC<ResizableWebContainerProps> = ({
  containerWidth,
  containerHeight,
  onResize,
  scale,
  activeSample,
  customUrl,
  isDesktopMode,
  userAgent,
  maxAvailableWidth,
  maxAvailableHeight,
}) => {
  const [activeDrag, setActiveDrag] = useState<DragHandleType>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [iframeError, setIframeError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleMouseDown = (type: DragHandleType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(type);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY,
      w: containerWidth,
      h: containerHeight,
    });
  };

  const handleTouchStart = (type: DragHandleType, e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    setActiveDrag(type);
    setDragStartPos({
      x: touch.clientX,
      y: touch.clientY,
      w: containerWidth,
      h: containerHeight,
    });
  };

  const onPointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!activeDrag) return;
      const dx = clientX - dragStartPos.x;
      const dy = clientY - dragStartPos.y;

      let newW = dragStartPos.w;
      let newH = dragStartPos.h;

      if (activeDrag === 'right') {
        newW = dragStartPos.w + dx * 2; // Symmetric from center
      } else if (activeDrag === 'left') {
        newW = dragStartPos.w - dx * 2;
      } else if (activeDrag === 'bottom') {
        newH = dragStartPos.h + dy;
      } else if (activeDrag === 'bottom-right') {
        newW = dragStartPos.w + dx * 2;
        newH = dragStartPos.h + dy;
      } else if (activeDrag === 'bottom-left') {
        newW = dragStartPos.w - dx * 2;
        newH = dragStartPos.h + dy;
      }

      // Constrain within device frame bounds
      const clampedW = Math.max(240, Math.min(maxAvailableWidth, Math.round(newW)));
      const clampedH = Math.max(200, Math.min(maxAvailableHeight, Math.round(newH)));
      onResize(clampedW, clampedH);
    },
    [activeDrag, dragStartPos, maxAvailableWidth, maxAvailableHeight, onResize]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeDrag) {
        onPointerMove(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => {
      if (activeDrag) setActiveDrag(null);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (activeDrag && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => {
      if (activeDrag) setActiveDrag(null);
    };

    if (activeDrag) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeDrag, onPointerMove]);

  // Scaled dimensions formula
  // In production WebViews:
  // transform: scale(s); transform-origin: 0 0;
  // width: (1/s) * 100%; height: (1/s) * 100%;
  const inverseScalePercent = `${(1 / scale) * 100}%`;

  return (
    <div className="relative flex-1 w-full flex items-center justify-center p-2 select-none overflow-hidden bg-slate-950/60">
      {/* Resizable Web View Frame */}
      <div
        ref={containerRef}
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
        }}
        className={`relative bg-white rounded-xl shadow-2xl border transition-all duration-75 overflow-hidden flex flex-col ${
          activeDrag ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        {/* Frame Top Tab / Identity Bar */}
        <div className="h-6 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
            <span className="font-medium text-slate-300 truncate">
              {activeSample ? activeSample.title.split('—')[0] : customUrl}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-sky-400 shrink-0">
            <span>{Math.round(containerWidth)}×{Math.round(containerHeight)}px</span>
            <span className="text-slate-600">|</span>
            <span>{Math.round(scale * 100)}% zoom</span>
          </div>
        </div>

        {/* Scaled Viewport Container */}
        <div className="relative flex-1 w-full h-full overflow-auto bg-slate-900">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              width: inverseScalePercent,
              minHeight: inverseScalePercent,
              pointerEvents: activeDrag ? 'none' : 'auto',
            }}
            className="transition-transform duration-75 ease-out origin-top-left"
          >
            {activeSample ? (
              // Realistic desktop rendered DOM
              <div
                dangerouslySetInnerHTML={{ __html: activeSample.htmlContent }}
                className="w-full min-h-full"
              />
            ) : customUrl ? (
              // External URL / Custom preview
              <div className="w-full h-full min-h-[900px] flex flex-col bg-slate-900 text-slate-200">
                <iframe
                  src={customUrl}
                  title="Web View Content"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="w-full h-[900px] border-0"
                  onError={() => setIframeError(true)}
                />
                {iframeError && (
                  <div className="p-6 bg-slate-800/90 text-center flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                    <p className="text-xs text-slate-300">
                      This website enforces strict <code className="text-sky-300">X-Frame-Options: SAMEORIGIN</code>.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      In the native iOS/Android apps, native WebViews load this directly with full desktop emulation!
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* --- INTERACTIVE DRAGGABLE RESIZE HANDLES --- */}

        {/* 1. Right Edge Handle */}
        <div
          onMouseDown={(e) => handleMouseDown('right', e)}
          onTouchStart={(e) => handleTouchStart('right', e)}
          className="absolute top-0 right-0 w-3 h-full cursor-ew-resize group flex items-center justify-center hover:bg-sky-400/20 active:bg-sky-400/30 transition-colors z-30"
          title="Drag to resize width"
        >
          <div className="w-1 h-8 rounded-full bg-slate-400 group-hover:bg-sky-400 transition-colors" />
        </div>

        {/* 2. Left Edge Handle */}
        <div
          onMouseDown={(e) => handleMouseDown('left', e)}
          onTouchStart={(e) => handleTouchStart('left', e)}
          className="absolute top-0 left-0 w-3 h-full cursor-ew-resize group flex items-center justify-center hover:bg-sky-400/20 active:bg-sky-400/30 transition-colors z-30"
          title="Drag to resize width"
        >
          <div className="w-1 h-8 rounded-full bg-slate-400 group-hover:bg-sky-400 transition-colors" />
        </div>

        {/* 3. Bottom Edge Handle */}
        <div
          onMouseDown={(e) => handleMouseDown('bottom', e)}
          onTouchStart={(e) => handleTouchStart('bottom', e)}
          className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize group flex items-center justify-center hover:bg-sky-400/20 active:bg-sky-400/30 transition-colors z-30"
          title="Drag to resize height"
        >
          <div className="h-1 w-8 rounded-full bg-slate-400 group-hover:bg-sky-400 transition-colors" />
        </div>

        {/* 4. Bottom-Right Corner Handle */}
        <div
          onMouseDown={(e) => handleMouseDown('bottom-right', e)}
          onTouchStart={(e) => handleTouchStart('bottom-right', e)}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize group flex items-end justify-end p-0.5 hover:bg-sky-400/30 active:bg-sky-400/50 rounded-br-xl transition-colors z-40"
          title="Drag corner to resize both width and height"
        >
          <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-sky-400 rounded-br" />
        </div>

        {/* 5. Bottom-Left Corner Handle */}
        <div
          onMouseDown={(e) => handleMouseDown('bottom-left', e)}
          onTouchStart={(e) => handleTouchStart('bottom-left', e)}
          className="absolute bottom-0 left-0 w-5 h-5 cursor-nesw-resize group flex items-end justify-start p-0.5 hover:bg-sky-400/30 active:bg-sky-400/50 rounded-bl-xl transition-colors z-40"
          title="Drag corner to resize both width and height"
        >
          <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-sky-400 rounded-bl" />
        </div>
      </div>

      {/* Floating Active Drag Dimension Tooltip */}
      {activeDrag && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-sky-400 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg border border-sky-400/40 z-50 pointer-events-none animate-pulse">
          Resizing Web Container: {Math.round(containerWidth)} × {Math.round(containerHeight)} px
        </div>
      )}
    </div>
  );
};
