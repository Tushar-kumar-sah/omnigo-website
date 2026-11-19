import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Truck, Zap, Shield, Clock, ArrowRight, Play, Pause } from 'lucide-react';

// Import the local generated HD images
import cyberFlatbed from '../../assets/images/cyber_flatbed.png';
import wheelLiftTow from '../../assets/images/wheel_lift_tow.png';
import heavyRescue from '../../assets/images/heavy_rescue.png';

interface CardStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

interface CarouselCard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  accentColor: string;
  glowColor: string;
  stats: CardStat[];
}

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: 'cyber-flatbed',
    title: 'Elite Cyber Flatbed Towing',
    category: 'PREMIUM ROAD RESCUE',
    description: 'Ultra-low clearance hydraulic flatbed engineered for damage-free loading of luxury sports cars, EVs, and exotic vehicles.',
    image: cyberFlatbed,
    accentColor: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    stats: [
      { label: 'Bed Style', value: 'Zero-Scratch', icon: Shield },
      { label: 'ETA SLA', value: '8-12 Mins', icon: Clock },
      { label: 'Capacity', value: '8,000 Kg', icon: Truck }
    ]
  },
  {
    id: 'wheel-lift',
    title: 'Sleek Wheel-Lift Towing',
    category: 'RAPID URBAN DISPATCH',
    description: 'Compact wheel-lift recovery units designed for tight city streets, parking garages, and quick commuter roadside assistance.',
    image: wheelLiftTow,
    accentColor: '#10D98F',
    glowColor: 'rgba(16, 217, 143, 0.4)',
    stats: [
      { label: 'Type', value: 'Wheel-Lift', icon: Shield },
      { label: 'ETA SLA', value: '6-10 Mins', icon: Clock },
      { label: 'Clearance', value: 'Low-Profile', icon: Truck }
    ]
  },
  {
    id: 'heavy-rescue',
    title: 'Heavy Duty Winch & Recovery',
    category: 'TACTICAL INFRASTRUCTURE',
    description: 'Robust recovery operations equipped with dual hydraulic winches, heavy steel rigging, and structural lift-booms.',
    image: heavyRescue,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    stats: [
      { label: 'Winch Pull', value: '11,500 Kg', icon: Shield },
      { label: 'Lift Rating', value: '20 Tonnes', icon: Truck },
      { label: 'Response', value: 'Priority dispatch', icon: Zap }
    ]
  }
];

export const PremiumCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const duration = 6000; // 6 seconds per slide

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_CARDS.length) % CAROUSEL_CARDS.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    setProgress(0);
  };

  // Reset progress and handle active slide changes when auto-playing
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isPlaying) {
      // Start the main slide transition timer
      timerRef.current = setTimeout(() => {
        handleNext();
      }, duration);

      // Start the fine-grained progress bar update interval
      const steps = 100;
      const stepTime = duration / steps;
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, stepTime);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeIndex, isPlaying]);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col items-center space-y-10 overflow-hidden select-none">
      
      {/* Header Info */}
      <div className="text-center space-y-3 max-w-2xl">
        <span className="text-xs font-num text-[#00D4FF] font-bold uppercase tracking-widest block">
          SUPERIOR FLEET & LOGISTICS DEMONSTRATION
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
          Precision Roadside & Towing Operations
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm">
          A visual showcase of our elite response fleet, featuring state-of-the-art diagnostic sensors, specialized zero-clearance hydraulic gear, and emergency EV power packs.
        </p>
      </div>

      {/* Main 3D Stage Container */}
      <div 
        className="w-full flex justify-center items-center h-[520px] md:h-[480px] relative mt-4 overflow-visible"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        
        {/* Navigation Arrows */}
        <div className="absolute left-0 sm:left-4 z-40 hidden md:block">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/10 bg-[#061426]/75 hover:bg-[#0A84FF] text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg group backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="absolute right-0 sm:right-4 z-40 hidden md:block">
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/10 bg-[#061426]/75 hover:bg-[#0A84FF] text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg group backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3D Perspective Card Layout */}
        <div className="relative w-full max-w-5xl h-full flex justify-center items-center overflow-visible">
          {CAROUSEL_CARDS.map((card, idx) => {
            // Calculate circular offset distance: -1, 0, or 1
            const total = CAROUSEL_CARDS.length;
            let offset = idx - activeIndex;
            if (offset < -1) offset += total;
            if (offset > 1) offset -= total;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isVisible = isCenter || isLeft || isRight;

            if (!isVisible) return null;

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(idx);
                    setProgress(0);
                  }
                }}
                className={`absolute w-[92%] sm:w-[70%] md:w-[48%] lg:w-[38%] h-[400px] rounded-3xl transition-all duration-700 ease-out cursor-pointer overflow-hidden border ${
                  isCenter
                    ? 'z-30 scale-105 sm:scale-110 opacity-100 pointer-events-auto border-white/20'
                    : 'z-10 scale-90 sm:scale-95 opacity-40 hover:opacity-65 pointer-events-auto border-white/10'
                }`}
                style={{
                  transform: isCenter
                    ? 'translateX(0) scale(1.05) translateZ(0)'
                    : isLeft
                    ? 'translateX(-40%) scale(0.9) rotateY(15deg) translateZ(-50px)'
                    : 'translateX(40%) scale(0.9) rotateY(-15deg) translateZ(-50px)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  boxShadow: isCenter 
                    ? `0 20px 40px -10px ${card.glowColor}, inset 0 1px 1px rgba(255,255,255,0.15)`
                    : '0 10px 20px -10px rgba(0,0,0,0.5)',
                }}
              >
                
                {/* HD Towing Image Background */}
                <div className="absolute inset-0 select-none">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#061426]/50 to-transparent" />
                </div>

                {/* Cyber Card Overlay Highlights */}
                {isCenter && (
                  <div 
                    className="absolute inset-0 opacity-10 transition-opacity duration-700 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 20%, ${card.accentColor}, transparent 60%)`
                    }}
                  />
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                  
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border border-white/10 bg-[#061426]/80 backdrop-blur-sm"
                      style={{ color: card.accentColor }}
                    >
                      {card.category}
                    </span>
                    {isCenter && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10D98F] animate-ping" />
                    )}
                  </div>

                  {/* Card Footer Details */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-bold text-lg md:text-xl text-white tracking-wide">
                        {card.title}
                      </h3>
                      <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-2 md:line-clamp-3">
                        {card.description}
                      </p>
                    </div>

                    {/* Horizontal Stats List */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                      {card.stats.map((stat, sIdx) => {
                        const Icon = stat.icon;
                        return (
                          <div key={sIdx} className="text-center space-y-1">
                            <div className="flex justify-center">
                              <Icon className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <span className="text-[9px] text-gray-400 uppercase font-semibold block tracking-wider leading-none">
                              {stat.label}
                            </span>
                            <span className="text-[10px] text-white font-bold block leading-none font-num mt-0.5">
                              {stat.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Auto-Play & Progress Bar Controller */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        
        {/* Progress Bar Track */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundColor: CAROUSEL_CARDS[activeIndex].accentColor,
              boxShadow: `0 0 8px ${CAROUSEL_CARDS[activeIndex].accentColor}`
            }}
          />
        </div>

        {/* Controls Bar */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all scale-95 hover:scale-100"
            title={isPlaying ? 'Pause Autoplay' : 'Start Autoplay'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-300" />
            ) : (
              <Play className="w-4 h-4 text-gray-300" />
            )}
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-2">
            {CAROUSEL_CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setProgress(0);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx 
                    ? 'w-6 bg-white shadow-md' 
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
