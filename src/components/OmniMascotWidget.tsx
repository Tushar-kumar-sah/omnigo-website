import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Truck, Wrench, Navigation, X, ShieldAlert, Zap, ChevronUp } from 'lucide-react';
import { OmniAiCharacter, CharacterExpression } from './OmniAiCharacter';

interface OmniMascotWidgetProps {
  onOpenAi: () => void;
  onOpenSos: () => void;
  onOpenBookModal: (serviceId?: string) => void;
}

export const OmniMascotWidget: React.FC<OmniMascotWidgetProps> = ({
  onOpenAi,
  onOpenSos,
  onOpenBookModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expression, setExpression] = useState<CharacterExpression>('friendly');
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end pointer-events-auto select-none">
      
      {/* Speech Bubble Tooltip */}
      <AnimatePresence>
        {showSpeechBubble && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 max-w-xs p-3.5 rounded-2xl bg-[#081B33]/95 border border-[#00D4FF]/40 text-white shadow-2xl backdrop-blur-2xl relative glow-blue"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-start space-x-2.5">
              <span className="text-base">👋</span>
              <div>
                <p className="text-xs font-bold text-[#00D4FF]">Hi! I'm OMNI-AI</p>
                <p className="text-[11px] text-gray-200 mt-0.5 leading-snug">
                  Need roadside rescue, towing, or instant fare quotes? Click me anytime!
                </p>
              </div>
            </div>

            {/* Speech bubble pointer tip */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#081B33] border-r border-b border-[#00D4FF]/40 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Quick Action Control Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="mb-3 w-80 p-4 rounded-3xl bg-[#081B33]/95 border-2 border-[#00D4FF]/50 text-white shadow-2xl backdrop-blur-2xl space-y-4 glow-blue"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10D98F] animate-ping"></span>
                <span className="text-xs font-bold font-num text-[#00D4FF]">OMNI-AI Active Assistant</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full bg-white/10 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <OmniAiCharacter size="sm" expression={expression} showCapabilities={false} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-200">
                  "Ready to dispatch nearest tow units within 8 mins!"
                </p>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenAi();
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Full AI Chat</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase font-num tracking-wider">Quick Actions</p>
              
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenBookModal('TOW_FLATBED');
                }}
                className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#00D4FF]" />
                  <span>Flatbed Tow Dispatch</span>
                </div>
                <span className="text-[10px] text-[#10D98F] font-num font-bold">~8 mins</span>
              </button>

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenBookModal('BATTERY_JUMP');
                }}
                className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-[#10D98F]" />
                  <span>Battery Jumpstart Service</span>
                </div>
                <span className="text-[10px] text-[#00D4FF] font-num font-bold">~₹2,500.00</span>
              </button>

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenSos();
                }}
                className="w-full p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-left text-xs font-bold text-red-300 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>Emergency Highway SOS</span>
                </div>
                <span className="text-[10px] text-red-400 font-num font-bold uppercase">Priority</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot Trigger Button with Framer Motion Breathing & Magnetic Hover */}
      <motion.button
        onClick={() => {
          setExpression('happy');
          setIsExpanded(!isExpanded);
        }}
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative group p-1.5 rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#081B33] to-[#040E1A] border-2 border-[#00D4FF] shadow-2xl glow-blue flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {/* Glowing Aura Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] opacity-30 group-hover:opacity-70 transition-opacity blur-md"></div>

        {/* Mascot Avatar */}
        <div className="relative z-10 flex items-center space-x-2 px-2 py-1">
          <OmniAiCharacter size="sm" expression={expression} showCapabilities={false} />
          
          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="text-xs font-extrabold text-white flex items-center space-x-1">
              <span>OMNI-AI</span>
              <Sparkles className="w-3 h-3 text-[#00D4FF]" />
            </span>
            <span className="text-[9px] text-[#10D98F] font-num font-bold uppercase tracking-wider">
              Ask Assistant
            </span>
          </div>
        </div>

        {/* Notification Ping Badge */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10D98F] border-2 border-[#081B33] flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
        </span>
      </motion.button>

    </div>
  );
};
