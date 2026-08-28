import * as React from "react"

export function UniversityHubIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* University Main Shield & Pillars */}
      <g transform="translate(90, 48)">
        <rect width="140" height="184" rx="18" fill="#191918" className="dark:fill-[#2a241f]" stroke="#2563EB" strokeWidth="1.5" />
        
        {/* Shield Icon Top */}
        <circle cx="70" cy="40" r="22" fill="#2563EB" />
        <path d="M70 26 L82 31 V41 C82 49 76 54 70 56 C64 54 58 49 58 41 V31 L70 26 Z" fill="#FFFFFF" />

        <rect x="24" y="74" width="92" height="7" rx="3.5" fill="#FFFFFF" />
        <rect x="34" y="86" width="72" height="5" rx="2.5" fill="#93C5FD" />

        {/* Global Stats Metrics Container */}
        <g transform="translate(16, 104)">
          <rect width="108" height="64" rx="10" fill="#201B17" className="dark:fill-[#171412]" stroke="#38312A" strokeWidth="1" />
          <circle cx="24" cy="24" r="6" fill="#3F8F5F" />
          <rect x="36" y="21" width="56" height="5" rx="2.5" fill="#FFFFFF" />
          <circle cx="24" cy="44" r="6" fill="#4A78D0" />
          <rect x="36" y="41" width="48" height="5" rx="2.5" fill="#93C5FD" />
        </g>
      </g>

      {/* Surrounding Connected Faculties Nodes */}
      <g transform="translate(28, 80)">
        <circle cx="24" cy="24" r="20" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="14" y="21" width="20" height="6" rx="3" fill="#D9823B" />
      </g>
      <path d="M48 104 L90 104" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />

      <g transform="translate(248, 80)">
        <circle cx="24" cy="24" r="20" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="14" y="21" width="20" height="6" rx="3" fill="#4A78D0" />
      </g>
      <path d="M230 104 L272 104" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />
    </svg>
  )
}
