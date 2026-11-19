import React from 'react';
import splashLogo from '../../assets/images/logo/splash_logo.jpg';

interface OmnigoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const OmnigoLogo: React.FC<OmnigoLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className = ''
}) => {
  const dimensions = {
    sm: { icon: 'w-10 h-10', text: 'text-xl', tagline: 'text-[7px]' },
    md: { icon: 'w-12 h-12', text: 'text-3xl', tagline: 'text-[8px]' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl', tagline: 'text-[9px]' },
    xl: { icon: 'w-20 h-20', text: 'text-5xl sm:text-6xl', tagline: 'text-[10px]' }
  }[size];

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* High-Tech Badge Icon */}
      <div className={`relative ${dimensions.icon} shrink-0 group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A84FF] via-[#00D4FF] to-[#10D98F] rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-full h-full rounded-2xl bg-[#081B33] border border-white/20 p-[1.5px] shadow-xl overflow-hidden flex items-center justify-center">
          <img
            src={splashLogo}
            alt="OMNIGO Logo"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-logo ${dimensions.text} tracking-wider text-white leading-none`}>
            OMNI<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#00E5FF] to-[#10D98F]">GO</span>
          </span>
          {showTagline && (
            <span className={`font-num tracking-widest text-[#00D4FF] font-bold uppercase mt-1 ${dimensions.tagline} leading-none opacity-90 hidden sm:inline-block whitespace-nowrap`}>
              every journey, every rescue
            </span>
          )}
        </div>
      )}
    </div>
  );
};

