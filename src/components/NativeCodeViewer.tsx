import React, { useState } from 'react';
import { PLATFORM_DOCUMENTATIONS } from '../data/nativeCodeTemplates';
import { PlatformTarget, NativeCodeFile } from '../types/browser';
import {
  Copy,
  Check,
  FileCode,
  Terminal,
  Layers,
  Sparkles,
  Download,
  BookOpen,
} from 'lucide-react';

interface NativeCodeViewerProps {
  initialPlatform?: PlatformTarget;
  onExportAll: () => void;
}

export const NativeCodeViewer: React.FC<NativeCodeViewerProps> = ({
  initialPlatform = 'react-native',
  onExportAll,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformTarget>(initialPlatform);
  const currentDoc = PLATFORM_DOCUMENTATIONS.find((d) => d.platform === selectedPlatform)!;
  const [selectedFile, setSelectedFile] = useState<NativeCodeFile>(currentDoc.files[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'setup' | 'architecture'>('code');

  // Handle switching platform
  const handleSelectPlatform = (p: PlatformTarget) => {
    setSelectedPlatform(p);
    const newDoc = PLATFORM_DOCUMENTATIONS.find((d) => d.platform === p)!;
    setSelectedFile(newDoc.files[0]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Platform Selector Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {PLATFORM_DOCUMENTATIONS.map((doc) => (
            <button
              key={doc.platform}
              onClick={() => handleSelectPlatform(doc.platform)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === doc.platform
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{doc.icon}</span>
              <span>{doc.title.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onExportAll}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Files</span>
        </button>
      </div>

      {/* Main Platform Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentDoc.icon}</span>
              <h2 className="text-lg font-bold text-white tracking-tight">{currentDoc.title}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentDoc.subtitle}</p>
          </div>

          {/* Sub-Tabs: Code Files / Setup Guide / Architecture */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'code' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
            <button
              onClick={() => setActiveSubTab('setup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'setup' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
            <button
              onClick={() => setActiveSubTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'architecture' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Source Files View */}
      {activeSubTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left File Selector Column */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider px-3 py-1 uppercase">
              Project Files ({currentDoc.files.length})
            </span>
            {currentDoc.files.map((f) => (
              <button
                key={f.filepath}
                onClick={() => setSelectedFile(f)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                  selectedFile.filepath === f.filepath
                    ? 'bg-sky-500/15 border border-sky-500/40 text-white font-medium shadow-sm shadow-sky-500/10'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className={`w-3.5 h-3.5 ${selectedFile.filepath === f.filepath ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="font-mono truncate">{f.filename}</span>
                </div>
                <span className="text-[10px] text-slate-500 pl-5 truncate">{f.description}</span>
              </button>
            ))}
          </div>

          {/* Right Code Display Column */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Code Header Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {selectedFile.filepath}
                </span>
                <span className="text-[10px] bg-slate-800 text-sky-400 font-mono px-2 py-0.5 rounded">
                  {selectedFile.language}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 transition-colors cursor-pointer"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block with line numbering */}
            <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0a0f1d] text-slate-300 max-h-[620px] overflow-y-auto">
              <pre className="whitespace-pre">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Setup Guides */}
      {activeSubTab === 'setup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">
              Step-by-Step Setup & Run Instructions
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Follow these commands to spin up the forced desktop browser on your local machine, simulator, or physical phone.
            </p>
          </div>

          <div className="space-y-6">
            {currentDoc.setupGuide.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold text-sm flex items-center justify-center shrink-0 border border-sky-500/40">
                  {step.step}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                  <p className="text-xs text-slate-400">{step.explanation}</p>

                  {step.commands && step.commands.length > 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-sky-300 space-y-1">
                      {step.commands.map((cmd, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <span>{cmd}</span>
                          {!cmd.startsWith('#') && (
                            <button
                              onClick={() => navigator.clipboard.writeText(cmd)}
                              className="text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                              title="Copy command"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Architecture Deep-Dive */}
      {activeSubTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Engine Architecture & Technical Rationale</h3>
            <p className="text-xs text-slate-400 mt-1">
              Why forced desktop mode requires a multi-layered viewport rewrite and how the scale slider functions without coordinate drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. The User-Agent Trap</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Many developers believe changing <code className="text-sky-300">userAgent</code> alone enables desktop browsing. However, mobile browser engines still inspect physical screen width and adhere to responsive CSS media queries like <code className="text-amber-300">@media (max-width: 768px)</code>. As a result, websites remain locked in single-column mobile mode despite reporting macOS or Windows.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Viewport Meta Replacement</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We inject JavaScript at document creation to strip any <code className="text-slate-400">&lt;meta name="viewport"&gt;</code> and inject <code className="text-emerald-400">width=1280</code>. On Android, we set <code className="text-sky-300">useWideViewPort = true</code>; on iOS, we set <code className="text-sky-300">preferredContentMode = .desktop</code>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Seamless 25%-100% Zoom Scaling</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                A 1280px wide desktop layout exceeds a 393px phone screen by 3.25×. The interactive slider applies a CSS transform scale matrix with <code className="text-amber-300">transformOrigin: '0 0'</code> and an inverted body width <code className="text-amber-300">(1/scale * 100%)</code>. This shrinks the desktop layout seamlessly with zero horizontal clipping.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. Draggable Viewport Geometry</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Users can resize the browser frame using edge and corner handles. The Auto-Fit button calculates <code className="text-sky-300">scale = containerWidth / targetDesktopWidth</code>, automatically matching whatever frame size the user chose.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
