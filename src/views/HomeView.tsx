import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES_CATALOG, MEMBERSHIP_PLANS, TESTIMONIALS, FAQS } from '../data/services';
import { OmnigoLogo } from '../components/OmnigoLogo';
import { CinematicStorytelling } from '../components/CinematicStorytelling';
import { MagneticGlassCard } from '../components/MagneticGlassCard';
import { PremiumCarousel } from '../components/PremiumCarousel';
import { AiDiagnosticsHud } from '../components/AiDiagnosticsHud';
import { InteractiveFareCalculator } from '../components/InteractiveFareCalculator';
import { CyberCanvasBackground } from '../components/CyberCanvasBackground';
import { sounds } from '../utils/soundEffects';
import omnigoIntro from '../../assets/images/videos/omnigo-intro.mp4';
import { 
  Truck, Zap, Shield, Sparkles, MapPin, Navigation, Phone, ChevronRight, 
  CheckCircle2, ArrowRight, Star, Bot, Clock, HelpCircle, Building, Smartphone, 
  Activity, Play, Pause, Maximize2, Globe, Film, Image, X, ExternalLink
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  onOpenBookModal: (serviceId?: string) => void;
  onOpenAi: () => void;
  onOpenSos: () => void;
  onOpenAuth: () => void;
  activeTab?: string;
  setActiveTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenBookModal,
  onOpenAi,
  onOpenSos,
  onOpenAuth,
  activeTab,
  setActiveTab
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [quickPickup, setQuickPickup] = useState('');
  const [quickService, setQuickService] = useState('TOW_FLATBED');
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'video' | 'image';
    title: string;
    subtitle: string;
    src?: string;
  } | null>(null);

  // Refs for GSAP scroll triggered animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mediaReelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Custom Apple-style ultra-smooth response easing curve
      const premiumEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

      // 1. Primary Headlines Line-by-Line Staggered Reveal
      if (heroHeadlineRef.current) {
        gsap.from(heroHeadlineRef.current.children, {
          y: 32,
          opacity: 0,
          scale: 0.98,
          duration: 1.1,
          stagger: 0.12,
          ease: premiumEase,
        });
      }

      // 2. Layered 3D Parallax & Depth Scrub on Hero Visual
      if (heroVisualRef.current && heroRef.current) {
        // Entrance animation
        gsap.from(heroVisualRef.current, {
          y: 35,
          opacity: 0,
          scale: 0.95,
          duration: 1.2,
          ease: premiumEase,
          delay: 0.15,
        });

        // Layered Scrub Parallax on Scroll
        gsap.to(heroVisualRef.current, {
          y: -45,
          rotateX: 4,
          rotateY: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          }
        });
      }

      // 3. Services Grid Staggered Entrance
      if (servicesRef.current) {
        gsap.from(servicesRef.current.querySelectorAll('.service-card-item'), {
          y: 35,
          scale: 0.97,
          duration: 0.85,
          stagger: 0.07,
          ease: premiumEase,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: 'top 85%',
          }
        });
      }

      // 4. Cinematic Media Reel Showcase Scroll Entrance
      if (mediaReelRef.current) {
        gsap.from(mediaReelRef.current, {
          y: 40,
          duration: 1.0,
          ease: premiumEase,
          scrollTrigger: {
            trigger: mediaReelRef.current,
            start: 'top 85%',
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Programmatically trigger video play on focus changes to prevent browser stutter/pause
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    };
    playVideo();
    window.addEventListener('focus', playVideo);
    return () => window.removeEventListener('focus', playVideo);
  }, []);

  // Scroll Spy to update active tab in header automatically
  useEffect(() => {
    const sections = ['home', 'services', 'diagnostics', 'calculator', 'how-it-works', 'membership', 'fleet'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset for header + role bar

      // If at the very top of the page
      if (window.scrollY < 100) {
        setActiveTab('home');
        return;
      }

      // Check each section bottom and top
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveTab]);

  return (
    <div ref={heroRef} className="space-y-24 pb-20 overflow-x-hidden relative">
      {/* Interactive Cyber Constellation Canvas */}
      <CyberCanvasBackground />
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 px-4 lg:px-8 bg-line-grid overflow-hidden">
        {/* Ambient Radial Glow Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#0A84FF]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#00D4FF]/15 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div ref={heroHeadlineRef} className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-[#0A84FF]/35 text-xs font-semibold text-[#00D4FF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-4 h-4 text-[#10D98F] animate-pulse" />
              <span>NEXT-GEN AI ROADSIDE & TOWING DISPATCH</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-6xl xl:text-7xl tracking-tight text-white leading-[1.08]">
              EVERY JOURNEY.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#00D4FF] to-[#10D98F]">
                EVERY MOVE.
              </span><br />
              EVERY RESCUE.
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              OMNIGO coordinates instant AI-powered heavy towing, mobile EV fast charging, battery boost, and fleet recovery. Sub-8 minute average dispatch across major transit corridors worldwide.
            </p>

            {/* Quick Dispatch Input Bar */}
            <div className="p-2.5 rounded-3xl glass-card border border-white/20 shadow-2xl bg-[#081B33]/85 backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-2 max-w-xl">
              <div className="flex-1 flex items-center space-x-2 px-3 w-full">
                <MapPin className="w-5 h-5 text-[#0A84FF] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter breakdown or pickup address..."
                  value={quickPickup}
                  onChange={(e) => setQuickPickup(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none py-2"
                />
              </div>

              <button
                onClick={() => onOpenBookModal(quickService)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-[#0A84FF]/30 hover:scale-[1.02] shrink-0 flex items-center justify-center space-x-2"
              >
                <Truck className="w-4 h-4" />
                <span>DISPATCH NOW</span>
              </button>
            </div>

            {/* Quick Hero Features Pill Badge Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-300 font-num font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10D98F]" />
                <span>Zero Undercarriage Scratch Guarantee</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10D98F]" />
                <span>Live GPS Radar Tracking</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10D98F]" />
                <span>No Hidden Hookup Fees</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: 3D Futuristic Cyber Tow Truck Card with Scroll Parallax */}
          <div ref={heroVisualRef} className="lg:col-span-5 relative z-10">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#00D4FF]/50 via-white/15 to-[#10D98F]/40 shadow-2xl glass-card">
              <div className="relative rounded-[22px] bg-[#061426] overflow-hidden p-6 text-left space-y-6">
                
                {/* Visual Graphic: Video Player Container */}
                <div className="w-full h-60 rounded-2xl relative overflow-hidden border border-white/15 bg-slate-950 group/video flex items-center justify-center">
                  
                  {/* Neon Glowing Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0A84FF]/20 to-[#10D98F]/20 opacity-0 group-hover/video:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-2xl"></div>

                  <video
                    ref={videoRef}
                    key="hero-video-loop"
                    src={omnigoIntro}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover rounded-2xl opacity-80 group-hover/video:opacity-100 transition-opacity duration-300"
                  />
                  

                  {/* Playback indicator overlay on hover */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/video:opacity-100 flex items-center justify-center transition-all z-20 pointer-events-none">
                    <div className="p-3.5 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] shadow-lg glow-cyan scale-90 group-hover/video:scale-100 transition-all">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Floating Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-num uppercase font-semibold">Active Dispatch Status</span>
                    <span className="text-xs font-bold text-[#10D98F] flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10D98F] animate-ping"></span>
                      <span>Matching Nearest Driver</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Average Response ETA</span>
                      <span className="font-extrabold font-num text-white text-lg">7.8 Mins</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 uppercase">Verified Captains</span>
                      <span className="font-extrabold font-num text-[#00D4FF] text-lg">4,810 Active</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenAi}
                  className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Bot className="w-4 h-4 text-[#00D4FF]" />
                  <span>Start AI Diagnostic Assistant</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CINEMATIC VIDEO REEL & STORYTELLING SHOWCASE */}
      <section id="how-it-works" ref={mediaReelRef} className="py-8">
        <CinematicStorytelling
          onOpenBookModal={() => onOpenBookModal()}
          onOpenSos={onOpenSos}
        />
      </section>

      {/* 4. SERVICES GRID */}
      <section id="services" ref={servicesRef} className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-num text-[#00D4FF] font-bold uppercase tracking-widest">
            COMPREHENSIVE RESCUE CATALOG
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Precision Roadside & Towing Solutions
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm">
            From luxury sports cars to commercial EV fleets, OMNIGO delivers specialized equipment for every roadside challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {SERVICES_CATALOG.map((service) => (
            <div
              key={service.id}
              className="service-card-item p-6 rounded-3xl glass-card glass-card-hover border border-white/12 space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] p-[1.5px] shadow-lg glow-blue group-hover:glow-cyan transition-all">
                    <div className="w-full h-full bg-[#081B33] rounded-[14px] flex items-center justify-center">
                      <Truck className="w-6 h-6 text-[#00D4FF]" />
                    </div>
                  </div>

                  {service.badge && (
                    <span className="px-3 py-1 rounded-full bg-[#10D98F]/20 text-[#10D98F] border border-[#10D98F]/40 text-xs font-bold font-num">
                      {service.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#00D4FF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold font-num block">Base Fee</span>
                  <span className="font-extrabold text-lg text-white font-num">₹{service.basePrice}.00</span>
                </div>

                <button
                  onClick={() => onOpenBookModal(service.id)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#0A84FF] text-white font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <span>Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Cyber Diagnostics HUD */}
      <div id="diagnostics">
        <AiDiagnosticsHud
          onDispatchService={(srvId) => onOpenBookModal(srvId)}
          onOpenAi={onOpenAi}
        />
      </div>

      {/* Premium Towing Operations Carousel */}
      <div className="!mt-4 !mb-4">
        <PremiumCarousel />
      </div>

      {/* Live Distance & Fare Calculator */}
      <div id="calculator">
        <InteractiveFareCalculator
          onDispatchWithDetails={(srvId) => onOpenBookModal(srvId)}
        />
      </div>

      {/* 5. MEMBERSHIP PLANS */}
      <section id="membership" className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-num text-[#00D4FF] font-bold uppercase tracking-widest">
            ANNUAL & MONTHLY COVERAGE
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Unlimited Roadside Peace of Mind
          </h2>
          
          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-full glass-card border border-white/20 bg-[#061426]">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'MONTHLY' ? 'bg-[#0A84FF] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'ANNUAL' ? 'bg-gradient-to-r from-[#00D4FF] to-[#10D98F] text-slate-950 shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl glass-card border transition-all space-y-6 flex flex-col justify-between relative ${
                plan.highlight 
                  ? 'border-[#00D4FF] bg-gradient-to-b from-[#0A2647] via-[#081B33] to-[#061426] shadow-2xl scale-105' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#10D98F] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider font-num shadow-lg">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-heading font-bold text-2xl text-white">{plan.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{plan.tagline}</p>

                <div className="py-2">
                  <span className="font-heading font-extrabold text-4xl text-white">
                    ₹{billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-gray-400 font-num">
                    /{billingCycle === 'ANNUAL' ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#10D98F] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenAuth}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  plan.highlight 
                    ? 'bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 hover:opacity-90 shadow-xl' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                Enroll Membership Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BUSINESS FLEETS */}
      <section id="fleet" className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl glass-card border border-white/15 bg-gradient-to-r from-[#061426] via-[#081B33] to-[#0A2647] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-bold uppercase font-num">
              ENTERPRISE FLEET & LOGISTICS
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              Enterprise Multi-Vehicle Fleet Management
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Consolidate company vehicle towing, scheduled transport routes, automated invoicing, and telemetry audit logs for rental fleets, logistics operators, and dealership networks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <Building className="w-5 h-5 text-[#0A84FF]" />
                <h4 className="font-bold text-xs text-white">Corporate Portal</h4>
                <p className="text-[11px] text-gray-400">Multi-user admin seat management and centralized billing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <Globe className="w-5 h-5 text-[#10D98F]" />
                <h4 className="font-bold text-xs text-white">Global Dispatch API</h4>
                <p className="text-[11px] text-gray-400">Direct integration with omnigomobility.com fleet engines.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-2xl bg-[#0A84FF] hover:bg-[#00D4FF] text-white font-bold text-sm shadow-lg transition-all"
              >
                Schedule Corporate Fleet Demo
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-left">
            <h3 className="font-heading font-bold text-lg text-white">Fleet Dashboard Highlights</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span>Active Commercial Units</span>
                <span className="font-bold text-[#10D98F] font-num">1,240 Enrolled</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span>SLA Dispatch Speed</span>
                <span className="font-bold text-[#00D4FF] font-num">99.4% On-Time</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span>SLA Support</span>
                <span className="font-bold text-[#10D98F] font-num">24/7 Priority</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-num text-[#00D4FF] font-bold uppercase tracking-widest">
            REAL DRIVER REVIEWS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Trusted by Over 250,000 Drivers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl glass-card border border-white/10 text-left space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">"{t.comment}"</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#00D4FF]" />
                <div>
                  <h4 className="font-bold text-xs text-white">{t.name}</h4>
                  <p className="text-[10px] text-gray-400">{t.role} • {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-num text-[#00D4FF] font-bold uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-white/10 overflow-hidden text-left"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-heading font-bold text-sm text-white flex items-center justify-between hover:bg-white/5"
              >
                <span>{faq.question}</span>
                <span className="text-[#00D4FF] font-bold">{openFaqIndex === idx ? '-' : '+'}</span>
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-white/10 pt-16 pb-12 bg-[#051326] text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8 text-left mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <OmnigoLogo size="lg" showText={true} showTagline={true} />
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              OMNIGO is the leading AI-powered roadside assistance, towing, mobile charging, and fleet logistics platform worldwide.
            </p>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-200 tracking-wide uppercase">
                SDRS META RISE TECH PVT LTD
              </p>
              <p className="text-[11px] text-gray-400">
                Official Domain: <a href="https://omnigomobility.com" target="_blank" rel="noreferrer" className="text-[#00D4FF] underline">omnigomobility.com</a>
              </p>
              <p className="text-[11px] text-gray-400">
                Support: <a href="mailto:support@omnigomobility.com" className="text-gray-300 hover:text-white">support@omnigomobility.com</a>
              </p>
            </div>

            <p className="text-[11px] font-num text-[#10D98F] font-bold">
              ● 24/7 Dispatch Control Active: +1 (800) 555-OMNI
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white">Services Catalog</button></li>
              <li><button onClick={() => setActiveTab('how-it-works')} className="hover:text-white">How It Works</button></li>
              <li><button onClick={() => setActiveTab('membership')} className="hover:text-white">Memberships</button></li>
              <li><button onClick={() => setActiveTab('fleet')} className="hover:text-white">Business Fleets</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase mb-3">Account</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenAuth} className="hover:text-white">Customer Sign In</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase mb-3">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenSos} className="hover:text-red-400 text-red-500 font-bold">Emergency SOS</button></li>
              <li><button onClick={onOpenAi} className="hover:text-white">AI Diagnostic Assistant</button></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <p>© 2026 OMNIGO Mobility Inc. | SDRS META RISE TECH PVT LTD. All rights reserved.</p>
          <p className="font-num text-gray-400">www.omnigomobility.com • Designed for High-Performance Mobility & Roadside Safety.</p>
        </div>
      </footer>

      {/* 10. MEDIA FULLSCREEN MODAL */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4">
          <div className="w-full max-w-4xl glass-modal rounded-3xl overflow-hidden border border-white/20 p-6 relative space-y-4">
            
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] p-0.5 flex items-center justify-center">
                {activeMediaModal.type === 'video' ? <Film className="w-5 h-5 text-slate-950" /> : <Image className="w-5 h-5 text-slate-950" />}
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">{activeMediaModal.title}</h3>
                <p className="text-xs text-gray-300">{activeMediaModal.subtitle}</p>
              </div>
            </div>

            {/* Modal Body: Interactive Graphic / Video / Flyer Poster Display */}
            <div className="w-full min-h-[340px] max-h-[500px] rounded-2xl bg-slate-900 border border-white/10 overflow-hidden relative flex items-center justify-center p-6 text-center">
              
              {activeMediaModal.type === 'image' ? (
                /* High Definition Brand Flyer Display */
                <div className="space-y-6 max-w-md mx-auto py-2">
                  <div className="flex justify-center">
                    <OmnigoLogo size="xl" showText={true} showTagline={true} />
                  </div>

                  <p className="text-xs font-heading font-bold text-[#10D98F] tracking-widest uppercase">
                    every journey, every rescue
                  </p>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <p className="text-gray-200 font-bold uppercase">SDRS META RISE TECH PVT LTD</p>
                    <p className="text-gray-400 font-num">Official Platform Domain: <span className="text-[#00D4FF] font-bold">omnigomobility.com</span></p>
                    <p className="text-gray-400 font-num">24/7 Global Dispatch Hotline: <span className="text-[#10D98F] font-bold">+1 (800) 555-OMNI</span></p>
                  </div>
                </div>
              ) : (
                /* Video Interactive Player Simulation */
                <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-[#081B33] via-[#0A2647] to-[#0D3B66] rounded-xl flex flex-col items-center justify-center space-y-4 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-line-grid opacity-30"></div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0A84FF] to-[#00D4FF] p-0.5 shadow-2xl glow-cyan flex items-center justify-center animate-pulse z-10">
                    <Play className="w-8 h-8 text-slate-950 fill-slate-950 ml-1" />
                  </div>
                  <div className="z-10 space-y-1">
                    <p className="text-sm font-bold text-white">Playback Active • 4K High Dynamic Range</p>
                    <p className="text-xs text-[#00D4FF] font-num">Streamed directly from omnigomobility.com media servers</p>
                  </div>
                </div>
              )}

            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
              <span className="font-num">SDRS META RISE TECH PVT LTD</span>
              <a href="https://omnigomobility.com" target="_blank" rel="noreferrer" className="text-[#00D4FF] font-bold flex items-center space-x-1 hover:underline">
                <span>Visit omnigomobility.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
