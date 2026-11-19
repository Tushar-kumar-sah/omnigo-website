import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Wrench, MessageSquare, Grid } from 'lucide-react';
import { OmniAiCharacter, OMNI_CAPABILITIES } from './OmniAiCharacter';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookingType?: (type: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedActions?: { label: string; type: string }[];
  time: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectBookingType
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'capabilities'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm OMNI-AI 👋\nYour smart mobility assistant. I'm here to help you anytime, anywhere.\nAre you experiencing a car breakdown, battery issue, flat tire, or tow dispatch request?",
      suggestedActions: [
        { label: "Book Tow Truck", type: "BOOK_TOW" },
        { label: "Roadside Help (Battery / Tire)", type: "BOOK_BATTERY" },
        { label: "Check Tow Fares & Quotes", type: "CHECK_FARES" },
        { label: "Emergency SOS Dispatch", type: "BOOK_EV" }
      ],
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeTab]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userLocation: "Current Highway Location"
        })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      if (!data || !data.reply) {
        throw new Error("Empty reply");
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        suggestedActions: data.suggestedActions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "OMNI-AI: I can dispatch our nearest Heavy Flatbed Tow unit or Mobile Battery Service vehicle right now. Would you like me to open the booking console for you?",
          suggestedActions: [
            { label: "Dispatch Flatbed Towing", type: "BOOK_TOW" },
            { label: "Request Battery Technician", type: "BOOK_BATTERY" }
          ],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType: string) => {
    if (onSelectBookingType) {
      if (actionType === 'BOOK_TOW' || actionType === 'CARGO_DELIVERY') onSelectBookingType('TOW_FLATBED');
      else if (actionType === 'BOOK_BATTERY' || actionType === 'ROADSIDE_HELP') onSelectBookingType('BATTERY_JUMP');
      else if (actionType === 'BOOK_TIRE') onSelectBookingType('FLAT_TIRE');
      else if (actionType === 'BOOK_EV') onSelectBookingType('EV_CHARGING');
      else if (actionType === 'SEND_PARCEL') onSelectBookingType('TOW_FLATBED');
      else if (actionType === 'CHECK_FARES') handleSendMessage("Give me an instant pricing estimate for 10 miles towing");
      else if (actionType === 'SUPPORT') handleSendMessage("Connect me to 24/7 emergency phone operator");
      
      if (['BOOK_TOW', 'BOOK_BATTERY', 'BOOK_TIRE', 'BOOK_EV', 'ROADSIDE_HELP'].includes(actionType)) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar bg-slate-950/25 p-2 sm:p-4 flex justify-center sm:justify-end items-start animate-fade-in">
      <div className="w-full max-w-[360px] bg-[#061426] border border-[#00D4FF]/30 rounded-3xl flex flex-col shadow-2xl overflow-visible my-4">
        
        {/* Drawer Header with OMNI-AI Character Avatar */}
        <div className="p-4 bg-gradient-to-r from-[#081B33] via-[#0A2647] to-[#081B33] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <OmniAiCharacter size="sm" expression="friendly" showCapabilities={false} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-base text-white">OMNI-AI Assistant</h3>
                <span className="bg-[#10D98F]/20 text-[#10D98F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#10D98F]/40 font-num">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-gray-300">Your Smart Mobility & Emergency Rescue Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-around bg-[#051326] p-1.5 border-b border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-[#0A84FF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('capabilities')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'capabilities'
                ? 'bg-[#0A84FF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>I Can Help You With</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'chat' ? (
          <>
            {/* Message Stream */}
            <div className="h-[260px] sm:h-[300px] overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start space-x-2.5 max-w-[90%]">
                    {msg.sender === 'ai' && (
                      <OmniAiCharacter size="sm" expression="helping" showCapabilities={false} className="shrink-0 mt-1" />
                    )}
                    <div
                      className={`rounded-2xl p-3.5 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-medium rounded-tr-none shadow-md ml-auto'
                          : 'bg-[#0A2647]/90 border border-white/10 text-gray-100 rounded-tl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          msg.sender === 'user' ? 'text-slate-900/70 font-semibold' : 'text-gray-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>

                  {/* Action Chip Buttons */}
                  {msg.suggestedActions && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pl-10 max-w-[90%]">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.type)}
                          className="text-xs px-3.5 py-1.5 rounded-xl bg-[#0A84FF]/20 hover:bg-[#0A84FF]/40 border border-[#0A84FF]/40 text-[#00D4FF] font-semibold transition-all flex items-center space-x-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#10D98F]" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-400 text-xs py-2 bg-white/5 px-3 rounded-xl w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
                  <span>OMNI-AI is thinking & analyzing live telemetry...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-[#051326] border-t border-white/10 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
              <span className="text-[11px] text-gray-400 uppercase font-num font-semibold whitespace-nowrap">Quick Test:</span>
              <button
                onClick={() => handleSendMessage("I need a tow truck near me")}
                className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10"
              >
                Tow Truck Near Me
              </button>
              <button
                onClick={() => handleSendMessage("My car battery died, need jumpstart")}
                className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10"
              >
                Dead Battery Jumpstart
              </button>
              <button
                onClick={() => handleSendMessage("Calculate fare quote for 15 miles tow")}
                className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10"
              >
                15 Mile Tow Fare
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#081B33] border-t border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to OMNI-AI..."
                className="flex-1 bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#0A84FF]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-bold hover:scale-105 disabled:opacity-50 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* "I CAN HELP YOU WITH" Capability Matrix View */
          <div className="h-[310px] sm:h-[352px] overflow-y-auto custom-scrollbar p-5 space-y-6 bg-slate-950/60">
            <div className="flex flex-col items-center text-center space-y-2">
              <OmniAiCharacter size="lg" expression="excited" showCapabilities={false} />
            </div>

            <OmniAiCharacter
              size="sm"
              showCapabilities={true}
              onSelectCapability={(capId) => {
                handleActionClick(capId);
                setActiveTab('chat');
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};
