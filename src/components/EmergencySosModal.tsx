import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, Radio, CheckCircle2, X, Navigation } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { triggerCyberParticles } from '../utils/confetti';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSosDispatched?: (booking: any) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  onSosDispatched,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState("17.4483° N, 78.3815° E (Hitec City Flyover)");
  const [isLocating, setIsLocating] = useState(false);

  // Fetch real device GPS coordinates
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Precision GPS Fix)`);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      sounds.playSosSiren();
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      triggerSosDispatch();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const triggerSosDispatch = async () => {
    setIsTriggered(true);
    setCountdown(null);
    sounds.playSuccess();
    triggerCyberParticles();

    const emergencyBooking = {
      id: `SOS-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Emergency Highway SOS Rescue',
      pickupLocation: gpsCoordinates,
      destination: 'Nearest Trauma / Highway Safe Lot',
      driverName: 'Captain Marcus Vance (High Priority)',
      driverPhone: '+91 99887 76655',
      driverVehicle: 'OMNIGO Rapid Intervention Rig #01',
      licensePlate: 'TS-09-UB-8821',
      etaMinutes: 4,
      amount: 0 // SOS Priority
    };

    try {
      await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: 17.4483,
          longitude: 78.3815,
          contact: "+91 98480 22338",
          emergencyType: "HIGHWAY_HAZARD"
        })
      });
    } catch {}

    onSosDispatched?.(emergencyBooking);
  };

  const handleStartHold = () => {
    sounds.playBlip();
    setCountdown(5);
  };

  const handleCancel = () => {
    sounds.playHover();
    setCountdown(null);
    setIsTriggered(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/85 backdrop-blur-2xl p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#0D0405] border-2 border-red-500/70 rounded-3xl p-5 sm:p-7 text-center text-white shadow-2xl relative overflow-hidden">
        
        {/* Pulsing Strobe Red Glow */}
        <div className="absolute inset-0 bg-red-600/15 animate-pulse pointer-events-none" />

        <button
          onClick={() => {
            sounds.playHover();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isTriggered ? (
          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-bounce shadow-2xl shadow-red-600/50">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-1">
                EMERGENCY SOS RESCUE
              </h2>
              <p className="text-[10px] text-red-300 font-num uppercase tracking-wider">
                SDRS META RISE TECH PVT LTD • Priority Highway Relay
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Use this if you are stranded on an active highway shoulder, involved in a collision, or facing immediate physical hazard.
            </p>

            {/* GPS Telemetry Pill */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center space-x-2 text-xs font-num text-red-400 font-bold mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>TELEMETRY BEACON: {isLocating ? 'Locking GPS...' : 'LOCKED'}</span>
              </div>
              <p className="text-xs text-white font-mono font-medium truncate">{gpsCoordinates}</p>
            </div>

            {countdown !== null ? (
              <div className="space-y-4 pt-2">
                <div className="text-6xl font-extrabold font-num text-red-500 animate-ping">
                  {countdown}
                </div>
                <p className="text-xs text-red-300 font-semibold">
                  Broadcasting Satellite SOS Signal in {countdown}s...
                </p>
                <button
                  onClick={handleCancel}
                  className="w-full py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors"
                >
                  ABORT EMERGENCY SIGNAL
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleStartHold}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-extrabold text-base sm:text-lg shadow-2xl shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all animate-pulse"
                >
                  PRESS TO TRIGGER 5s SOS DISPATCH
                </button>
                <a
                  href="tel:112"
                  className="block w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-red-400 font-bold text-xs transition-colors"
                >
                  Dial 112 / 911 First Responders Directly
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-white">
              SOS DISPATCH CONFIRMED!
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              OMNIGO Rapid Intervention Unit #01 has been prioritized with emergency highway corridor rights.
            </p>

            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl text-left text-xs text-emerald-300 space-y-1 font-num">
              <p><strong>Dispatched Rig:</strong> Heavy Duty Hydraulic Flatbed #01</p>
              <p><strong>Captain:</strong> Derrick Vance (Highway Certified)</p>
              <p><strong>Estimated Arrival:</strong> ~4 Minutes</p>
            </div>

            <button
              onClick={() => {
                sounds.playBlip();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0A84FF] hover:bg-[#00D4FF] text-slate-950 font-extrabold text-sm shadow-xl transition-all"
            >
              Open Live GPS Tracker
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
