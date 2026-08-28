import * as React from "react"

export function FacultyHubIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Central Faculty Node */}
      <g transform="translate(110, 80)">
        <rect width="100" height="110" rx="18" fill="#191918" className="dark:fill-[#2a241f]" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="30" y="18" width="40" height="40" rx="10" fill="#2563EB" />
        <path d="M50 28 L62 38 L38 38 Z" fill="#FFFFFF" />
        <rect x="42" y="38" width="16" height="14" fill="#FFFFFF" />
        <rect x="18" y="70" width="64" height="6" rx="3" fill="#FFFFFF" />
        <rect x="26" y="82" width="48" height="5" rx="2.5" fill="#93C5FD" />
      </g>

      {/* Prodi / Dosen Satellite Nodes */}
      <g transform="translate(35, 50)">
        <rect width="64" height="54" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="22" cy="22" r="8" fill="#2563EB" opacity="0.8" />
        <rect x="12" y="36" width="40" height="5" rx="2.5" fill="#D9D6D0" className="dark:fill-[#38312a]" />
      </g>
      <path d="M100 80 L110 95" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />

      <g transform="translate(220, 50)">
        <rect width="64" height="54" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="22" cy="22" r="8" fill="#3F8F5F" opacity="0.8" />
        <rect x="12" y="36" width="40" height="5" rx="2.5" fill="#D9D6D0" className="dark:fill-[#38312a]" />
      </g>
      <path d="M220 80 L210 95" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />

      <g transform="translate(35, 175)">
        <rect width="64" height="54" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="16" width="40" height="6" rx="3" fill="#D9823B" />
        <rect x="12" y="30" width="30" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
      </g>
      <path d="M100 190 L110 175" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />

      <g transform="translate(220, 175)">
        <rect width="64" height="54" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="16" width="40" height="6" rx="3" fill="#4A78D0" />
        <rect x="12" y="30" width="30" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
      </g>
      <path d="M220 190 L210 175" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-[#38312a]" />
    </svg>
  )
}
