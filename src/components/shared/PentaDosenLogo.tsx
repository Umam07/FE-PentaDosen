import React from 'react';

interface PentaDosenLogoProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

export default function PentaDosenLogo({
  className = "w-6 h-6",
  size,
  color = "#2563EB",       // primary blue (blue-600)
  accentColor = "#F59E0B", // amber tassel accent
}: PentaDosenLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Symmetrical Solid 5-Sided Pentagon Badge */}
      <path d="M16 0L32 10.5V23.5L16 32L0 23.5V10.5L16 0Z" fill={color} />

      {/* Bold Simplified Cap Top */}
      <path d="M16 6.5L27 12L16 17.5L5 12L16 6.5Z" fill="#FFFFFF" />

      {/* Bold Cap Base */}
      <path d="M10 13.5V18C10 20.2 12.7 21.8 16 21.8C19.3 21.8 22 20.2 22 18V13.5H19.5V17.5C19.5 18.5 18 19.5 16 19.5C14 19.5 12.5 18.5 12.5 17.5V13.5H10Z" fill="#FFFFFF" />

      {/* Bold Tassel Accent */}
      <path d="M24 13V19" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="21.5" r="1.8" fill={accentColor} />
    </svg>
  );
}