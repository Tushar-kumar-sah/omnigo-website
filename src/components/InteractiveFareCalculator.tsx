import React, { useState } from 'react';
import { 
  Calculator, Truck, Navigation, ShieldCheck, Zap, 
  Clock, DollarSign, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InteractiveFareCalculatorProps {
  onDispatchWithDetails: (serviceId: string) => void;
}

interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  baseFare: number;
  perKm: number;
  serviceId: string;
}

const VEHICLE_TYPES: VehicleCategory[] = [
  {
    id: 'sedan',
    name: 'Sedan / Hatchback',
    subtitle: 'Standard Wheel-Lift or Flatbed',
    baseFare: 2000,
    perKm: 45,
    serviceId: 'TOW_FLATBED'
  },
  {
    id: 'luxury_ev',
    name: 'Luxury, EV & Sports Low-Clearance',
    subtitle: 'Ultra-low angle hydraulic soft straps',
    baseFare: 2500,
    perKm: 55,
    serviceId: 'TOW_FLATBED'
  },
  {
    id: 'suv',
    name: 'Heavy SUV & 4x4 AWD',
    subtitle: 'High-payload heavy-duty carrier',
    baseFare: 2800,
    perKm: 60,
    serviceId: 'TOW_FLATBED'
  },
  {
    id: 'motorcycle',
    name: 'Superbike / Motorcycle',
    subtitle: 'Custom dual-wheel lock clamp',
    baseFare: 1600,
    perKm: 40,
    serviceId: 'BIKE_TRANSPORT'
  },
  {
    id: 'commercial',
    name: 'Commercial Van & Bus',
    subtitle: 'Heavy recovery tandem axle',
    baseFare: 5500,
    perKm: 85,
    serviceId: 'FLEET_LOGISTICS'
  }
];

export const InteractiveFareCalculator: React.FC<InteractiveFareCalculatorProps> = ({
  onDispatchWithDetails
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('luxury_ev');
  const [distanceKm, setDistanceKm] = useState<number>(24);
  const [isRushPriority, setIsRushPriority] = useState<boolean>(true);
  const [isCoveredTransport, setIsCoveredTransport] = useState<boolean>(false);

  const vehicle = VEHICLE_TYPES.find((v) => v.id === selectedVehicle) || VEHICLE_TYPES[1];

  // Calculations
  const basePrice = vehicle.baseFare;
  const distancePrice = distanceKm * vehicle.perKm;
  const rushFee = isRushPriority ? 300 : 0;
  const coveredFee = isCoveredTransport ? 1200 : 0;
  const subtotal = basePrice + distancePrice + rushFee + coveredFee;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // Estimated ETA based on distance
  const etaMinutes = isRushPriority ? 8 : 14;

  return (
    <section id="calculator" className="py-12 sm:py-20 relative z-20 px-4 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10D98F]/15 border border-[#10D98F]/30 text-[#10D98F] text-xs font-bold font-num uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Zero Hidden Charges Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Live <span className="text-gradient-primary">Rescue Fare Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-2 leading-relaxed">
            Drag the distance slider and configure your vehicle type for real-time accurate towing & rescue estimates. Complete with nationwide GST compliance and digital invoice.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass-card p-4 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Left Column: Vehicle & Distance Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Vehicle Selection */}
          <div>
            <label className="block text-xs font-num font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              1. Choose Vehicle Classification:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VEHICLE_TYPES.map((v) => {
                const isSelected = selectedVehicle === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      sounds.playBlip();
                      setSelectedVehicle(v.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#0A2647] border-[#00D4FF] text-white shadow-lg glow-blue'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{v.name}</span>
                      <span className="text-[10px] font-num text-[#10D98F] font-bold">
                        ₹{v.baseFare} base
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">{v.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Distance Slider */}
          <div className="bg-[#05101E] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-num font-bold text-gray-400 uppercase tracking-wider">
                2. Rescue Transit Distance:
              </label>
              <div className="flex items-center space-x-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 px-3 py-1 rounded-xl">
                <Navigation className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span className="font-num text-sm sm:text-base font-extrabold text-[#00D4FF]">
                  {distanceKm} Kilometers
                </span>
              </div>
            </div>

            <input
              type="range"
              min="2"
              max="120"
              step="1"
              value={distanceKm}
              onChange={(e) => {
                setDistanceKm(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
            />

            <div className="flex justify-between text-[10px] text-gray-400 font-num">
              <span>Local Tow (2 km)</span>
              <span>City Cross-Town (25 km)</span>
              <span>Inter-City Corridor (120 km)</span>
            </div>
          </div>

          {/* 3. Add-on Options */}
          <div>
            <label className="block text-xs font-num font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              3. Service Priority & Protection Add-ons:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sounds.playBlip();
                  setIsRushPriority(!isRushPriority);
                }}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  isRushPriority
                    ? 'bg-[#10D98F]/15 border-[#10D98F] text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isRushPriority ? 'bg-[#10D98F] text-slate-950' : 'bg-white/10 text-gray-400'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Rapid 8-Min Rush ETA</span>
                    <span className="text-[10px] font-num text-[#10D98F] font-bold">+₹300</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Top-of-queue satellite dispatch assignment.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playBlip();
                  setIsCoveredTransport(!isCoveredTransport);
                }}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  isCoveredTransport
                    ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isCoveredTransport ? 'bg-[#00D4FF] text-slate-950' : 'bg-white/10 text-gray-400'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Enclosed Rig Shield</span>
                    <span className="text-[10px] font-num text-[#00D4FF] font-bold">+₹1,200</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Dust & weather proof luxury box carrier.</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Price Summary Box */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#05101E] border border-white/15 rounded-2xl p-5 sm:p-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-num font-bold text-gray-400 uppercase tracking-widest">
                ITEMIZED ESTIMATE
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-num text-[#10D98F]">
                <Clock className="w-3.5 h-3.5" />
                <span>Response ETA: ~{etaMinutes} Mins</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 pt-4 text-xs font-num">
              <div className="flex justify-between text-gray-300">
                <span>Base Dispatch & Rig Hooking ({vehicle.name}):</span>
                <span className="font-bold text-white">₹{basePrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Transit Distance ({distanceKm} km × ₹{vehicle.perKm}/km):</span>
                <span className="font-bold text-white">₹{distancePrice.toLocaleString()}</span>
              </div>

              {isRushPriority && (
                <div className="flex justify-between text-[#10D98F]">
                  <span>Rapid 8-Min Rush Priority:</span>
                  <span className="font-bold">+₹{rushFee}</span>
                </div>
              )}

              {isCoveredTransport && (
                <div className="flex justify-between text-[#00D4FF]">
                  <span>Enclosed Protective Carrier:</span>
                  <span className="font-bold">+₹{coveredFee}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400">
                <span>Integrated GST (18%) & Insurance:</span>
                <span className="font-bold text-gray-300">₹{gst.toLocaleString()}</span>
              </div>
            </div>

            {/* Grand Total Box */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-num uppercase tracking-wider block font-bold">
                  TOTAL ESTIMATED FARE
                </span>
                <span className="text-[10px] text-[#10D98F] font-num">
                  ✓ Instant Digital Receipt & Tax Invoice
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold font-num text-white">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Dispatch CTA */}
          <button
            onClick={() => {
              sounds.playSuccess();
              onDispatchWithDetails(vehicle.serviceId);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#10D98F] text-slate-950 font-extrabold text-sm transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <span>DISPATCH RESCUE RIG AT THIS RATE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </section>
  );
};
