/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChromeTopBar } from './components/ChromeTopBar';
import { RedScaleSlider } from './components/RedScaleSlider';
import { DesktopViewport } from './components/DesktopViewport';
import { DesktopSearchHome } from './components/DesktopSearchHome';
import { ChromeToolBar } from './components/ChromeToolBar';
import { LandscapeSidePanel } from './components/LandscapeSidePanel';
import { PWAInstallModal } from './components/PWAInstallModal';
import { useOrientation } from './hooks/useOrientation';
import { usePWA } from './hooks/usePWA';

export default function App() {
  const orientation = useOrientation();
  const { isInstallable, isStandalone, isIOS, triggerInstall } = usePWA();

  // Navigation State
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // History Stack
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Viewport Scale (Default 40% for fitting 1280px-1440px desktop layouts on phone screens)
  const [scale, setScale] = useState(0.40);
  const [isScaleSliderOpen, setIsScaleSliderOpen] = useState(false);

  // PWA Modal
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Navigation Key to trigger external iframe reloads only when commanded by user/toolbar
  const [navKey, setNavKey] = useState(1);

  // Auto-fit calculation: calculate scale factor so 1280px desktop width fits inside window width
  const handleAutoFit = useCallback(() => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 393;
    const targetWidth = orientation === 'landscape' ? 1280 : 1200;
    const availableWidth = orientation === 'landscape' ? Math.max(300, screenWidth - 320) : screenWidth;
    const optimalScale = Math.min(1.0, Math.max(0.25, availableWidth / targetWidth));
    setScale(parseFloat(optimalScale.toFixed(2)));
  }, [orientation]);

  useEffect(() => {
    handleAutoFit();
  }, [handleAutoFit]);

  // Handle Search Query or URL Navigation
  const handleSearchOrNavigate = (rawInput: string, isInternal = false) => {
    const input = rawInput.trim();
    if (!input) return;

    setIsLoading(true);
    setIsHome(false);

    // Detect if input is a valid URL or search term
    const hasHttpPattern = /^https?:\/\//i.test(input);
    const hasDomainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(input);
    const hasIpPattern = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/i.test(input);

    let finalUrl = input;
    if (hasHttpPattern || hasDomainPattern || hasIpPattern) {
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      } else if (finalUrl.startsWith('http://') && !finalUrl.includes('localhost') && !finalUrl.includes('127.0.0.1')) {
        finalUrl = finalUrl.replace(/^http:\/\//i, 'https://');
      }
      setCurrentUrl(finalUrl);
      setIsSearch(false);
      setSearchQuery('');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
      finalUrl = searchUrl;
      setCurrentUrl(searchUrl);
      setSearchQuery(input);
      setIsSearch(true);
    }

    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      updated.push(finalUrl);
      return updated;
    });
    setHistoryIndex((prev) => prev + 1);

    // Only force iframe src reload if navigation was triggered externally (e.g. typing in omnibox or clicking home/back)
    if (!isInternal) {
      setNavKey((k) => k + 1);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handleUrlSync = (syncedUrl: string) => {
    if (syncedUrl && syncedUrl !== currentUrl && !syncedUrl.includes('/api/proxy')) {
      setCurrentUrl(syncedUrl);
    }
    setIsLoading(false);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prevUrl);
      if (prevUrl.includes('google.com/search?q=') || prevUrl.includes('bing.com/search?q=')) {
        setIsSearch(true);
        const qMatch = prevUrl.match(/q=([^&]+)/);
        setSearchQuery(qMatch ? decodeURIComponent(qMatch[1]) : '');
      } else {
        setIsSearch(false);
      }
      setNavKey((k) => k + 1);
    } else {
      setIsHome(true);
      setCurrentUrl('');
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(nextUrl);
      if (nextUrl.includes('google.com/search?q=') || nextUrl.includes('bing.com/search?q=')) {
        setIsSearch(true);
        const qMatch = nextUrl.match(/q=([^&]+)/);
        setSearchQuery(qMatch ? decodeURIComponent(qMatch[1]) : '');
      } else {
        setIsSearch(false);
      }
      setNavKey((k) => k + 1);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setNavKey((k) => k + 1);
    setTimeout(() => setIsLoading(false), 350);
  };

  const handleHome = () => {
    setIsHome(true);
    setCurrentUrl('');
    setSearchQuery('');
    setIsSearch(false);
  };

  const handleNewTab = () => {
    handleHome();
  };

  const currentUrlRef = React.useRef(currentUrl);
  currentUrlRef.current = currentUrl;
  const historyIndexRef = React.useRef(historyIndex);
  historyIndexRef.current = historyIndex;

  // Synchronize internal navigation messages from live pages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && (event.data.type === 'DESKTOP_INTERNAL_NAVIGATE' || event.data.type === 'DESKTOP_SEARCH_NAVIGATE') && event.data.url) {
        handleSearchOrNavigate(event.data.url, true);
      }
      if (event.data && event.data.type === 'DESKTOP_URL_SYNC' && event.data.url) {
        const syncedUrl = event.data.url;
        if (syncedUrl && syncedUrl !== currentUrlRef.current && !syncedUrl.includes('/api/proxy')) {
          setCurrentUrl(syncedUrl);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-[#18181B] text-slate-100 flex flex-col font-sans select-none">
      {/* LANDSCAPE MODE: Multi-Panel Side-by-Side Desktop Layout */}
      {orientation === 'landscape' ? (
        <div className="w-full h-full flex overflow-hidden">
          {/* Left Panel: Desktop Search Controls & Navigation */}
          <LandscapeSidePanel
            currentUrl={currentUrl}
            onSearchOrNavigate={handleSearchOrNavigate}
            isLoading={isLoading}
            canGoBack={historyIndex > 0 || !isHome}
            canGoForward={historyIndex < history.length - 1}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onReload={handleReload}
            onHome={handleHome}
            scale={scale}
            onScaleChange={setScale}
            onAutoFit={handleAutoFit}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            isStandalone={isStandalone}
          />

          {/* Right Panel: Expansive Desktop Viewport */}
          <main className="flex-1 h-full overflow-hidden relative flex flex-col bg-[#18181B] pr-safe">
            {isHome ? (
              <DesktopSearchHome
                onSearchOrNavigate={handleSearchOrNavigate}
                scale={scale}
              />
            ) : (
              <DesktopViewport
                url={currentUrl}
                searchQuery={searchQuery}
                isSearch={isSearch}
                scale={scale}
                isLoading={isLoading}
                navKey={navKey}
                onNavigate={handleSearchOrNavigate}
                onReload={handleReload}
              />
            )}
          </main>
        </div>
      ) : (
        /* PORTRAIT MODE: Clean Chrome Edge-to-Edge Mobile UI */
        <div className="w-full h-full flex flex-col overflow-hidden">
          {/* Clean Red Chrome Top Bar with Omnibox */}
          <ChromeTopBar
            currentUrl={currentUrl}
            onSearchOrNavigate={handleSearchOrNavigate}
            isLoading={isLoading}
            onReload={handleReload}
            onHome={handleHome}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            isStandalone={isStandalone}
          />

          {/* Expandable Red Zoom Slider */}
          {isScaleSliderOpen && (
            <RedScaleSlider
              scale={scale}
              onScaleChange={setScale}
              onAutoFit={handleAutoFit}
            />
          )}

          {/* Main 100% Edge-to-Edge Browser Viewport */}
          <main className="flex-1 min-h-0 w-full overflow-hidden relative flex flex-col bg-[#121214]">
            {isHome ? (
              <DesktopSearchHome
                onSearchOrNavigate={handleSearchOrNavigate}
                scale={scale}
              />
            ) : (
              <DesktopViewport
                url={currentUrl}
                searchQuery={searchQuery}
                isSearch={isSearch}
                scale={scale}
                isLoading={isLoading}
                navKey={navKey}
                onNavigate={handleSearchOrNavigate}
                onReload={handleReload}
              />
            )}
          </main>

          {/* Sleek Chrome Bottom Toolbar - Shifted down with 5 exact buttons */}
          <ChromeToolBar
            canGoBack={historyIndex > 0 || !isHome}
            canGoForward={historyIndex < history.length - 1}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onHome={handleHome}
            onNewTab={handleNewTab}
            scale={scale}
            onToggleScaleSlider={() => setIsScaleSliderOpen(!isScaleSliderOpen)}
            isScaleSliderOpen={isScaleSliderOpen}
          />
        </div>
      )}

      {/* PWA / iPhone Home Screen Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
        onNativeInstall={triggerInstall}
        isInstallable={isInstallable}
      />
    </div>
  );
}
