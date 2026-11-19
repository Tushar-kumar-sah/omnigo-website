import React, { useEffect, useState, useRef } from 'react';
import { 
  Navigation, MapPin, Truck, Compass, Radio, Activity, 
  Layers, ZoomIn, ZoomOut, Maximize2, RefreshCw, Zap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CyberVectorMapProps {
  pickup: string;
  destination: string;
  driverName?: string;
  driverVehicle?: string;
  etaMinutes?: number;
  heightClass?: string;
}

export const CyberVectorMap: React.FC<CyberVectorMapProps> = ({
  pickup,
  destination,
  driverName = 'Captain Marcus Vance',
  driverVehicle = 'Ashok Leyland Hydraulic Flatbed #04',
  etaMinutes = 8,
  heightClass = 'h-[360px] sm:h-[440px]'
}) => {
  const [progress, setProgress] = useState(0.35); // 0 to 1 along path
  const [speed, setSpeed] = useState(44);
  const [radarPulse, setRadarPulse] = useState(true);
  const [mapMode, setMapMode] = useState<'RADAR' | 'SATELLITE' | 'INFRARED'>('RADAR');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Animate the vehicle traveling smoothly along the vector route
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.003;
        return next > 0.95 ? 0.15 : next;
      });
      setSpeed(Math.floor(40 + Math.random() * 8));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Compute curved SVG path points
  const p1 = { x: 80, y: 320 }; // Pickup (Origin)
  const p2 = { x: 260, y: 190 }; // Waypoint 1 (Expressway interchange)
  const p3 = { x: 440, y: 240 }; // Waypoint 2 (Flyover exit)
  const p4 = { x: 620, y: 90 };  // Destination

  // Cubic Bezier interpolation
  const getPointOnPath = (t: number) => {
    // 3 segments
    if (t < 0.33) {
      const u = t / 0.33;
      return {
        x: p1.x + (p2.x - p1.x) * u,
        y: p1.y + (p2.y - p1.y) * u,
        angle: Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)
      };
    } else if (t < 0.66) {
      const u = (t - 0.33) / 0.33;
      return {
        x: p2.x + (p3.x - p2.x) * u,
        y: p2.y + (p3.y - p2.y) * u,
        angle: Math.atan2(p3.y - p2.y, p3.x - p2.x) * (180 / Math.PI)
      };
    } else {
      const u = (t - 0.66) / 0.34;
      return {
        x: p3.x + (p4.x - p3.x) * u,
        y: p3.y + (p4.y - p3.y) * u,
        angle: Math.atan2(p4.y - p3.y, p4.x - p3.x) * (180 / Math.PI)
      };
    }
  };

  const vehiclePoint = getPointOnPath(progress);

  return (
    <div className={`relative w-full ${heightClass} bg-[#040C18] rounded-2xl sm:rounded-3xl border border-[#00D4FF]/30 overflow-hidden select-none shadow-2xl`}>
      
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.4s ease-out'
        }}
      />

      {/* Pulsing Concentric Radar Rings in Background */}
      {radarPulse && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full border border-[#00D4FF]/20 animate-ping opacity-25" />
          <div className="w-[500px] h-[500px] rounded-full border border-[#0A84FF]/10 animate-pulse opacity-20" />
        </div>
      )}

      {/* SVG Vector Roads & Route Layer */}
      <svg 
        viewBox="0 0 700 400" 
        className="w-full h-full absolute inset-0 preserve-3d"
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.4s ease-out' }}
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A84FF" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#10D98F" />
          </linearGradient>
        </defs>

        {/* Secondary City Arterials */}
        <path d="M 20 180 Q 200 150 400 160 T 680 120" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <path d="M 120 380 Q 300 300 450 350 T 650 300" stroke="rgba(255,255,255,0.06)" strokeWidth="5" fill="none" />
        <path d="M 260 20 L 260 380" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="6,6" fill="none" />
        <path d="M 440 20 L 440 380" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="6,6" fill="none" />

        {/* Primary Active Towing Route - Base Glow */}
        <path
          d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`}
          stroke="#00D4FF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.3"
        />

        {/* Primary Active Towing Route - Glowing Animated Dash */}
        <path
          d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`}
          stroke="url(#route-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12,8"
          fill="none"
          filter="url(#neon-glow)"
          className="animate-[dash_20s_linear_infinite]"
        />

        {/* Origin Pin (Pickup Location) */}
        <g transform={`translate(${p1.x}, ${p1.y})`}>
          <circle r="14" fill="#0A84FF" fillOpacity="0.25" className="animate-ping" />
          <circle r="8" fill="#0A84FF" />
          <circle r="4" fill="#FFFFFF" />
          <text x="-40" y="28" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Inter">
            PICKUP (STRANDED)
          </text>
        </g>

        {/* Destination Pin */}
        <g transform={`translate(${p4.x}, ${p4.y})`}>
          <circle r="14" fill="#10D98F" fillOpacity="0.25" className="animate-ping" />
          <circle r="8" fill="#10D98F" />
          <circle r="4" fill="#FFFFFF" />
          <text x="-45" y="-14" fill="#10D98F" fontSize="11" fontWeight="bold" fontFamily="Inter">
            DESTINATION / REPAIR
          </text>
        </g>

        {/* Live Moving Tow Vehicle Icon */}
        <g transform={`translate(${vehiclePoint.x}, ${vehiclePoint.y}) rotate(${vehiclePoint.angle})`}>
          {/* Radar Ping circle */}
          <circle r="20" fill="#00D4FF" fillOpacity="0.2" className="animate-ping" />
          {/* Vehicle Body Box */}
          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#00D4FF" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Cab windshield */}
          <rect x="4" y="-6" width="6" height="12" rx="2" fill="#081B33" />
          {/* Warning beacon */}
          <circle cx="-6" cy="0" r="2.5" fill="#FFD60A" className="animate-pulse" />
        </g>
      </svg>

      {/* Top Left: Live HUD Telemetry Widget */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2 pointer-events-auto">
        <div className="bg-[#051326]/90 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-2xl shadow-xl flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">{driverName}</span>
              <span className="text-[10px] bg-[#10D98F]/20 text-[#10D98F] font-num px-1.5 py-0.5 rounded font-bold">
                EN ROUTE
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-num">{driverVehicle}</p>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#051326]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-num text-gray-300 flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-[#00D4FF] animate-pulse" />
            <span>Speed: <strong className="text-white font-bold">{speed} km/h</strong></span>
          </div>
          <div className="bg-[#051326]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-num text-[#10D98F] flex items-center space-x-1.5">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>ETA: <strong className="font-bold">{etaMinutes} MINS</strong></span>
          </div>
        </div>
      </div>

      {/* Top Right: Map View Toggles & Zoom */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5 pointer-events-auto">
        <div className="bg-[#051326]/90 backdrop-blur-xl border border-white/15 p-1 rounded-xl flex items-center space-x-1 shadow-lg">
          <button
            onClick={() => {
              sounds.playBlip();
              setZoomLevel((z) => Math.min(z + 0.2, 1.8));
            }}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playBlip();
              setZoomLevel((z) => Math.max(z - 0.2, 0.8));
            }}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playHover();
              setRadarPulse(!radarPulse);
            }}
            className={`p-1.5 rounded-lg ${radarPulse ? 'text-[#00D4FF] bg-[#00D4FF]/10' : 'text-gray-400'}`}
            title="Toggle Radar Pulse"
          >
            <Radio className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Telemetry Strip */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-[#051326]/90 backdrop-blur-xl border border-white/15 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xl text-left">
        <div className="flex items-center space-x-2 text-xs truncate max-w-[70%]">
          <MapPin className="w-4 h-4 text-[#00D4FF] shrink-0" />
          <span className="text-gray-400 truncate">From: <strong className="text-white">{pickup}</strong></span>
          <span className="text-gray-500">➔</span>
          <span className="text-gray-400 truncate">To: <strong className="text-white">{destination}</strong></span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] font-num bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] px-2 py-0.5 rounded-md font-bold">
            GPS 3D LOCK: 14 SATS
          </span>
        </div>
      </div>

    </div>
  );
};
