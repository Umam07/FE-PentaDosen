import * as React from "react"

export function DosenSyncIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      <g transform="translate(38, 76)">
        <rect width="88" height="128" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="46" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        
        <rect x="10" y="32" width="68" height="24" rx="6" fill="#FBFAF8" className="dark:fill-[#2a241f]" stroke="#4A78D0" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="21" cy="44" r="5" fill="#4A78D0" />
        <rect x="31" y="42" width="38" height="4" rx="2" fill="#4A78D0" />
        
        <rect x="10" y="62" width="68" height="24" rx="6" fill="#FBFAF8" className="dark:fill-[#2a241f]" stroke="#D9823B" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="21" cy="74" r="5" fill="#D9823B" />
        <rect x="31" y="72" width="38" height="4" rx="2" fill="#D9823B" />
        
        <rect x="12" y="98" width="50" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="108" width="32" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
      </g>

      <g transform="translate(133, 115)">
        <path d="M0 25 C15 5, 40 5, 54 20" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="54,23 55,16 48,19" fill="#2563EB" />

        <path d="M54 30 C39 50, 14 50, 0 35" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="0,32 1,39 7,36" fill="#2563EB" />

        <circle cx="27" cy="27" r="16" fill="#191918" className="dark:fill-[#ece4db]" />
        <path d="M22 27 A 5 5 0 1 1 29 31" stroke="#FFFFFF" className="dark:stroke-[#191918]" strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="30,32 30,27 26,29" fill="#FFFFFF" className="dark:fill-[#191918]" />
      </g>

      <g transform="translate(194, 76)">
        <rect width="88" height="128" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="42" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        
        <rect x="12" y="32" width="60" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="42" width="50" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <rect x="12" y="52" width="56" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />

        <g transform="translate(10, 68)">
          <rect width="68" height="38" rx="8" fill="#EDF7F0" stroke="#CAE5D2" strokeWidth="1" className="dark:fill-[#201b17] dark:stroke-[#38312a]" />
          <circle cx="20" cy="19" r="8" fill="#3F8F5F" />
          <path d="M17 19 L19 21 L23 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="33" y="14" width="26" height="4" rx="2" fill="#3F8F5F" />
          <rect x="33" y="21" width="18" height="3" rx="1.5" fill="#75C995" />
        </g>
      </g>

      <g transform="translate(100, 36)">
        <rect width="120" height="26" rx="8" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="20" cy="13" r="4" fill="#3F8F5F" />
        <rect x="30" y="10" width="70" height="6" rx="3" fill="#191918" className="dark:fill-[#ece4db]" />
      </g>
    </svg>
  )
}
