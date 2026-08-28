import * as React from "react"

export function FacultyMonitoringIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Analytics Card (Left) */}
      <g transform="translate(38, 55)">
        <rect width="115" height="170" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="60" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="12" y="26" width="40" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />

        {/* Bar chart */}
        <g transform="translate(14, 45)">
          <rect x="0" y="60" width="16" height="40" rx="4" fill="#D9823B" />
          <rect x="22" y="30" width="16" height="70" rx="4" fill="#4A78D0" />
          <rect x="44" y="15" width="16" height="85" rx="4" fill="#2563EB" />
          <rect x="66" y="45" width="16" height="55" rx="4" fill="#3F8F5F" />
        </g>
        <rect x="12" y="150" width="90" height="6" rx="3" fill="#EFEEEA" className="dark:fill-[#2a241f]" />
      </g>

      {/* Input Dokumen Mandiri Card (Right) */}
      <g transform="translate(165, 55)">
        <rect width="115" height="170" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="70" height="7" rx="3.5" fill="#2563EB" />
        
        <g transform="translate(12, 36)">
          <rect width="90" height="24" rx="6" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <rect x="8" y="10" width="50" height="4" rx="2" fill="#191918" className="dark:fill-[#ece4db]" />
        </g>
        
        <g transform="translate(12, 68)">
          <rect width="90" height="24" rx="6" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <rect x="8" y="10" width="60" height="4" rx="2" fill="#191918" className="dark:fill-[#ece4db]" />
        </g>

        {/* Plus Action Button */}
        <g transform="translate(12, 106)">
          <rect width="90" height="44" rx="8" fill="#191918" className="dark:fill-[#ece4db]" />
          <circle cx="28" cy="22" r="8" fill="#2563EB" />
          <path d="M28 17 V27 M23 22 H33" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="42" y="19" width="36" height="6" rx="3" fill="#FFFFFF" className="dark:fill-[#191918]" />
        </g>
      </g>
    </svg>
  )
}
