import React, { useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { Truck, Navigation, Phone, CheckCircle2, DollarSign, Star, Radio, ShieldCheck, Key, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export const PartnerDashboardView: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState<any>({
    id: "TS-JOB-9921",
    customerName: "Alex Rivera",
    customerPhone: "+91 98480 22338",
    vehicleModel: "2024 Tesla Model Y Dual Motor",
    pickupLocation: "Charminar, Hyderabad",
    destination: "Gachibowli IT Corridor, Hyderabad",
    payout: 8500.00,
    distanceMiles: 22.8,
    otpCode: "8821"
  });
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showIncomingAlert, setShowIncomingAlert] = useState(false);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === activeJob.otpCode || enteredOtp === '8821') {
      setIsOtpVerified(true);
    } else {
      alert("Invalid Customer Check-In Code. Try 8821.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-white/10 bg-gradient-to-r from-[#061426] via-[#0A2647] to-[#061426]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Captain Marcus Vance
            </h1>
            <span className="bg-[#00D4FF]/20 text-[#00D4FF] text-[10px] sm:text-xs font-bold font-num px-3 py-1 rounded-full border border-[#00D4FF]/40">
              Ford F-550 Hydraulic Flatbed #04
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Commercial Operator License: <strong className="text-white">CA-TOW-99210-COMM</strong>
          </p>
        </div>

        {/* Online / Offline Toggle Switch */}
        <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-gray-300 font-num">DISPATCH AVAILABILITY:</span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              isOnline
                ? 'bg-[#10D98F] text-slate-950 glow-emerald shadow-lg'
                : 'bg-red-600/80 text-white'
            }`}
          >
            <Radio className={`w-4 h-4 ${isOnline ? 'animate-pulse' : ''}`} />
            <span>{isOnline ? 'ON DUTY (READY)' : 'OFF DUTY'}</span>
          </button>
        </div>
      </div>

      {/* Driver Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-num">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Today's Total Payout</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-[#10D98F]">₹28,500.00</span>
            <span className="text-xs text-gray-400">INR</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Completed Rescues</span>
          <div className="text-3xl font-extrabold text-white">6 Trips</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Customer Rating</span>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold text-[#00D4FF]">4.98</span>
            <span className="text-amber-400 text-sm">★★★★★</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Fleet Compliance</span>
          <div className="flex items-center space-x-1 text-[#10D98F] font-bold text-sm pt-2">
            <ShieldCheck className="w-5 h-5" />
            <span>100% Certified</span>
          </div>
        </div>
      </div>

      {/* Active Dispatch Navigation View */}
      {activeJob && isOnline ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white flex items-center space-x-2">
              <Truck className="w-5 h-5 text-[#00D4FF]" />
              <span>Current Navigation & Active Towing Job</span>
            </h3>
            <span className="text-xs text-[#10D98F] font-num font-bold">Payout: ₹{activeJob.payout.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Map */}
            <div className="lg:col-span-8">
              <InteractiveMap
                pickupLocation={activeJob.pickupLocation}
                destinationLocation={activeJob.destination}
                driverName="Marcus Vance (You)"
                etaMinutes={5}
                statusText="En route to Customer Pickup Location"
              />
            </div>

            {/* Right: Job Details & OTP Check-In */}
            <div className="lg:col-span-4 p-6 rounded-3xl glass-card border border-white/10 space-y-5">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[10px] text-gray-400 font-num uppercase font-bold block">Assigned Customer</span>
                <h4 className="font-heading font-bold text-lg text-white">{activeJob.customerName}</h4>
                <p className="text-xs text-[#00D4FF] font-num">{activeJob.vehicleModel}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 font-bold block">📍 Pickup:</span>
                  <p className="text-gray-200">{activeJob.pickupLocation}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">🏁 Dropoff Destination:</span>
                  <p className="text-gray-200">{activeJob.destination}</p>
                </div>
              </div>

              {/* OTP Checkin Form */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-gray-300 font-num block uppercase">
                  Customer 4-Digit Check-In OTP
                </span>
                
                {!isOtpVerified ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 8821"
                      className="w-full text-center tracking-widest font-mono text-lg py-2 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#10D98F]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#10D98F] text-slate-950 font-bold text-xs"
                    >
                      Verify & Start Hookup
                    </button>
                  </form>
                ) : (
                  <div className="p-3 rounded-xl bg-[#10D98F]/20 border border-[#10D98F]/40 text-[#10D98F] text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>OTP Verified! Vehicle Hooked Safely.</span>
                  </div>
                )}
              </div>

              <a
                href={`tel:${activeJob.customerPhone}`}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-[#00D4FF]" />
                <span>Call Customer Directly</span>
              </a>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl glass-card border border-white/10 text-center space-y-3">
          <Radio className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">Currently Off Duty</h3>
          <p className="text-xs text-gray-400">Toggle 'On Duty' above to start receiving instant automated dispatch jobs.</p>
        </div>
      )}

    </div>
  );
};
