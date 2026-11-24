import React, { useState } from 'react';
import { AppRole } from '../types';
import { OmnigoLogo } from './OmnigoLogo';
import { OmniAiCharacter } from './OmniAiCharacter';
import { 
  Truck, UserCheck, Menu, X, ChevronRight, Zap, 
  Volume2, VolumeX, Radio, Cpu, Calculator, Activity 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentRole: AppRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenBookModal: () => void;
  onOpenAi: () => void;
  onOpenSos: () => void;
  onOpenTracker?: () => void;
  onRoleChange?: (role: AppRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenBookModal,
  onOpenAi,
  onOpenSos,
  onOpenTracker,
  onRoleChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const handleSoundToggle = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleNavClick = (tab: string) => {
    sounds.playBlip();
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'privacy') {
      window.history.pushState({}, '', '/privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'partner') {
      if (onRoleChange) {
        onRoleChange('PARTNER');
      } else {
        window.location.href = '/partner';
      }
    } else {
      const el = document.getElementById(tab);
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const getLinkClass = (tab: string) => {
    const isLinkActive = activeTab === tab;
    return `transition-all duration-300 py-1.5 border-b-2 font-medium text-xs xl:text-sm cursor-pointer ${
      isLinkActive 
        ? 'text-[#00D4FF] border-[#00D4FF] font-bold tracking-wide' 
        : 'text-gray-300 border-transparent hover:text-white hover:border-white/20'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-white/10 px-3 sm:px-6 lg:px-8 py-3 transition-all backdrop-blur-2xl bg-[#061426]/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <OmnigoLogo size="md" showText={true} showTagline={true} />
        </div>

        {/* Desktop Navigation Links */}
        {currentRole === 'GUEST' && (
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <button
              onClick={() => handleNavClick('home')}
              className={getLinkClass('home')}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={getLinkClass('services')}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('diagnostics')}
              className={getLinkClass('diagnostics')}
            >
              AI Diagnostics
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className={getLinkClass('calculator')}
            >
              Fare Calculator
            </button>
            <button
              onClick={() => handleNavClick('membership')}
              className={getLinkClass('membership')}
            >
              Membership
            </button>
            <button
              onClick={() => handleNavClick('fleet')}
              className={getLinkClass('fleet')}
            >
              Business Fleet
            </button>
            <button
              onClick={() => handleNavClick('partner')}
              className={getLinkClass('partner')}
            >
              Tow Captain Portal
            </button>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center space-x-2.5 xl:space-x-3">
          
          {/* Cyber Audio Synthesizer Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-full border transition-all text-xs flex items-center space-x-1.5 ${
              isMuted 
                ? 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200' 
                : 'bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF] shadow-sm glow-cyan'
            }`}
            title={isMuted ? 'Turn Sound FX On' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
            <span className="text-[10px] font-bold font-num uppercase pr-1">
              {isMuted ? 'SFX OFF' : 'SFX ON'}
            </span>
          </button>

          {/* Live Radar Tracker CTA */}
          {onOpenTracker && (
            <button
              onClick={() => {
                sounds.playBlip();
                onOpenTracker();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#10D98F]/15 border border-[#10D98F]/40 hover:border-[#10D98F] text-[#10D98F] text-xs font-bold transition-all shadow-md hover:scale-105"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Radar</span>
            </button>
          )}

          {/* OMNI-AI Online Assistant pill */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenAi();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#081B33] border border-[#00D4FF]/40 hover:border-[#00D4FF] text-sm text-gray-200 hover:text-white transition-all shadow-md group shrink-0"
          >
            <OmniAiCharacter size="sm" expression="friendly" showCapabilities={false} />
            <div className="text-left leading-tight pr-1">
              <span className="block text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">OMNI-AI</span>
              <span className="block text-[9px] text-[#10D98F] font-num font-semibold">Online Assistant</span>
            </div>
          </button>

          {/* Book Towing Now CTA */}
          <button
            onClick={() => {
              sounds.playSuccess();
              onOpenBookModal();
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] hover:from-[#00D4FF] hover:to-[#10D98F] text-slate-950 font-extrabold text-xs xl:text-sm transition-all shadow-lg shadow-[#0A84FF]/25 hover:shadow-[#00D4FF]/40 hover:scale-[1.02] shrink-0"
          >
            <Truck className="w-4 h-4" />
            <span>Book Towing Now</span>
          </button>

          {/* Account Login */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenAuth();
            }}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all shrink-0"
            title="Account Login / Sign Up"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Right Controls: Sound + Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-xl border text-xs ${
              isMuted ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]'
            }`}
            title="Toggle Sound FX"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-1 pb-3 text-left animate-fade-in">
          <button
            onClick={() => { handleNavClick('home'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'home' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { handleNavClick('services'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'services' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Services Catalog
          </button>
          <button
            onClick={() => { handleNavClick('diagnostics'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'diagnostics' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            AI Vehicle Diagnostics HUD
          </button>
          <button
            onClick={() => { handleNavClick('calculator'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'calculator' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Fare Estimator & Distance Calculator
          </button>
          <button
            onClick={() => { handleNavClick('membership'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'membership' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Membership Plans
          </button>
          <button
            onClick={() => { handleNavClick('fleet'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'fleet' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Business Fleet Solutions
          </button>
          <button
            onClick={() => { handleNavClick('partner'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-gray-200 text-xs font-semibold transition-colors"
          >
            Tow Captain Portal
          </button>
          <button
            onClick={() => { handleNavClick('privacy'); setMobileMenuOpen(false); }}
            className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'privacy' ? 'bg-[#0A84FF]/20 text-[#00D4FF] font-bold' : 'hover:bg-white/5 text-gray-200'
            }`}
          >
            Privacy Policy
          </button>

          {/* Quick Action Buttons in Drawer */}
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => { 
                sounds.playSuccess();
                onOpenBookModal(); 
                setMobileMenuOpen(false); 
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-xs text-center shadow-lg"
            >
              Request Tow Truck Now
            </button>
            {onOpenTracker && (
              <button
                onClick={() => {
                  sounds.playBlip();
                  onOpenTracker();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#10D98F]/20 border border-[#10D98F]/40 text-[#10D98F] font-bold text-xs text-center"
              >
                Track Live Rescue Radar
              </button>
            )}
            <button
              onClick={() => { 
                sounds.playBlip();
                onOpenAi(); 
                setMobileMenuOpen(false); 
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs text-center"
            >
              Ask OMNI-AI Assistant
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
