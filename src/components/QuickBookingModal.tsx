import React, { useState, useEffect } from 'react';
import { 
  Truck, Zap, BatteryCharging, Disc, Key, Fuel, AlertTriangle, 
  MapPin, Navigation, X, ShieldCheck, Clock, Phone, Headset, Check, QrCode
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { decode } from '@googlemaps/polyline-codec';
import { SERVICES_CATALOG } from '../data/services';
import { CyberVectorMap } from './CyberVectorMap';
import { triggerCyberParticles } from '../utils/confetti';
import { sounds } from '../utils/soundEffects';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
  onBookingSuccess: (booking: any) => void;
}

const getCoordsFromLocation = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes("charminar")) return { lat: 17.3616, lng: 78.4747 };
  if (loc.includes("hitec") || loc.includes("hitech") || loc.includes("cyber")) return { lat: 17.4483, lng: 78.3815 };
  if (loc.includes("jubilee")) return { lat: 17.4246, lng: 78.4116 };
  if (loc.includes("gachibowli")) return { lat: 17.4401, lng: 78.3489 };
  if (loc.includes("kbr")) return { lat: 17.4065, lng: 78.4116 };
  if (loc.includes("begumpet") || loc.includes("airport")) return { lat: 17.4475, lng: 78.4678 };
  return { lat: 17.3616, lng: 78.4747 };
};

const POPULAR_LOCATIONS = [
  'Charminar Old City',
  'Hitec City Cyber Towers',
  'Gachibowli Financial Dist',
  'Jubilee Hills Check Post',
  'Begumpet Airport Expy'
];

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedService = 'TOW_FLATBED',
  onBookingSuccess
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState(preSelectedService);
  const [pickup, setPickup] = useState("Charminar, Hyderabad");
  const [destination, setDestination] = useState("Gachibowli IT Corridor, Hyderabad");
  const [vehicleModel, setVehicleModel] = useState("Suzuki Swift ZXi");
  const [phone, setPhone] = useState("+91 98480 22338");
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'STRIPE' | 'RAZORPAY' | 'UPI'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedKm, setEstimatedKm] = useState(30);
  const [showUpiQr, setShowUpiQr] = useState(false);

  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService);
    }
  }, [preSelectedService]);

  useEffect(() => {
    if (pickup.toLowerCase().includes("charminar") && destination.toLowerCase().includes("gachibowli")) {
      setEstimatedKm(30);
    } else {
      const distance = Math.max(5, (pickup.length * 4 + destination.length * 2) % 35 + 8);
      setEstimatedKm(distance);
    }
  }, [pickup, destination]);

  if (!isOpen) return null;

  const selectedService = SERVICES_CATALOG.find((s) => s.id === selectedServiceId) || SERVICES_CATALOG[0];
  const calculatedFare = selectedService.basePrice + (selectedService.perMilePrice * estimatedKm);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sounds.playBlip();

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedService.title,
          pickupLocation: pickup,
          destination: selectedService.perMilePrice > 0 ? destination : 'On-Site Rescue Spot',
          vehicleModel,
          customerPhone: phone,
          amount: calculatedFare
        })
      });

      const data = await response.json();
      if (data.booking) {
        sounds.playSuccess();
        triggerCyberParticles();
        onBookingSuccess(data.booking);
        onClose();
      }
    } catch (err) {
      console.error("Booking dispatch failed:", err);
      // Fallback local booking object
      const localBooking = {
        id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
        type: selectedService.title,
        pickupLocation: pickup,
        destination,
        vehicleModel,
        customerPhone: phone,
        amount: calculatedFare,
        driverName: 'Captain Marcus Vance',
        driverPhone: '+91 99887 76655',
        driverVehicle: 'Ashok Leyland Hydraulic Flatbed #04',
        licensePlate: 'TS-09-UB-8821',
        etaMinutes: 7,
      };
      sounds.playSuccess();
      triggerCyberParticles();
      onBookingSuccess(localBooking);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderServiceIcon = (id: string) => {
    switch (id) {
      case 'TOW_FLATBED': return <Truck className="w-5 h-5" />;
      case 'BATTERY_JUMP': return <Zap className="w-5 h-5" />;
      case 'EV_CHARGING': return <BatteryCharging className="w-5 h-5" />;
      case 'FLAT_TIRE': return <Disc className="w-5 h-5" />;
      case 'LOCKOUT': return <Key className="w-5 h-5" />;
      case 'FUEL_DELIVERY': return <Fuel className="w-5 h-5" />;
      case 'WINCHING': return <Truck className="w-5 h-5 rotate-180" />;
      case 'ACCIDENT_RECOVERY': return <AlertTriangle className="w-5 h-5" />;
      case 'BIKE_TRANSPORT': return <Truck className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const visibleServices = SERVICES_CATALOG.filter(s => s.id !== 'FLEET_LOGISTICS').slice(0, 9);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex justify-center items-end sm:items-center p-0 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar animate-fade-in">
      
      {/* Responsive Bottom-Sheet on Mobile, Centered Modal on Desktop */}
      <div className="w-full max-w-[100vw] sm:max-w-4xl xl:max-w-6xl bg-[#061426] border border-[#00D4FF]/40 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden font-sans text-left relative max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 shrink-0 bg-[#061426] flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] p-[1.5px] shadow-lg glow-cyan">
              <div className="w-full h-full bg-[#061426] rounded-[14px] flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#00D4FF]" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Instant Roadside Rescue Dispatch
              </h2>
              <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider font-num">
                SDRS META RISE TECH PVT LTD • Average response time: 8-12 minutes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
              <Headset className="w-4 h-4 text-[#10D98F] animate-pulse" />
              <div className="leading-none text-left">
                <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">24/7 Dispatch</span>
                <span className="text-[10px] text-white font-medium">Hotline Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playBlip();
                onClose();
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitBooking} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Services & Trip Form */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. SELECT RESCUE SERVICE */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-[#10D98F] text-slate-950 font-bold text-xs flex items-center justify-center font-num">1</span>
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Select Rescue Service
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {visibleServices.map((srv) => {
                      const isSelected = selectedServiceId === srv.id;
                      return (
                        <button
                          type="button"
                          key={srv.id}
                          onClick={() => {
                            sounds.playBlip();
                            setSelectedServiceId(srv.id);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between relative min-h-[88px] ${
                            isSelected
                              ? 'bg-[#0A2647] border-[#0A84FF] shadow-lg glow-blue text-white'
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-[#00D4FF] text-slate-950' : 'bg-white/10 text-gray-400'
                            }`}>
                              {renderServiceIcon(srv.id)}
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#10D98F] animate-ping" />
                            )}
                          </div>

                          <div>
                            <span className="font-bold text-xs text-white block truncate">{srv.title}</span>
                            <span className="font-num text-[11px] font-semibold text-[#10D98F] block">
                              From ₹{srv.basePrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. TRIP DETAILS */}
                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#10D98F] text-slate-950 font-bold text-xs flex items-center justify-center font-num">2</span>
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Trip & Contact Coordinates
                      </label>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] text-[#10D98F] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10D98F] animate-ping"></span>
                      <span>GPS Active</span>
                    </div>
                  </div>

                  {/* Quick Location Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-num text-gray-400">Quick Pick:</span>
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => {
                          sounds.playHover();
                          setPickup(loc);
                        }}
                        className="text-[10px] font-num font-semibold px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#00D4FF]/20 text-gray-300 hover:text-[#00D4FF] border border-white/10 transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Pickup Breakdown Spot
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#0A84FF] absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Dropoff Destination
                      </label>
                      <div className="relative">
                        <Navigation className="w-4 h-4 text-[#10D98F] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Vehicle Make & Model
                      </label>
                      <div className="relative">
                        <Truck className="w-4 h-4 text-[#00D4FF] absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Mobile Alert SMS Contact
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Cyber Vector Map & Summary */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                
                {/* Cyber Vector Map Preview */}
                <CyberVectorMap
                  pickup={pickup}
                  destination={destination}
                  etaMinutes={8}
                  heightClass="h-[200px] sm:h-[230px]"
                />

                {/* Fare Summary & Payment Tabs */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white">Live Fare Breakdown</span>
                    <span className="text-xs font-num font-bold text-[#10D98F]">~35 min transit</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 font-num uppercase block font-semibold">
                        TOTAL ESTIMATED FARE
                      </span>
                      <span className="text-[9px] text-[#00D4FF] font-num">
                        GST, Insurance & Hooking Included
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#10D98F] font-num">
                      ₹{calculatedFare.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-num font-bold text-gray-400 uppercase tracking-wider block">
                      Choose Payment Method:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['UPI', 'WALLET', 'STRIPE', 'RAZORPAY'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            sounds.playBlip();
                            setPaymentMethod(m);
                            if (m === 'UPI') setShowUpiQr(true);
                          }}
                          className={`py-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                            paymentMethod === m
                              ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] shadow-sm'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UPI QR Simulation Box */}
                  {paymentMethod === 'UPI' && (
                    <div className="bg-[#05101E] border border-emerald-500/30 p-2.5 rounded-xl flex items-center space-x-3 text-left">
                      <QrCode className="w-8 h-8 text-[#10D98F] shrink-0" />
                      <div className="text-[10px] leading-tight">
                        <span className="font-bold text-white block">Instant UPI QR & Apps</span>
                        <span className="text-gray-400 font-num">Pay via GPay, PhonePe, Paytm, or BHIM UPI upon dispatch</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>

          {/* Sticky Modal Bottom CTA Bar */}
          <div className="p-4 border-t border-white/10 bg-[#061426] shrink-0 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10D98F]" />
                <span>Zero Scratch Guarantee</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Response: 8-12 Min</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <span className="font-bold text-[#10D98F]">₹</span>
                <span>Transparent Rates</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <Headset className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>24/7 Live Relay</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-[#0A84FF]/25 hover:scale-[1.01] hover:shadow-[#00D4FF]/40 disabled:opacity-50 flex items-center justify-between px-4 sm:px-6"
            >
              <span>{isSubmitting ? 'TRANSMITTING SATELLITE DISPATCH...' : 'CONFIRM & DISPATCH RESCUE RIG NOW'}</span>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="bg-slate-950 text-white font-num font-bold px-3 py-1 rounded-xl text-xs sm:text-sm">
                  ₹{calculatedFare.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-950 font-bold text-base">&gt;</span>
              </div>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
