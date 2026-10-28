import React from 'react';
import { X, Share2, PlusSquare, Smartphone, Check } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onNativeInstall: () => void;
  isInstallable: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onNativeInstall,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#1E1E22] border border-[#2D2D33] rounded-2xl p-6 shadow-2xl relative text-slate-100 flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#B71C1C] flex items-center justify-center shadow-lg shadow-red-900/40">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Desktop Search</h3>
            <p className="text-xs text-slate-400">Add to Home Screen for Full-Screen Mode</p>
          </div>
        </div>

        {/* Instructions */}
        {isIOS ? (
          <div className="space-y-3 bg-[#121214] p-4 rounded-xl border border-[#2D2D33] text-xs leading-relaxed text-slate-300">
            <p className="text-slate-200 font-semibold mb-2">
              To open Desktop Search without Safari browser bars:
            </p>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D32F2F]/20 text-[#EF4444] font-bold flex items-center justify-center shrink-0 border border-[#D32F2F]/40">
                1
              </div>
              <p>
                Tap the <Share2 className="inline w-3.5 h-3.5 text-[#EF4444] mx-1" /> <strong>Share</strong> button in your Safari toolbar.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D32F2F]/20 text-[#EF4444] font-bold flex items-center justify-center shrink-0 border border-[#D32F2F]/40">
                2
              </div>
              <p>
                Scroll down and select <PlusSquare className="inline w-3.5 h-3.5 text-[#EF4444] mx-1" /> <strong>Add to Home Screen</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D32F2F]/20 text-[#EF4444] font-bold flex items-center justify-center shrink-0 border border-[#D32F2F]/40">
                3
              </div>
              <p>
                Tap <strong>Add</strong>. Launch from your Home Screen for edge-to-edge desktop web browsing!
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Install Desktop Search as a standalone application on your device for instant launch and edge-to-edge desktop viewport browsing.
            </p>
            <button
              onClick={() => {
                onNativeInstall();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-[#D32F2F] hover:bg-[#E53935] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Install Desktop Search App</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#121214] p-4 rounded-xl border border-[#2D2D33] text-xs text-slate-300">
            <p>
              Desktop Search is configured for standalone PWA mode. In your mobile browser menu, select <strong>Add to Home Screen</strong> or <strong>Install App</strong>.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#2D2D33] hover:bg-[#3D3D45] text-slate-200 font-medium rounded-xl text-xs transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
