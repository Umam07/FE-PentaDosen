import * as React from "react"

export function MassSyncIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Central Sync Pipeline Server */}
      <g transform="translate(50, 50)">
        <rect width="220" height="180" rx="16" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        
        {/* Terminal Header */}
        <rect x="14" y="14" width="70" height="8" rx="4" fill="#191918" className="dark:fill-[#ece4db]" />
        <circle cx="186" cy="18" r="4" fill="#3F8F5F" />
        <circle cx="198" cy="18" r="4" fill="#2563EB" />

        {/* Sync Step 1: Batch Scholar Query */}
        <g transform="translate(14, 36)">
          <rect width="192" height="38" rx="8" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="20" cy="19" r="8" fill="#4A78D0" />
          <path d="M16 19 L19 22 L24 16" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="36" y="12" width="90" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="36" y="22" width="60" height="4" rx="2" fill="#4A78D0" />
          <rect x="145" y="12" width="35" height="14" rx="4" fill="#EFF6FF" className="dark:fill-[#1b1714]" stroke="#BFDBFE" strokeWidth="1" />
          <rect x="151" y="17" width="23" height="4" rx="2" fill="#2563EB" />
        </g>

        {/* Sync Step 2: Batch Scopus Indexing */}
        <g transform="translate(14, 80)">
          <rect width="192" height="38" rx="8" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="20" cy="19" r="8" fill="#D9823B" />
          <path d="M16 19 L19 22 L24 16" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="36" y="12" width="85" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="36" y="22" width="55" height="4" rx="2" fill="#D9823B" />
          <rect x="145" y="12" width="35" height="14" rx="4" fill="#FFF7EA" className="dark:fill-[#1b1714]" stroke="#F3D6A7" strokeWidth="1" />
          <rect x="151" y="17" width="23" height="4" rx="2" fill="#D9823B" />
        </g>

        {/* Sync Step 3: University DB Metric Calculation */}
        <g transform="translate(14, 124)">
          <rect width="192" height="42" rx="8" fill="#191918" className="dark:fill-[#ece4db]" />
          <circle cx="20" cy="21" r="8" fill="#2563EB" />
          <path d="M17 21 C17 19 18.5 17.5 20.5 17.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="36" y="14" width="95" height="6" rx="3" fill="#FFFFFF" className="dark:fill-[#191918]" />
          <rect x="36" y="24" width="65" height="4" rx="2" fill="#93C5FD" className="dark:fill-[#2563EB]" />
          <rect x="140" y="14" width="40" height="14" rx="4" fill="#3F8F5F" />
          <rect x="146" y="19" width="28" height="4" rx="2" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  )
}
