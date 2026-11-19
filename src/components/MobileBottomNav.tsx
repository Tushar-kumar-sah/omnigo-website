import React from 'react';
import { Home, Truck, AlertTriangle, Bot, Radio } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenBookModal: () => void;
  onOpenAi: () => void;
  onOpenSos: () => void;
  onOpenTracker: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigateTab,
  onOpenBookModal,
  onOpenAi,
  onOpenSos,
  onOpenTracker,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#040C18]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      
      {/* 1. Home */}
      <button
        onClick={() => {
          sounds.playHover();
          onNavigateTab('home');
        }}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-[#00D4FF]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Home</span>
      </button>

      {/* 2. Services */}
      <button
        onClick={() => {
          sounds.playHover();
          onNavigateTab('services');
        }}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
          activeTab === 'services' ? 'text-[#00D4FF]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Services</span>
      </button>

      {/* 3. CENTER EMERGENCY SOS ACTION BUTTON */}
      <button
        onClick={() => {
          sounds.playSosSiren();
          onOpenSos();
        }}
        className="flex flex-col items-center justify-center -mt-6 group select-none"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 p-[2px] shadow-2xl shadow-red-600/50 group-active:scale-95 transition-transform animate-pulse">
          <div className="w-full h-full bg-[#1A0507] rounded-full flex items-center justify-center border border-red-500/50">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>
        <span className="text-[9px] font-extrabold text-red-400 font-num tracking-wider uppercase mt-1">
          SOS RESCUE
        </span>
      </button>

      {/* 4. Live Radar / Tracker */}
      <button
        onClick={() => {
          sounds.playHover();
          onOpenTracker();
        }}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-gray-400 hover:text-white transition-colors"
      >
        <Radio className="w-5 h-5 text-[#10D98F] animate-pulse" />
        <span className="text-[10px] font-bold mt-0.5 text-gray-300">Live Radar</span>
      </button>

      {/* 5. AI Assistant */}
      <button
        onClick={() => {
          sounds.playBlip();
          onOpenAi();
        }}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-gray-400 hover:text-white transition-colors"
      >
        <Bot className="w-5 h-5 text-[#00D4FF]" />
        <span className="text-[10px] font-bold mt-0.5 text-gray-300">OMNI-AI</span>
      </button>

    </nav>
  );
};
