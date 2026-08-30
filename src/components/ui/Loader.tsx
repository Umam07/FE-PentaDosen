import React from 'react';

export type LoaderVariant = 'pentagon' | 'orbital' | 'ring' | 'pulse';

export interface LoaderProps {
  /** Size in pixels (width and height). Default: 48 */
  size?: number;
  /** Primary accent color (hex/rgb/css variable). Default: #2563eb */
  color?: string;
  /** Secondary or track color. Default: rgba(37, 99, 235, 0.15) */
  trackColor?: string;
  /** Accent spark/tassel color. Default: #f59e0b */
  accentColor?: string;
  /** Speed multiplier (1 = normal, 1.5 = faster, 0.7 = slower). Default: 1 */
  speed?: number;
  /** Visual variant. Default: 'pentagon' */
  variant?: LoaderVariant;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label */
  label?: string | null;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export function Loader({
  size = 48,
  color = '#2563eb',
  trackColor = 'rgba(37, 99, 235, 0.12)',
  accentColor = '#f59e0b',
  speed = 1,
  variant = 'pentagon',
  className = '',
  label = 'Memuat...',
  style,
}: LoaderProps) {
  const duration = 1.4 / (speed || 1);
  const counterDuration = 2.2 / (speed || 1);

  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={`inline-flex items-center justify-center select-none relative ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <style>{`
        @keyframes penta-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes penta-counter-spin {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes penta-dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
        @keyframes penta-glow {
          0%, 100% { transform: scale(0.92); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .penta-loader-spin {
          animation: penta-spin var(--penta-duration, 1.4s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: center;
          will-change: transform;
        }
        .penta-loader-counter-spin {
          animation: penta-counter-spin var(--penta-counter-duration, 2.2s) linear infinite;
          transform-origin: center;
          will-change: transform;
        }
        .penta-loader-dash {
          animation: penta-dash var(--penta-duration, 1.4s) ease-in-out infinite;
          stroke-linecap: round;
        }
        .penta-loader-core {
          animation: penta-glow calc(var(--penta-duration, 1.4s) * 1.2) ease-in-out infinite;
          transform-origin: center;
          will-change: transform, opacity;
        }
      `}</style>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 50 50"
        className="w-full h-full overflow-visible"
        style={
          {
            '--penta-duration': `${duration}s`,
            '--penta-counter-duration': `${counterDuration}s`,
          } as React.CSSProperties
        }
      >
        {/* Soft Outer Background Track */}
        <circle
          cx="25"
          cy="25"
          r="21"
          fill="none"
          stroke={trackColor}
          strokeWidth="3.5"
        />

        {/* Primary Animated Kinetic Arc */}
        <g className="penta-loader-spin">
          <circle
            cx="25"
            cy="25"
            r="21"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            className="penta-loader-dash"
          />
        </g>

        {/* Secondary Outer Spark (Amber Orbit Dot) */}
        {variant !== 'ring' && (
          <g className="penta-loader-counter-spin">
            <circle
              cx="25"
              cy="4"
              r="2.2"
              fill={accentColor}
              className="drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]"
            />
          </g>
        )}

        {/* Central Geometric Badge (Pentagon Core) */}
        {variant === 'pentagon' && (
          <g className="penta-loader-core">
            {/* Pentagon Badge */}
            <path
              d="M25 15.5L32 20.2V27.5L25 31.5L18 27.5V20.2L25 15.5Z"
              fill={color}
              opacity="0.9"
            />
            {/* Cap Triangle */}
            <path
              d="M25 18L30 21.2L25 24.2L20 21.2L25 18Z"
              fill="#FFFFFF"
            />
            {/* Amber accent dot */}
            <circle cx="28.5" cy="25" r="1" fill={accentColor} />
          </g>
        )}

        {/* Orbital Center Core */}
        {variant === 'orbital' && (
          <circle
            cx="25"
            cy="25"
            r="4.5"
            fill={color}
            className="penta-loader-core drop-shadow-[0_0_6px_rgba(37,99,235,0.4)]"
          />
        )}
      </svg>
    </span>
  );
}

export default Loader;
