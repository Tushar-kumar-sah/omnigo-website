import React, { useState } from 'react';
import { 
  Bot, Sparkles, MessageSquare, Wrench, Truck, Package, Navigation, 
  CreditCard, Headphones, CheckCircle2, Zap, Shield, Heart, ArrowRight, X
} from 'lucide-react';

export type CharacterExpression = 'happy' | 'thinking' | 'surprised' | 'excited' | 'helping' | 'friendly';

interface OmniAiCharacterProps {
  expression?: CharacterExpression;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCapabilities?: boolean;
  onSelectCapability?: (action: string) => void;
  className?: string;
}

export const OMNI_CAPABILITIES = [
  { id: 'BOOK_TOW', label: 'Book Towing', icon: Truck, desc: 'Heavy flatbed & wheel-lift tow trucks' },
  { id: 'ROADSIDE_HELP', label: 'Roadside Help', icon: Wrench, desc: 'Battery jumpstart, flat tire, lockout' },
  { id: 'SEND_PARCEL', label: 'Send Parcel', icon: Package, desc: 'Express hot-shot local courier' },
  { id: 'CARGO_DELIVERY', label: 'Cargo Delivery', icon: Navigation, desc: 'Commercial payload & freight transport' },
  { id: 'TRACK_BOOKING', label: 'Track Booking', icon: Navigation, desc: 'Live GPS radar driver tracking' },
  { id: 'CHECK_FARES', label: 'Check Fares', icon: CreditCard, desc: 'Instant transparent mileage estimate' },
  { id: 'SUPPORT', label: '24/7 Support', icon: Headphones, desc: 'Direct emergency helpline operator' }
];

export const OmniAiCharacter: React.FC<OmniAiCharacterProps> = ({
  expression = 'friendly',
  size = 'md',
  showCapabilities = false,
  onSelectCapability,
  className = ''
}) => {
  const [currentExpr, setCurrentExpr] = useState<CharacterExpression>(expression);

  const expressionsList: { id: CharacterExpression; label: string; emoji: string }[] = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'thinking', label: 'Thinking', emoji: '🤔' },
    { id: 'surprised', label: 'Surprised', emoji: '😮' },
    { id: 'excited', label: 'Excited', emoji: '✊' },
    { id: 'helping', label: 'Helping', emoji: '☝️' },
    { id: 'friendly', label: 'Friendly', emoji: '👋' },
  ];

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    full: 'w-64 h-72 sm:w-80 sm:h-96'
  }[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      
      {/* 3D Character Illustration Avatar */}
      <div className={`relative ${sizeClasses} group transition-all duration-300`}>
        
        {/* Glow Aura Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A84FF] via-[#00D4FF] to-[#10D98F] rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity"></div>
        
        {/* Render 3D Pixar-Style Character SVG */}
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-[#0B2545] via-[#081B33] to-[#040E1A] border-2 border-[#00D4FF]/40 p-2 shadow-2xl overflow-hidden flex items-center justify-center">
          
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#1C1917" />
              </linearGradient>

              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>

              <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#0284C7" />
              </radialGradient>
            </defs>

            {/* Hoodie Body */}
            <path d="M 30 200 C 30 150 60 140 100 140 C 140 140 170 150 170 200 L 175 240 L 25 240 Z" fill="url(#hoodieGrad)" />
            
            {/* Neon Green & Blue Hoodie Trim Line */}
            <path d="M 65 140 Q 100 160 135 140" stroke="#10D98F" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 75 145 Q 100 168 125 145" stroke="#00D4FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* OMNIGO Logo on Hoodie Chest */}
            <circle cx="100" cy="180" r="14" fill="#030712" stroke="#00D4FF" strokeWidth="1.5" />
            <path d="M 100 170 Q 92 180 96 186 M 100 170 Q 108 180 104 186" stroke="#10D98F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="100" cy="180" r="3" fill="#00D4FF" />

            {/* Neck */}
            <rect x="88" y="125" width="24" height="25" rx="8" fill="url(#skinGrad)" />

            {/* Head Shape */}
            <rect x="55" y="50" width="90" height="85" rx="35" fill="url(#skinGrad)" />

            {/* Stylized Brown Hair */}
            <path d="M 45 60 C 45 25 70 15 100 15 C 130 15 155 25 155 60 C 150 40 125 35 100 35 C 75 35 50 40 45 60 Z" fill="url(#hairGrad)" />
            {/* Hair Tufts */}
            <path d="M 70 25 C 80 12 100 10 115 22 C 105 28 90 28 70 25 Z" fill="url(#hairGrad)" />
            <path d="M 120 20 C 135 15 150 25 152 40 C 140 32 128 30 120 20 Z" fill="url(#hairGrad)" />

            {/* Ears */}
            <circle cx="52" cy="90" r="10" fill="url(#skinGrad)" />
            <circle cx="148" cy="90" r="10" fill="url(#skinGrad)" />

            {/* Eyebrows */}
            {currentExpr === 'thinking' ? (
              <>
                <path d="M 68 68 Q 80 62 92 70" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 108 72 Q 120 62 132 68" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            ) : currentExpr === 'surprised' ? (
              <>
                <path d="M 68 60 Q 80 54 92 60" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 108 60 Q 120 54 132 60" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 68 66 Q 80 62 92 66" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 108 66 Q 120 62 132 66" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Eyes */}
            <circle cx="80" cy="84" r="9" fill="#FFFFFF" />
            <circle cx="120" cy="84" r="9" fill="#FFFFFF" />
            
            {/* Iris */}
            <circle cx={currentExpr === 'thinking' ? "78" : "80"} cy="84" r="5" fill="url(#eyeGlow)" />
            <circle cx={currentExpr === 'thinking' ? "118" : "120"} cy="84" r="5" fill="url(#eyeGlow)" />

            {/* Eye Pupil Sparkles */}
            <circle cx={currentExpr === 'thinking' ? "76" : "78"} cy="82" r="2" fill="#FFFFFF" />
            <circle cx={currentExpr === 'thinking' ? "116" : "118"} cy="82" r="2" fill="#FFFFFF" />

            {/* Nose */}
            <path d="M 100 88 Q 98 96 102 96" stroke="#EA580C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

            {/* Mouth Expressions */}
            {currentExpr === 'happy' || currentExpr === 'friendly' ? (
              <path d="M 78 106 Q 100 122 122 106 Z" fill="#991B1B" stroke="#78350F" strokeWidth="1.5" />
            ) : currentExpr === 'surprised' ? (
              <circle cx="100" cy="110" r="8" fill="#991B1B" />
            ) : currentExpr === 'thinking' ? (
              <path d="M 85 110 Q 100 106 115 112" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : currentExpr === 'excited' ? (
              <path d="M 75 104 Q 100 128 125 104 Z" fill="#DC2626" />
            ) : (
              <path d="M 80 108 Q 100 120 120 108" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            )}

            {/* Waving / Helping Hand Gesture in Foreground */}
            {currentExpr === 'friendly' && (
              <g transform="translate(140, 100)">
                <circle cx="15" cy="15" r="18" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
                <path d="M 8 5 L 8 -5 M 15 2 L 15 -8 M 22 5 L 22 -5" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}

            {currentExpr === 'helping' && (
              <g transform="translate(135, 90)">
                <path d="M 10 30 L 10 5" stroke="#FED7AA" strokeWidth="8" strokeLinecap="round" />
                <circle cx="10" cy="2" r="5" fill="#FED7AA" />
              </g>
            )}
          </svg>

          {/* Online Indicator Badge */}
          {size !== 'sm' && (
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-[#10D98F]/50 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#10D98F] animate-ping"></span>
              <span className="text-[9px] font-bold text-[#10D98F] font-num uppercase">Online</span>
            </div>
          )}

        </div>
      </div>

      {/* Name Title & Subtitle */}
      {size !== 'sm' && (
        <div className="text-center mt-3 space-y-0.5">
          <h4 className="font-heading font-extrabold text-base text-white tracking-wide flex items-center justify-center space-x-1.5">
            <span>OMNI-AI</span>
            <Sparkles className="w-4 h-4 text-[#00D4FF]" />
          </h4>
          <p className="text-[11px] text-[#00D4FF] font-num font-semibold uppercase tracking-wider">
            Your Smart Mobility Assistant
          </p>
        </div>
      )}

      {/* Expression Switcher Chips */}
      {size !== 'sm' && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-xs">
          {expressionsList.map((expr) => (
            <button
              key={expr.id}
              onClick={() => setCurrentExpr(expr.id)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all flex items-center space-x-1 font-medium ${
                currentExpr === expr.id
                  ? 'bg-[#0A84FF] border-[#00D4FF] text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{expr.emoji}</span>
              <span>{expr.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* "I CAN HELP YOU WITH" Grid (from user's photo) */}
      {showCapabilities && (
        <div className="w-full mt-6 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-num font-bold text-gray-300 uppercase tracking-wider">
              I CAN HELP YOU WITH
            </span>
            <span className="text-[10px] text-[#10D98F] font-bold uppercase font-num">
              Instant Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OMNI_CAPABILITIES.map((cap) => {
              const IconComp = cap.icon;
              return (
                <button
                  key={cap.id}
                  onClick={() => onSelectCapability && onSelectCapability(cap.id)}
                  className="p-3 rounded-2xl bg-[#081B33]/80 hover:bg-[#0A2647] border border-white/10 hover:border-[#00D4FF]/50 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-slate-950 transition-colors shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs text-white group-hover:text-[#00D4FF] transition-colors">
                        {cap.label}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                        {cap.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00D4FF] transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
