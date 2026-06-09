import React, { useEffect, useRef, useState } from 'react';

export type AnimationType = 'reveal' | 'slide-up' | 'card-roll' | 'glow-pulse' | 'scale-in' | 'none';

interface BlockWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  width?: string;
  style?: React.CSSProperties;
}

export function BlockWrapper({
  children,
  className = '',
  animation = 'reveal',
  width,
  style,
}: BlockWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animClass = getAnimClass(animation, visible);

  return (
    <div
      ref={ref}
      className={`notebook-block relative overflow-hidden rounded-lg p-6 ${animClass} ${className}`}
      style={{
        width: width ?? undefined,
        flexShrink: width ? 0 : undefined,
        background: 'rgba(22, 22, 22, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 107, 0, 0.28)',
        boxShadow: '0 0 18px rgba(255, 107, 0, 0.12), inset 0 0 30px rgba(255, 107, 0, 0.03)',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 0 40px rgba(255, 107, 0, 0.35), 0 0 80px rgba(255, 107, 0, 0.12), inset 0 0 30px rgba(255, 107, 0, 0.06)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 107, 0, 0.55)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 0 18px rgba(255, 107, 0, 0.12), inset 0 0 30px rgba(255, 107, 0, 0.03)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 107, 0, 0.28)';
      }}
    >
      {/* top-left corner accent */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-8 h-8"
        style={{
          borderTop: '2px solid rgba(255, 107, 0, 0.7)',
          borderLeft: '2px solid rgba(255, 107, 0, 0.7)',
          borderTopLeftRadius: '0.5rem',
        }}
      />
      {/* bottom-right corner accent */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-8 h-8"
        style={{
          borderBottom: '2px solid rgba(255, 107, 0, 0.4)',
          borderRight: '2px solid rgba(255, 107, 0, 0.4)',
          borderBottomRightRadius: '0.5rem',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function getAnimClass(animation: AnimationType, visible: boolean): string {
  if (animation === 'none') return '';
  const base = 'transition-all duration-700 ease-out';
  if (!visible) {
    switch (animation) {
      case 'reveal':      return `${base} opacity-0 [clip-path:inset(0_0_100%_0)]`;
      case 'slide-up':    return `${base} opacity-0 translate-y-10`;
      case 'card-roll':   return `${base} opacity-0 [perspective:800px] [transform:rotateX(-35deg)_translateY(40px)] origin-bottom`;
      case 'glow-pulse':  return `${base} opacity-0 scale-95`;
      case 'scale-in':    return `${base} opacity-0 scale-90`;
      default:            return `${base} opacity-0`;
    }
  }
  switch (animation) {
    case 'reveal':      return `${base} opacity-100 [clip-path:inset(0_0_0%_0)]`;
    case 'slide-up':    return `${base} opacity-100 translate-y-0`;
    case 'card-roll':   return `${base} opacity-100 [perspective:800px] [transform:rotateX(0deg)_translateY(0px)] origin-bottom`;
    case 'glow-pulse':  return `${base} opacity-100 scale-100 animate-glow-pulse`;
    case 'scale-in':    return `${base} opacity-100 scale-100`;
    default:            return `${base} opacity-100`;
  }
}
