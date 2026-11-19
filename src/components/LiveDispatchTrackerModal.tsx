import React, { useState, useEffect } from 'react';
import { 
  Truck, Phone, MessageSquare, ShieldCheck, MapPin, Navigation, 
  X, CheckCircle2, Clock, AlertTriangle, Share2, Star, Radio, Volume2
} from 'lucide-react';
import { CyberVectorMap } from './CyberVectorMap';
import { sounds } from '../utils/soundEffects';

interface LiveDispatchTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: {
    id?: string;
    type?: string;
    pickupLocation?: string;
    destination?: string;
    driverName?: string;
    driverPhone?: string;
    driverVehicle?: string;
    licensePlate?: string;
    etaMinutes?: number;
    amount?: number;
  } | null;
}

export const LiveDispatchTrackerModal: React.FC<LiveDispatchTrackerModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const [activeStage, setActiveStage] = useState<number>(2); // 0: Match, 1: Assign, 2: En Route, 3: Hook, 4: Delivered
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callAnswered, setCallAnswered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: "Hello! Captain Marcus here. I'm en route via PVNR Expressway. Your ETA is about 7 minutes.", time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const activeBooking = {
    id: booking?.id || 'BK-88219',
    type: booking?.type || 'Flatbed Tow Truck',
    pickupLocation: booking?.pickupLocation || 'Charminar, Hyderabad',
    destination: booking?.destination || 'Gachibowli IT Corridor, Hyderabad',
    driverName: booking?.driverName || 'Captain Marcus Vance',
    driverPhone: booking?.driverPhone || '+91 99887 76655',
    driverVehicle: booking?.driverVehicle || 'Ashok Leyland Dost Flatbed',
    licensePlate: booking?.licensePlate || 'TS-09-UB-8821',
    etaMinutes: booking?.etaMinutes || 7,
    amount: booking?.amount || 3100
  };

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      const ringTimer = setTimeout(() => {
        setCallAnswered(true);
      }, 2500);

      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(ringTimer);
        clearInterval(timer);
      };
    } else {
      setCallDuration(0);
      setCallAnswered(false);
    }
  }, [isCalling]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sounds.playBlip();
    const newMsg = { sender: 'user' as const, text: chatInput, time: 'Now' };
    setChatMessages((prev) => [...prev, newMsg]);
    const userText = chatInput;
    setChatInput('');

    // Simulated driver reply after 1.5s
    setTimeout(() => {
      let reply = "Copy that! I have my hazard lights flashing. See you in a few minutes.";
      if (userText.toLowerCase().includes("where")) {
        reply = "Just passing the toll gate right now, approaching your cross road.";
      } else if (userText.toLowerCase().includes("delay") || userText.toLowerCase().includes("traffic")) {
        reply = "Light traffic ahead, making great progress. Keep safely off the roadway!";
      }
      setChatMessages((prev) => [...prev, { sender: 'driver', text: reply, time: 'Just now' }]);
      sounds.playHover();
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    sounds.playBlip();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const stages = [
    { title: 'AI Match', desc: 'Nearest Tow Unit Located', done: activeStage >= 0 },
    { title: 'Captain Dispatched', desc: 'Equipment Confirmed', done: activeStage >= 1 },
    { title: 'En Route', desc: `${activeBooking.etaMinutes} min response time`, done: activeStage >= 2, current: activeStage === 2 },
    { title: 'Hooked & Secured', desc: 'Hydraulic ramp lock', done: activeStage >= 3 },
    { title: 'Safe Transit', desc: 'Delivered to Destination', done: activeStage >= 4 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-5xl bg-[#061426] border border-[#00D4FF]/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-white space-y-6 my-auto">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] flex items-center justify-center shadow-lg glow-cyan">
              <Truck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  Live Rescue Command HUD
                </h2>
                <span className="text-xs bg-[#10D98F]/20 text-[#10D98F] font-num font-bold px-2.5 py-0.5 rounded-full border border-[#10D98F]/30 animate-pulse">
                  ACTIVE MISSION
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-num">
                Booking Reference: <strong className="text-[#00D4FF]">{activeBooking.id}</strong> • {activeBooking.type}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Live GPS'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Progress Tracker */}
        <div className="bg-[#05101E] border border-white/10 p-3 sm:p-4 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {stages.map((stg, idx) => (
              <div
                key={stg.title}
                onClick={() => {
                  sounds.playBlip();
                  setActiveStage(idx);
                }}
                className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                  stg.current
                    ? 'bg-[#0A84FF]/25 border-[#00D4FF] shadow-lg glow-blue'
                    : stg.done
                    ? 'bg-[#10D98F]/10 border-[#10D98F]/30 text-gray-200'
                    : 'bg-white/5 border-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stg.done ? 'bg-[#10D98F] text-slate-950' : 'bg-white/20 text-gray-400'
                  }`}>
                    {stg.done ? '✓' : idx + 1}
                  </div>
                  <span className="text-[11px] font-bold truncate">{stg.title}</span>
                </div>
                <p className="text-[9px] text-gray-400 font-num truncate">{stg.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Interactive Vector Map + Live Driver Telemetry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Vector Map HUD */}
          <div className="lg:col-span-8">
            <CyberVectorMap
              pickup={activeBooking.pickupLocation}
              destination={activeBooking.destination}
              driverName={activeBooking.driverName}
              driverVehicle={activeBooking.driverVehicle}
              etaMinutes={activeBooking.etaMinutes}
              heightClass="h-[320px] sm:h-[400px]"
            />
          </div>

          {/* Right Column: Captain Card & Actions */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Captain Profile Card */}
            <div className="bg-[#05101E] border border-white/10 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D4FF] to-[#0A84FF] p-[2px] shadow-xl">
                  <div className="w-full h-full bg-[#081B33] rounded-[14px] flex items-center justify-center">
                    <Truck className="w-7 h-7 text-[#00D4FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{activeBooking.driverName}</h3>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-num font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.98 ★ (1,420+ Rescues)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-num">{activeBooking.licensePlate}</p>
                </div>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1 text-xs font-num">
                <div className="flex justify-between text-gray-300">
                  <span>Assigned Rig:</span>
                  <strong className="text-white">{activeBooking.driverVehicle}</strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Safety Gear:</span>
                  <strong className="text-[#10D98F]">Hydraulic Wheel Cradle</strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Fare:</span>
                  <strong className="text-[#00D4FF]">₹{activeBooking.amount.toLocaleString()}</strong>
                </div>
              </div>

              {/* Call & Chat Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setIsCalling(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#10D98F] to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Captain</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setIsChatOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center space-x-1.5 border border-white/10 transition-transform hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Quick Safety Instructions */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-left text-xs text-amber-200">
              <div className="flex items-center space-x-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>On-Site Road Safety Guideline:</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Turn on hazard lights. Keep steering wheels straight. If parked on highway shoulder, stand safely behind the guard rail until Captain Marcus arrives.
              </p>
            </div>

          </div>
        </div>

        {/* VoIP Call Overlay Simulation */}
        {isCalling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-[#081B33] border border-[#00D4FF]/40 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] p-[3px] shadow-2xl">
                <div className="w-full h-full bg-[#081B33] rounded-full flex items-center justify-center">
                  <Truck className="w-10 h-10 text-[#00D4FF]" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{activeBooking.driverName}</h3>
                <p className="text-xs text-gray-400 font-num">{activeBooking.driverPhone}</p>
                <p className="text-xs font-num font-bold text-[#10D98F] mt-2">
                  {callAnswered ? `Call in Progress (${callDuration}s)` : 'Dialing Encrypted Dispatch Relay...'}
                </p>
              </div>

              {/* Animated audio wave indicator */}
              <div className="flex items-center justify-center space-x-1 h-8">
                {[12, 28, 40, 24, 36, 16, 32, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#00D4FF] rounded-full animate-pulse"
                    style={{
                      height: callAnswered ? `${h}px` : '4px',
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  sounds.playBlip();
                  setIsCalling(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl"
              >
                End Call
              </button>
            </div>
          </div>
        )}

        {/* Live SMS Chat Window Simulation */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl p-4">
            <div className="w-full max-w-md bg-[#081B33] border border-[#00D4FF]/40 rounded-3xl flex flex-col shadow-2xl max-h-[85vh] overflow-hidden text-left">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#051326]">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeBooking.driverName}</h4>
                    <span className="text-[10px] text-[#10D98F] font-num font-bold">● Active in Vehicle</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar min-h-[260px] max-h-[340px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-medium'
                          : 'bg-white/10 text-gray-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 font-num mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#051326] flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message to Captain Marcus..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-bold text-xs"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
