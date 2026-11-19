import React, { useState } from 'react';
import { 
  Cpu, Activity, Zap, AlertTriangle, ShieldCheck, 
  Disc, Key, BatteryCharging, Truck, Volume2, ArrowRight, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AiDiagnosticsHudProps {
  onDispatchService: (serviceId: string) => void;
  onOpenAi: () => void;
}

interface DiagnosticScenario {
  id: string;
  title: string;
  icon: any;
  serviceId: string;
  serviceName: string;
  code: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  symptom: string;
  aiAnalysis: string;
  immediateAction: string;
  priceEstimate: string;
}

const SCENARIOS: DiagnosticScenario[] = [
  {
    id: 'battery',
    title: 'Rapid Clicking / No Crank',
    icon: Zap,
    serviceId: 'BATTERY_JUMP',
    serviceName: 'Battery Jump & Diagnostics',
    code: 'DTC-P0562 (Low System Voltage)',
    severity: 'HIGH',
    symptom: 'Starter solenoid clicking, dashboard lights flickering, engine fails to turn over.',
    aiAnalysis: 'Lead-acid / AGM 12V battery dropped below 10.4V threshold or alternator diode failure. Starter unable to engage flywheel.',
    immediateAction: 'Do not continue rapid cranking. Turn off HVAC, headlights and audio systems to conserve remaining cell reserve.',
    priceEstimate: '₹600 (Flat Fee • 12 min ETA)'
  },
  {
    id: 'tire',
    title: 'Highway Tire Blowout / Low PSI',
    icon: Disc,
    serviceId: 'FLAT_TIRE',
    serviceName: 'Roadside Flat Tire Rescue',
    code: 'TPMS-C0077 (Rapid Pressure Loss)',
    severity: 'CRITICAL',
    symptom: 'Violent steering wheel pull, thumping acoustic vibration, TPMS alert active.',
    aiAnalysis: 'Sidewall compromise or high-velocity puncture. Driving further risks alloy wheel rim destruction and suspension geometry damage.',
    immediateAction: 'Coast gently to safe shoulder without sudden heavy braking. Turn on hazards immediately.',
    priceEstimate: '₹800 (On-Site Swap)'
  },
  {
    id: 'ev',
    title: 'EV Traction Battery 0% Shutdown',
    icon: BatteryCharging,
    serviceId: 'EV_CHARGING',
    serviceName: 'Mobile EV Fast Charging',
    code: 'BMS-P0A7F (Hybrid/EV Pack Depleted)',
    severity: 'HIGH',
    symptom: 'Turtle mode engaged, 0 km range displayed, contactors opening.',
    aiAnalysis: 'High-voltage traction pack depleted below operating threshold. Vehicle locked in Park position.',
    immediateAction: 'Keep 12V auxiliary alive with hazard flashers. Deploy safety triangle 50m behind vehicle.',
    priceEstimate: '₹1,200 (DC Fast Boost)'
  },
  {
    id: 'overheat',
    title: 'Engine Steam / Temperature Pegged',
    icon: AlertTriangle,
    serviceId: 'TOW_FLATBED',
    serviceName: 'Flatbed Heavy Towing',
    code: 'DTC-P0217 (Coolant Overheat)',
    severity: 'CRITICAL',
    symptom: 'White steam from hood, sweet coolant odor, temperature needle in red zone.',
    aiAnalysis: 'Radiator hose rupture, water pump failure, or blown cylinder head gasket. Continuing to run will warp aluminum cylinder head.',
    immediateAction: 'Shut off engine immediately. NEVER unscrew the pressurized radiator cap while hot.',
    priceEstimate: '₹2,500 base + ₹50/km'
  },
  {
    id: 'lockout',
    title: 'Key Fob Locked Inside Cabin',
    icon: Key,
    serviceId: 'LOCKOUT',
    serviceName: 'Vehicle Lockout Rescue',
    code: 'BCM-B1020 (Key In Trunk Lockout)',
    severity: 'MODERATE',
    symptom: 'Smart key fob left inside trunk or cup holder; anti-theft immobilizer locked all doors.',
    aiAnalysis: 'Electronic proximity sensor obscured. Specialized non-marring air-wedge bypass required.',
    immediateAction: 'Do not attempt to pry door frames with metal screwdrivers to prevent paint and weatherseal damage.',
    priceEstimate: '₹1,000 (Damage-Free)'
  },
  {
    id: 'winch',
    title: 'Stuck in Mud / Ditch / Off-Road',
    icon: Truck,
    serviceId: 'WINCHING',
    serviceName: 'Winching & Mud Extraction',
    code: 'SYS-OFFROAD (Traction Loss)',
    severity: 'HIGH',
    symptom: 'Wheels spinning without forward propulsion, chassis grounded on embankment.',
    aiAnalysis: 'Zero coefficient of friction on drive wheels. Commercial hydraulic recovery winch required.',
    immediateAction: 'Cease throttle wheelspin to avoid digging chassis deeper into the mire.',
    priceEstimate: '₹1,500 base'
  }
];

export const AiDiagnosticsHud: React.FC<AiDiagnosticsHudProps> = ({
  onDispatchService,
  onOpenAi
}) => {
  const [selectedId, setSelectedId] = useState<string>('battery');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    sounds.playBlip();
    setSelectedId(id);
    setIsScanning(true);
    setScanProgress(0);
    sounds.playScan();

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 60);
  };

  return (
    <section className="py-12 sm:py-20 relative z-20 px-4 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A84FF]/15 border border-[#0A84FF]/30 text-[#00D4FF] text-xs font-bold font-num uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Cyber Diagnostics HUD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Identify Breakdown. <span className="text-gradient-primary">Deploy Exact Rescue.</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-2 leading-relaxed">
            Select what your vehicle is experiencing or run an instant acoustic symptom scan. Our OMNI-AI diagnostic engine translates mechanical failure codes into instantaneous emergency rescue dispatches.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playBlip();
            onOpenAi();
          }}
          className="self-start md:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-gray-200 hover:text-white transition-all shadow-md shrink-0"
        >
          <Volume2 className="w-4 h-4 text-[#00D4FF]" />
          <span>Custom AI Voice Diagnosis</span>
        </button>
      </div>

      {/* Main HUD Container */}
      <div className="glass-card border border-[#00D4FF]/30 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Scanning Grid Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent animate-pulse" />

        {/* 6 Symptom Selector Chips */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-[11px] font-num font-bold text-gray-400 uppercase tracking-wider mb-3">
            1. Select Reported Vehicle Symptom:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SCENARIOS.map((sc) => {
              const Icon = sc.icon;
              const isSelected = selectedId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] relative ${
                    isSelected
                      ? 'bg-[#0A2647] border-[#00D4FF] text-white shadow-lg glow-blue scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#00D4FF] text-slate-950' : 'bg-white/10 text-gray-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#10D98F] animate-ping" />
                    )}
                  </div>
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {sc.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Diagnostic Telemetry Console */}
        <div className="bg-[#05101E] border border-white/15 rounded-2xl p-4 sm:p-6 space-y-6">
          
          {/* Header Row: Diagnostic Code & Severity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#10D98F] animate-pulse" />
              <div>
                <span className="text-[10px] font-num text-gray-400 uppercase tracking-widest font-bold">
                  DIAGNOSTIC FAULT CODE
                </span>
                <h3 className="font-mono text-sm sm:text-base font-bold text-[#00D4FF]">
                  {activeScenario.code}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-num font-extrabold px-3 py-1 rounded-full border ${
                activeScenario.severity === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : activeScenario.severity === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
              }`}>
                SEVERITY: {activeScenario.severity}
              </span>
              <span className="text-[10px] font-num text-gray-400 hidden sm:inline">
                SCAN ACCURACY: 99.4%
              </span>
            </div>
          </div>

          {/* Diagnostic Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Symptom Detection */}
            <div className="space-y-1">
              <span className="text-[10px] font-num font-bold text-gray-400 uppercase tracking-wider">
                SYMPTOM DETECTED
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                {activeScenario.symptom}
              </p>
            </div>

            {/* Neural Root Cause Analysis */}
            <div className="space-y-1">
              <span className="text-[10px] font-num font-bold text-[#00D4FF] uppercase tracking-wider">
                AI ROOT CAUSE ANALYSIS
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {activeScenario.aiAnalysis}
              </p>
            </div>

            {/* Safety Protocol */}
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-num font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>IMMEDIATE SAFETY ADVISORY</span>
              </span>
              <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed mt-1">
                {activeScenario.immediateAction}
              </p>
            </div>

          </div>

          {/* Action Row: Recommended Dispatch & Rate */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] flex items-center justify-center shadow-lg">
                <Truck className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-num uppercase tracking-wider font-bold">
                  RECOMMENDED DISPATCH UNIT
                </span>
                <p className="text-sm font-bold text-white">
                  {activeScenario.serviceName} • <span className="text-[#10D98F]">{activeScenario.priceEstimate}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                onDispatchService(activeScenario.serviceId);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#10D98F] text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>DISPATCH THIS RESCUE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
