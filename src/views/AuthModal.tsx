import React, { useState } from 'react';
import { AppRole } from '../types';
import { OmnigoLogo } from '../components/OmnigoLogo';
import { User, Truck, ShieldCheck, Mail, Lock, Phone, ArrowRight, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRoleSuccess: (role: AppRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginRoleSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('CUSTOMER');
  const [email, setEmail] = useState('alex.rivera@omnigomobility.com');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleRoleSelect = (role: AppRole) => {
    sounds.playBlip();
    setSelectedRole(role);
    if (role === 'CUSTOMER') {
      setEmail('alex.rivera@omnigomobility.com');
    } else if (role === 'PARTNER') {
      setEmail('marcus.vance@omnigopartner.com');
    } else if (role === 'ADMIN') {
      setEmail('operations.admin@omnigomobility.com');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    onLoginRoleSuccess(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-2xl p-4 animate-fade-in">
      <div className="w-full max-w-md glass-modal rounded-3xl p-6 shadow-2xl relative text-white border border-[#00D4FF]/30">
        
        <button
          onClick={() => {
            sounds.playHover();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <OmnigoLogo size="lg" showText={true} showTagline={true} />
          <p className="text-[10px] text-gray-400 font-num uppercase mt-1">SDRS META RISE TECH PVT LTD Access Portal</p>
        </div>

        {/* 3-Role Demo Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => handleRoleSelect('CUSTOMER')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center space-y-1 ${
              selectedRole === 'CUSTOMER'
                ? 'bg-[#0A84FF] text-white shadow-lg glow-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('PARTNER')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center space-y-1 ${
              selectedRole === 'PARTNER'
                ? 'bg-[#00D4FF] text-slate-950 shadow-lg glow-cyan font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Tow Captain</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center space-y-1 ${
              selectedRole === 'ADMIN'
                ? 'bg-[#10D98F] text-slate-950 shadow-lg glow-emerald font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-num text-gray-300 font-semibold mb-1 uppercase">
              Authorized Identifier / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-num text-gray-300 font-semibold mb-1 uppercase">
              Security Access Key / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <span>SIGN IN TO {selectedRole} COCKPIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
