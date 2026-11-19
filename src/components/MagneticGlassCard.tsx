import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface MagneticGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number; // magnetic strength factor (default 0.2)
  disableBreathing?: boolean;
}

export const MagneticGlassCard: React.FC<MagneticGlassCardProps> = ({
  children,
  className = '',
  onClick,
  strength = 0.2,
  disableBreathing = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth magnetic pull
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for magnetic attraction
  const springConfig = { damping: 18, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Slight 3D tilt rotation
  const rotateX = useTransform(smoothY, [-20, 20], [6, -6]);
  const rotateY = useTransform(smoothX, [-20, 20], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        x: smoothX,
        y: smoothY,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-card glass-card-hover relative transition-shadow duration-300 ${
        disableBreathing ? 'animation-none' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
