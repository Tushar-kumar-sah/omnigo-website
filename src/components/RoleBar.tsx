import React from 'react';
import { AppRole } from '../types';
import { Shield, User, Truck, LayoutDashboard, Globe, AlertTriangle } from 'lucide-react';

interface RoleBarProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  onOpenSos: () => void;
  onOpenAi: () => void;
}

export const RoleBar: React.FC<RoleBarProps> = ({
  currentRole,
  onRoleChange,
  onOpenSos,
  onOpenAi
}) => {
  return (
    <div className="bg-[#051326] border-b border-white/10 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0 shadow-lg backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D98F] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10D98F]"></span>
        </span>
        <span className="font-num text-gray-300 font-semibold tracking-wider uppercase hidden sm:inline">OMNIGO LIVE NETWORK: ONLINE (4,810 UNITS READY)</span>
        <span className="font-num text-gray-300 font-semibold tracking-wider uppercase inline sm:hidden">OMNIGO LIVE: ONLINE</span>
      </div>

      {/* Role Switcher */}
      <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
        <button
          onClick={() => onRoleChange('GUEST')}
          title="Public Website"
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
            currentRole === 'GUEST'
              ? 'bg-[#0A84FF] text-white font-semibold shadow-md glow-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Public Website</span>
          <span className="hidden sm:inline md:hidden">Website</span>
        </button>

        <button
          onClick={() => onRoleChange('CUSTOMER')}
          title="Customer Dashboard"
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
            currentRole === 'CUSTOMER'
              ? 'bg-[#0A84FF] text-white font-semibold shadow-md glow-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Customer Dashboard</span>
          <span className="hidden sm:inline md:hidden">Customer</span>
        </button>

        <button
          onClick={() => onRoleChange('PARTNER')}
          title="Partner Driver App"
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
            currentRole === 'PARTNER'
              ? 'bg-[#00D4FF] text-[#081B33] font-bold shadow-md glow-cyan'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Partner Driver App</span>
          <span className="hidden sm:inline md:hidden">Partner</span>
        </button>

        <button
          onClick={() => onRoleChange('ADMIN')}
          title="Admin Command Center"
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
            currentRole === 'ADMIN'
              ? 'bg-[#10D98F] text-[#081B33] font-bold shadow-md glow-emerald'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Admin Command Center</span>
          <span className="hidden sm:inline md:hidden">Admin</span>
        </button>
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenAi}
          className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-white transition-all text-[11px] font-medium"
        >
          <span>🤖 AI Assistant</span>
        </button>
        <button
          onClick={onOpenSos}
          className="flex items-center space-x-1 bg-red-600/90 hover:bg-red-500 text-white px-2.5 py-1 rounded-full transition-all text-[11px] font-bold shadow-lg animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
};
