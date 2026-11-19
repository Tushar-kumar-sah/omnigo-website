import React, { useState, useEffect } from 'react';
import { Radio, Truck, Zap, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LiveTelemetryTickerProps {
  onOpenLiveTracker?: () => void;
  onOpenSos?: () => void;
}

const DISPATCH_FEED = [
  { id: 'BK-88219', service: 'Flatbed Heavy Tow', loc: 'PVNR Expressway, Hyderabad', status: 'En Route', eta: '6m', icon: Truck, color: 'text-[#00D4FF]' },
  { id: 'BK-99104', service: 'Mobile EV Fast Charge', loc: 'Outer Ring Road, Bengaluru', status: 'Active (60kW)', eta: 'On Site', icon: Zap, color: 'text-[#10D98F]' },
  { id: 'BK-44211', service: 'Highway Collision Recovery', loc: 'Mumbai-Pune Expressway', status: 'Securing Scene', eta: '4m', icon: ShieldAlert, color: 'text-amber-400' },
  { id: 'BK-77521', service: 'Battery Diagnostic Boost', loc: 'Cyber Hub, Gurugram', status: 'Dispatched', eta: '9m', icon: Zap, color: 'text-[#0A84FF]' },
  { id: 'BK-33902', service: 'AWD Flatbed Tow', loc: 'Gachibowli Financial Dist', status: 'Hooked', eta: '12m', icon: Truck, color: 'text-[#00D4FF]' },
];

export const LiveTelemetryTicker: React.FC<LiveTelemetryTickerProps> = ({
  onOpenLiveTracker,
  onOpenSos,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeUnits, setActiveUnits] = useState(4812);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DISPATCH_FEED.length);
    }, 4500);

    const unitFluctuation = setInterval(() => {
      setActiveUnits((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(unitFluctuation);
    };
  }, []);

  const currentItem = DISPATCH_FEED[currentIndex];
  const Icon = currentItem.icon;

  return (
    <div className="bg-[#05101E]/90 border-b border-[#00D4FF]/20 px-3 sm:px-6 py-2 text-xs flex items-center justify-between overflow-hidden relative z-30 backdrop-blur-xl">
      {/* Background cyber scan line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/5 to-transparent pointer-events-none animate-pulse" />

      {/* Left: Live indicator + dynamic feed */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D98F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10D98F]"></span>
          </span>
          <span className="font-num text-[11px] font-bold text-gray-300 uppercase tracking-widest hidden sm:inline">
            LIVE RADAR
          </span>
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Ticker animated message */}
        <div 
          onClick={() => {
            sounds.playHover();
            onOpenLiveTracker?.();
          }}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity truncate group"
        >
          <span className="text-[10px] font-num font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00D4FF]">
            {currentItem.id}
          </span>
          <Icon className={`w-3.5 h-3.5 ${currentItem.color} shrink-0`} />
          <span className="text-gray-200 font-medium text-[11px] sm:text-xs truncate">
            {currentItem.service} • <span className="text-gray-400">{currentItem.loc}</span>
          </span>
          <span className="hidden md:inline-flex items-center text-[10px] font-num font-bold text-[#10D98F] bg-[#10D98F]/10 px-2 py-0.5 rounded-md border border-[#10D98F]/20">
            {currentItem.status} (ETA {currentItem.eta})
          </span>
        </div>
      </div>

      {/* Right: Metrics & Live Tracker CTA */}
      <div className="flex items-center space-x-2.5 shrink-0 ml-2">
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-gray-400 font-num">
          <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>Active Fleet:</span>
          <strong className="text-white font-bold">{activeUnits.toLocaleString()}</strong>
        </div>

        {onOpenLiveTracker && (
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenLiveTracker();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0A84FF]/20 hover:bg-[#0A84FF]/40 border border-[#0A84FF]/40 text-[#00D4FF] text-[10px] sm:text-xs font-bold transition-all hover:scale-105"
          >
            <span>Track Live Rescue</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
