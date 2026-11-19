import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Play, Pause, Film, Volume2, VolumeX, Maximize2, Sparkles, 
  ChevronRight, Smartphone, Truck, Shield, Navigation, MapPin, Zap, 
  Activity, CheckCircle2, RotateCcw, Upload, FileVideo
} from 'lucide-react';
import { OmnigoLogo } from './OmnigoLogo';

gsap.registerPlugin(ScrollTrigger);

export interface VideoChapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  badge: string;
  accentColor: string;
  stats: { label: string; value: string }[];
  keyFeatures: string[];
}

export const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    title: 'Cyber Tow Truck Highway Dispatch',
    subtitle: 'Neon City Patrol & Electric Light Path Navigation',
    description: 'A heavy hydraulic flatbed tow truck navigating city streets at night with electric light trails, location pin radar overlays, and direct automated route guidance.',
    tagline: 'EVERY JOURNEY • EVERY SERVICE',
    badge: 'CHAPTER 01 • HIGHWAY DISPATCH',
    accentColor: '#00D4FF',
    stats: [
      { label: 'Dispatch Rate', value: '< 60 Sec' },
      { label: 'Radar Radius', value: '25 Miles' },
      { label: 'Tow Load Cap', value: '18 Tons' }
    ],
    keyFeatures: [
      'Neon Electric Path Telemetry',
      'Zero-Scratch Hydraulic Flatbed Bed',
      'Live Location Pin Beacon Sync'
    ]
  },
  {
    id: 2,
    title: 'City Grid Telemetry & EV Charging Map',
    subtitle: '3D Infrastructure Grid & Emergency EV Points',
    description: '3D city grid visualization tracking active roadside rescues, mobile EV fast charging units, SOS emergency beacons, and highway interchange cloverleaf routing.',
    tagline: '3D INFRASTRUCTURE COMMAND',
    badge: 'CHAPTER 02 • CITY GRID TELEMETRY',
    accentColor: '#10D98F',
    stats: [
      { label: 'Active Rescues', value: '1,420+' },
      { label: 'EV Charger Output', value: '150 kW' },
      { label: 'SLA Arrival', value: '7.8 Mins' }
    ],
    keyFeatures: [
      '3D Highway Cloverleaf Routing',
      'Mobile DC Fast Charging Coverage',
      'Instant Emergency SOS Dispatch'
    ]
  },
  {
    id: 3,
    title: 'AI Driver Cockpit & Live Tracking HUD',
    subtitle: 'In-Cab HUD Dashboard & Real-time AI Assistant',
    description: 'Inside the driver cab with a glowing glass windshield HUD showing cargo deliveries, emergency SOS alerts, turn-by-turn navigation, and AI assistant prompt routing.',
    tagline: 'REAL-TIME COCKPIT HUD',
    badge: 'CHAPTER 03 • AI COCKPIT HUD',
    accentColor: '#0A84FF',
    stats: [
      { label: 'HUD Refresh', value: '120 Hz' },
      { label: 'AI Voice Precision', value: '99.4%' },
      { label: 'Cargo Telemetry', value: 'Live encrypted' }
    ],
    keyFeatures: [
      'Transparent Glass Windshield HUD',
      'AI Voice & Diagnostic Assistant',
      'Real-time Cargo & Payload Telemetry'
    ]
  },
  {
    id: 4,
    title: 'Floating 3D Mobile App Suite',
    subtitle: '3D Rotational Glass Interface & Instant Payments',
    description: 'Multiple iPhones floating smoothly in 3D space displaying onboarding screens, roadside rescue options, live GPS map tracking, instant payments, and booking confirmations.',
    tagline: 'ONE APP • EVERY MOVE',
    badge: 'CHAPTER 04 • 3D APP EXPERIENCE',
    accentColor: '#A855F7',
    stats: [
      { label: 'Booking Time', value: '2 Taps' },
      { label: 'Payment Method', value: 'Zero-Touch' },
      { label: 'App Rating', value: '4.95 ★' }
    ],
    keyFeatures: [
      'Single-Tap Emergency SOS Trigger',
      'Live Turn-by-Turn GPS Radar',
      'Instant Wallet & Card Checkout'
    ]
  },
  {
    id: 5,
    title: 'Enterprise Fleet Rescue & Door Badge Emblem',
    subtitle: 'Metallic OMNIGO Chrome Emblem & Heavy Rescue Truck',
    description: 'Heavy duty commercial rescue truck rolling smoothly with live phone HUD on flatbed, culminating in a close-up metallic OMNIGO logo engraved on truck door.',
    tagline: 'EVERY JOURNEY • EVERY MOVE • EVERY RESCUE',
    badge: 'CHAPTER 05 • METALLIC EMBLEM REVEAL',
    accentColor: '#F59E0B',
    stats: [
      { label: 'Fleet SLA', value: '99.9%' },
      { label: 'Heavy Winch Steel', value: '12,000 Lbs' },
      { label: 'Global Coverage', value: '24/7 Priority' }
    ],
    keyFeatures: [
      '3D Metallic OMNIGO Chrome Emblem',
      'Enterprise Fleet Telemetry API',
      'Commercial Winch & Heavy Recovery'
    ]
  }
];

interface CinematicStorytellingProps {
  onOpenBookModal: () => void;
  onOpenSos: () => void;
}

export const CinematicStorytelling: React.FC<CinematicStorytellingProps> = ({
  onOpenBookModal,
  onOpenSos
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  const currentChapter = VIDEO_CHAPTERS[activeChapterIndex];

  // Auto chapter progress timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveChapterIndex((idx) => (idx + 1) % VIDEO_CHAPTERS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas Motion Graphics Engine for 3D Video Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Cyber Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#061426');
      bgGrad.addColorStop(0.5, '#081B33');
      bgGrad.addColorStop(1, '#0A2647');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Perspective Line Grid
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
      ctx.lineWidth = 1;

      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Render specific Chapter Scene Animations
      if (activeChapterIndex === 0) {
        // Chapter 1: Winding Neon Trail + Cyber Tow Truck
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur = 15;

        ctx.moveTo(50, height * 0.8);
        for (let i = 0; i < width; i += 20) {
          const y = height * 0.7 + Math.sin(i * 0.01 + time * 2) * 25 + Math.cos(i * 0.02) * 15;
          ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Tow truck beacon node moving along path
        const truckX = (time * 120) % (width + 100) - 50;
        const truckY = height * 0.7 + Math.sin(truckX * 0.01 + time * 2) * 25;

        // Glowing Tow Truck Box
        ctx.fillStyle = '#0A84FF';
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.roundRect(truckX - 25, truckY - 18, 50, 32, 8);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#10D98F';
        ctx.beginPath();
        ctx.arc(truckX - 12, truckY + 14, 6, 0, Math.PI * 2);
        ctx.arc(truckX + 12, truckY + 14, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (activeChapterIndex === 1) {
        // Chapter 2: 3D Grid City & EV Radar Pulse
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;

        // Concentric Radar Rings
        for (let r = 1; r <= 3; r++) {
          const radius = ((time * 40 + r * 60) % 200) + 10;
          const alpha = 1 - radius / 210;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16, 217, 143, ${Math.max(0, alpha)})`;
          ctx.lineWidth = 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Active Pins
        const pins = [
          { x: centerX - 120, y: centerY - 60, label: 'EV FAST CHARGE' },
          { x: centerX + 140, y: centerY + 40, label: 'EMERGENCY SOS' },
          { x: centerX + 50, y: centerY - 90, label: 'FLATBED #01' }
        ];

        pins.forEach((pin) => {
          ctx.fillStyle = '#10D98F';
          ctx.shadowColor = '#10D98F';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(pin.x, pin.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '10px Manrope, sans-serif';
          ctx.fillText(pin.label, pin.x - 30, pin.y - 12);
        });

        ctx.restore();
      } else if (activeChapterIndex === 2) {
        // Chapter 3: Cockpit HUD Glass
        ctx.save();
        ctx.translate(width / 2, height / 2);

        // Rotating HUD Ring
        ctx.rotate(time * 0.2);
        ctx.strokeStyle = '#0A84FF';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0A84FF';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 1.5);
        ctx.stroke();

        ctx.restore();

        // HUD Text Overlay
        ctx.fillStyle = '#00D4FF';
        ctx.font = 'bold 12px Space Grotesk, sans-serif';
        ctx.fillText('LIVE TELEMETRY • CARGO DISPATCH 100%', width / 2 - 130, height / 2 + 120);
      } else if (activeChapterIndex === 3) {
        // Chapter 4: Floating 3D Phones
        ctx.save();
        const floatY = Math.sin(time * 2) * 12;

        ctx.translate(width / 2, height / 2 + floatY);

        // Glass Phone Body
        ctx.fillStyle = 'rgba(8, 27, 51, 0.85)';
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur = 30;

        ctx.beginPath();
        ctx.roundRect(-70, -120, 140, 240, 24);
        ctx.fill();
        ctx.stroke();

        // Phone Notch & Screen Content
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.roundRect(-20, -112, 40, 8, 4);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Space Grotesk, sans-serif';
        ctx.fillText('OMNIGO APP', -38, -60);

        ctx.fillStyle = '#10D98F';
        ctx.font = 'bold 10px Manrope, sans-serif';
        ctx.fillText('SOS DISPATCH READY', -48, -30);

        ctx.restore();
      } else if (activeChapterIndex === 4) {
        // Chapter 5: OMNIGO Chrome Emblem
        ctx.save();
        ctx.translate(width / 2, height / 2);

        const glowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
        glowGrad.addColorStop(0, 'rgba(0, 212, 255, 0.35)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.fill();

        // Metallic Pin Arc
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur = 25;

        ctx.beginPath();
        ctx.arc(0, -10, 50, Math.PI * 0.2, Math.PI * 1.8);
        ctx.stroke();

        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [activeChapterIndex]);

  // Handle custom file upload for user videos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 text-left max-w-7xl mx-auto px-4 lg:px-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 text-xs font-bold uppercase font-num">
            <Film className="w-3.5 h-3.5 text-[#10D98F]" />
            <span>CINEMATIC SCROLL STORYTELLING • 5 VIDEO REEL CHAPTERS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            OMNIGO In Motion
          </h2>

          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">
            Experience our 3D cyber tow truck fleet, live GPS radar telemetry, AI cockpit HUD, and metallic brand emblem showcase in layered motion.
          </p>
        </div>

        {/* Custom Video File Upload Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center space-x-2 shadow-lg">
            <Upload className="w-4 h-4 text-[#00D4FF]" />
            <span>{customVideoUrl ? 'Change Video' : 'Attach Custom MP4'}</span>
            <input type="file" accept="video/mp4,video/webm" onChange={handleFileUpload} className="hidden" />
          </label>

          {customVideoUrl && (
            <button
              onClick={() => setCustomVideoUrl(null)}
              className="px-3 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition-all"
            >
              Reset to 3D Reel
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Video & Storytelling Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: 3D Video Canvas Screen / Video Player */}
        <div className="lg:col-span-8 relative rounded-3xl p-1 bg-gradient-to-b from-[#00D4FF]/40 via-white/15 to-[#10D98F]/30 shadow-2xl glass-card overflow-hidden flex flex-col justify-between">
          <div className="relative w-full h-[380px] sm:h-[460px] rounded-[22px] bg-[#061426] overflow-hidden flex items-center justify-center">
            
            {/* Custom User MP4 Video Player OR Canvas 3D Reel Simulation */}
            {customVideoUrl ? (
              <video
                ref={videoRef}
                src={customVideoUrl}
                controls
                autoPlay
                loop
                muted={isMuted}
                className="w-full h-full object-cover rounded-[22px]"
              />
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover rounded-[22px]"
              />
            )}

            {/* Floating Top Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-[#00D4FF] border border-[#00D4FF]/40 uppercase tracking-widest font-num shadow-xl">
                {currentChapter.badge}
              </span>
            </div>

            {/* Center Brand Badge Overlay */}
            <div className="absolute top-4 right-4 z-20 opacity-80 hover:opacity-100 transition-opacity">
              <OmnigoLogo size="sm" showText={false} />
            </div>

            {/* Bottom HUD Control Bar */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent backdrop-blur-md flex flex-col space-y-3">
              
              {/* Scrubbing Timeline Progress Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                  setProgress(newProgress);
                }}
                className="w-full h-1.5 rounded-full bg-white/20 cursor-pointer overflow-hidden relative"
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: currentChapter.accentColor
                  }}
                ></div>
              </div>

              {/* Player Controls & Title */}
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#00D4FF]" />}
                  </button>

                  <div className="hidden sm:block text-left">
                    <p className="font-heading font-bold text-sm text-white">{currentChapter.title}</p>
                    <p className="text-[11px] text-gray-400">{currentChapter.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-num text-[11px] text-[#00D4FF] font-bold uppercase tracking-wider hidden sm:inline">
                    {currentChapter.tagline}
                  </span>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Interactive Chapter Navigation & Storytelling Highlights */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <p className="text-xs font-num font-bold text-[#00D4FF] uppercase tracking-widest">
              SELECT VIDEO REEL CHAPTER
            </p>

            <div className="space-y-2">
              {VIDEO_CHAPTERS.map((chapter, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setProgress(0);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#0A2647] border-[#00D4FF] shadow-lg text-white scale-[1.02]'
                        : 'bg-[#061426]/60 border-white/10 text-gray-400 hover:bg-[#061426] hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-num font-bold text-xs ${
                          isActive ? 'bg-[#00D4FF] text-slate-950' : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        0{chapter.id}
                      </div>

                      <div>
                        <p className={`font-heading font-bold text-xs ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {chapter.title}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          {chapter.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00D4FF]' : 'text-gray-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Specific Key Metrics & Features */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-num text-gray-400 font-semibold uppercase">Chapter Telemetry</span>
              <span className="font-bold text-[#10D98F] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4K HDR Storytelling</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {currentChapter.stats.map((st, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
                  <span className="block text-[9px] text-gray-400 uppercase font-num">{st.label}</span>
                  <span className="font-num font-extrabold text-white text-xs text-[#00D4FF]">{st.value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              {currentChapter.keyFeatures.map((ft, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10D98F] shrink-0" />
                  <span>{ft}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={onOpenBookModal}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-bold text-xs hover:scale-[1.02] transition-all flex items-center justify-center space-x-1.5 shadow-lg"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Dispatch Tow Truck</span>
              </button>

              <button
                onClick={onOpenSos}
                className="py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-xs transition-all flex items-center justify-center space-x-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
