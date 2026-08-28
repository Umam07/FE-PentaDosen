import * as React from "react"

export function CmsControlIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Main CMS Layout Container */}
      <g transform="translate(50, 50)">
        <rect width="220" height="180" rx="16" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        
        {/* Top Control Bar */}
        <path d="M0 16 C0 7.16 7.16 0 16 0 H204 C212.84 0 220 7.16 220 16 V36 H0 V16 Z" fill="#191918" className="dark:fill-[#2a241f]" />
        <circle cx="16" cy="18" r="4" fill="#D9823B" />
        <circle cx="28" cy="18" r="4" fill="#3F8F5F" />
        <rect x="42" y="14" width="60" height="7" rx="3.5" fill="#FFFFFF" />

        {/* User Management Tile */}
        <g transform="translate(14, 48)">
          <rect width="90" height="54" rx="10" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="24" cy="24" r="10" fill="#2563EB" />
          <rect x="40" y="18" width="40" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="40" y="28" width="28" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="14" y="42" width="62" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        </g>

        {/* Role & Permissions Tile */}
        <g transform="translate(116, 48)">
          <rect width="90" height="54" rx="10" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="24" cy="24" r="10" fill="#3F8F5F" />
          <rect x="40" y="18" width="40" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="40" y="28" width="28" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="14" y="42" width="62" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        </g>

        {/* Audit Log / Activity Trail Banner */}
        <g transform="translate(14, 112)">
          <rect width="192" height="54" rx="10" fill="#EFEEEA" stroke="#DEDCD7" strokeWidth="1" className="dark:fill-[#2a241f] dark:stroke-[#38312a]" />
          <rect x="14" y="14" width="70" height="6" rx="3" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="14" y="26" width="130" height="5" rx="2.5" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="14" y="37" width="100" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
          <circle cx="170" cy="27" r="10" fill="#2563EB" opacity="0.9" />
          <path d="M166 27 L169 30 L175 24" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}
