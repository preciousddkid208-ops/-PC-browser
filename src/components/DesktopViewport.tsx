/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DesktopViewportProps {
  url: string;
  searchQuery: string;
  isSearch: boolean;
  scale: number;
  isLoading: boolean;
  navKey: number;
  onNavigate: (url: string, isInternal?: boolean) => void;
  onReload: () => void;
}

export const DesktopViewport: React.FC<DesktopViewportProps> = ({
  url,
  searchQuery,
  isSearch,
  scale,
  isLoading,
  navKey,
  onNavigate,
  onReload,
}) => {
  const computeProxyUrl = (targetUrl: string, search: boolean, query: string) => {
    if (!targetUrl) return '';
    if (search) {
      const searchTarget = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      return `/api/proxy?url=${encodeURIComponent(searchTarget)}`;
    }
    return `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
  };

  const [proxyUrl, setProxyUrl] = useState(() => computeProxyUrl(url, isSearch, searchQuery));
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Synchronize internal navigation and real site messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && (event.data.type === 'DESKTOP_INTERNAL_NAVIGATE' || event.data.type === 'DESKTOP_SEARCH_NAVIGATE') && event.data.url) {
        onNavigate(event.data.url, true);
      }
      if (event.data && event.data.type === 'DESKTOP_DIRECT_FALLBACK' && event.data.url) {
        setProxyUrl(event.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate]);

  // Only recompute proxyUrl when external navigation occurs (navKey changes)
  useEffect(() => {
    setIframeLoaded(false);
    setHasError(false);
    setProxyUrl(computeProxyUrl(url, isSearch, searchQuery));
  }, [navKey]);

  const handleIframeError = () => {
    // If proxy failed, automatically switch to direct mobile residential load
    if (proxyUrl && proxyUrl.startsWith('/api/proxy') && url) {
      setProxyUrl(url);
    } else {
      setHasError(true);
    }
  };

  const handleRetryDirect = () => {
    if (url) {
      setHasError(false);
      setProxyUrl(url);
    }
  };

  // Viewport Scale Math:
  // Container expands inversely to (1 / scale) * 100%
  // Visual bounding box = (100% / scale) * scale = exactly 100% of parent!
  const inverseWidth = `${(1 / scale) * 100}%`;
  const inverseHeight = `${(1 / scale) * 100}%`;

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-[#121214] select-text">
      {/* Top Chrome Red Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-950 z-30 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#EF4444] via-[#F87171] to-[#EF4444] animate-[pulse_1s_ease-in-out_infinite] w-full" />
        </div>
      )}

      {/* Real Live Desktop Viewport (Live Google Search & Live Websites) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: inverseWidth,
          height: inverseHeight,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
        className="bg-[#121214]"
      >
        <iframe
          src={proxyUrl || url}
          title="Desktop Search Web Engine"
          allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; identity-credentials-get; microphone; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; storage-access; web-share"
          onLoad={() => {
            setIframeLoaded(true);
            setHasError(false);
          }}
          onError={handleIframeError}
          className="w-full h-full border-0 bg-[#121214]"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        />

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#121214] text-white text-center">
            <AlertCircle className="w-12 h-12 text-[#EF4444] mb-3" />
            <h3 className="text-xl font-bold">Connecting to Desktop Destination</h3>
            <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
              Rendering destination via Desktop Search real engine.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onReload}
                className="px-6 py-2.5 bg-[#D32F2F] hover:bg-[#E53935] text-white font-semibold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/40"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload in Desktop View</span>
              </button>
              <button
                onClick={handleRetryDirect}
                className="px-6 py-2.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-semibold rounded-xl text-sm flex items-center gap-2 cursor-pointer border border-[#3F3F46]"
              >
                <span>Direct Residential Load</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
