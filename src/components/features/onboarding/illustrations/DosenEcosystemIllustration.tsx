import * as React from "react"

export function DosenEcosystemIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      <path d="M160 140 L85 85" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L235 85" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L85 195" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L235 195" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />

      <rect x="120" y="100" width="80" height="80" rx="18" fill="#191918" className="dark:fill-[#2a241f]" />
      <rect x="120" y="100" width="80" height="80" rx="18" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="135" y="115" width="50" height="50" rx="10" fill="#2563EB" />
      <path d="M160 131 L176 139 L160 147 L144 139 Z" fill="#FFFFFF" />
      <path d="M150 143.5 V149.5 C150 151.5 154 153 160 153 C166 153 170 151.5 170 149.5 V143.5" fill="#FFFFFF" opacity="0.9" />

      <g transform="translate(45, 52)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="30" height="6" rx="3" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="12" y="26" width="54" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="35" width="38" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <circle cx="62" cy="17" r="4" fill="#2563EB" />
      </g>

      <g transform="translate(195, 52)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="28" height="6" rx="3" fill="#2563EB" />
        <rect x="12" y="26" width="48" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="35" width="36" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <circle cx="60" cy="38" r="7" fill="#EFF6FF" className="dark:fill-[#1b1714]" />
        <path d="M57.5 38 L59.5 40 L63 36.5" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g transform="translate(45, 170)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="14" y="36" width="9" height="12" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="27" y="26" width="9" height="22" rx="2" fill="#4A78D0" />
        <rect x="40" y="18" width="9" height="30" rx="2" fill="#2563EB" />
        <rect x="53" y="30" width="9" height="18" rx="2" fill="#D9823B" />
      </g>

      <g transform="translate(195, 170)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="40" cy="29" r="15" fill="#EFEEEA" className="dark:fill-[#2a241f]" />
        <path d="M34 29 C34 25.8 36.5 23.5 40 23.5 C42.2 23.5 44.2 24.8 45 26.8" stroke="#191918" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#ece4db]" />
        <path d="M46 29 C46 32.2 43.5 34.5 40 34.5 C37.8 34.5 35.8 33.2 35 31.2" stroke="#191918" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#ece4db]" />
      </g>

      <circle cx="32" cy="140" r="3.5" fill="#2563EB" opacity="0.5" />
      <circle cx="288" cy="140" r="3.5" fill="#D9823B" opacity="0.5" />
    </svg>
  )
}
