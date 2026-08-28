import * as React from "react"

export function DosenProfileIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      <g transform="translate(95, 56)">
        <rect width="130" height="168" rx="16" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        
        <path d="M0 16 C0 7.16 7.16 0 16 0 H114 C122.84 0 130 7.16 130 16 V44 H0 V16 Z" fill="#191918" className="dark:fill-[#2a241f]" />

        <circle cx="65" cy="44" r="20" fill="#FBFAF8" stroke="#191918" strokeWidth="2.5" className="dark:fill-[#201b17] dark:stroke-[#ece4db]" />
        <circle cx="65" cy="40" r="8" fill="#2563EB" />
        <path d="M53 55 C53 49 58 47 65 47 C72 47 77 49 77 55 Z" fill="#2563EB" />

        <rect x="30" y="74" width="70" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="42" y="86" width="46" height="5" rx="2.5" fill="#74716B" className="dark:fill-[#9d9285]" />

        <g transform="translate(15, 106)">
          <rect width="100" height="42" rx="10" fill="#F0EFEC" stroke="#DEDCD7" strokeWidth="1" className="dark:fill-[#2a241f] dark:stroke-[#38312a]" />
          <circle cx="22" cy="21" r="7" fill="#3F8F5F" />
          <path d="M19.5 21 L21 22.5 L24.5 19" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="36" y="15" width="48" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="36" y="24" width="34" height="4" rx="2" fill="#2563EB" />
        </g>
      </g>

      <g transform="translate(28, 88)">
        <path d="M52 38 L67 38" stroke="#4A78D0" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect width="52" height="52" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#4A78D0" strokeWidth="1" />
        <circle cx="26" cy="26" r="14" fill="#EFF6FF" className="dark:fill-[#1b1714]" />
        <path d="M26 18 L34 22.5 L26 27 L18 22.5 Z" fill="#4A78D0" />
        <path d="M21 25.5 V29.5 C21 31 23 32 26 32 C29 32 31 31 31 29.5 V25.5" fill="#4A78D0" opacity="0.85" />
      </g>

      <g transform="translate(240, 88)">
        <path d="M-15 38 L0 38" stroke="#D9823B" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect width="52" height="52" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#D9823B" strokeWidth="1" />
        <circle cx="26" cy="26" r="14" fill="#FFF7EA" className="dark:fill-[#1b1714]" />
        <circle cx="21" cy="26" r="4" fill="#D9823B" />
        <circle cx="31" cy="26" r="4" fill="#D9823B" />
        <path d="M21 26 L31 26" stroke="#D9823B" strokeWidth="2" />
      </g>
    </svg>
  )
}
