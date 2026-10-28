import React, { useState } from 'react';
import { DeviceConfig, DeviceType } from '../types/browser';
import { DEVICE_PROFILES } from '../data/userAgents';
import { Wifi, Battery, Signal, Smartphone, Tablet } from 'lucide-react';

interface MobileDeviceFrameProps {
  currentDevice: DeviceConfig;
  onSelectDevice: (device: DeviceConfig) => void;
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  currentDevice,
  onSelectDevice,
  children,
}) => {
  const [currentTime] = useState('9:41');

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      {/* Device Model Switcher Bar */}
      <div className="flex items-center gap-2 mb-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-1.5 rounded-xl text-xs">
        <span className="text-slate-400 font-medium px-2 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span>Device Target:</span>
        </span>
        {DEVICE_PROFILES.map((dev) => (
          <button
            key={dev.id}
            onClick={() => onSelectDevice(dev)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentDevice.id === dev.id
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold shadow-sm shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {dev.name}
          </button>
        ))}
      </div>

      {/* Realistic Mobile Device Shell */}
      <div
        style={{
          width: `${currentDevice.width}px`,
          height: `${currentDevice.height}px`,
        }}
        className={`relative bg-slate-950 border-[9px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ${currentDevice.bezelRadius} overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-slate-700/60`}
      >
        {/* Top Status Bar with Dynamic Island / Punch Hole */}
        <div className="w-full h-11 bg-slate-950 px-6 flex items-center justify-between text-xs font-semibold text-slate-200 shrink-0 z-40 select-none">
          {/* Left Time */}
          <span className="font-mono text-[13px]">{currentTime}</span>

          {/* Center Dynamic Island or Punch Hole */}
          {currentDevice.notchType === 'island' && (
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-emerald-950" />
            </div>
          )}

          {currentDevice.notchType === 'hole' && (
            <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-900 mx-auto" />
          )}

          {/* Right Status Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[10px] font-mono tracking-tighter">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Device Internal Screen (Where browser UI lives) */}
        <div className="flex-1 w-full flex flex-col bg-slate-950 overflow-hidden relative">
          {children}
        </div>

        {/* Bottom iOS Home Bar Indicator */}
        <div className="w-full h-5 bg-slate-950 flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
