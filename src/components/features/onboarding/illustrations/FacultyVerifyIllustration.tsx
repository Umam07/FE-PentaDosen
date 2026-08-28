import * as React from "react"

export function FacultyVerifyIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Main Document Inspection Card */}
      <g transform="translate(60, 50)">
        <rect width="200" height="180" rx="16" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        
        {/* Document Header */}
        <rect x="16" y="16" width="80" height="8" rx="4" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="16" y="30" width="120" height="5" rx="2.5" fill="#74716B" className="dark:fill-[#9d9285]" />

        {/* Row 1: Publikasi Jurnal - Verified */}
        <g transform="translate(16, 48)">
          <rect width="168" height="34" rx="8" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="18" cy="17" r="7" fill="#3F8F5F" />
          <path d="M15.5 17 L17 18.5 L20.5 15" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="32" y="11" width="80" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="32" y="20" width="50" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="126" y="11" width="32" height="12" rx="4" fill="#EDF7F0" className="dark:fill-[#201b17]" stroke="#CAE5D2" strokeWidth="1" />
          <rect x="132" y="15" width="20" height="4" rx="2" fill="#3F8F5F" />
        </g>

        {/* Row 2: Penelitian - Pending Review */}
        <g transform="translate(16, 90)">
          <rect width="168" height="34" rx="8" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="18" cy="17" r="7" fill="#C7832F" />
          <circle cx="18" cy="17" r="2" fill="#FFFFFF" />
          <rect x="32" y="11" width="70" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="32" y="20" width="45" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="126" y="11" width="32" height="12" rx="4" fill="#FFF7EA" className="dark:fill-[#201b17]" stroke="#F3D6A7" strokeWidth="1" />
          <rect x="132" y="15" width="20" height="4" rx="2" fill="#C7832F" />
        </g>

        {/* Row 3: HKI / Buku */}
        <g transform="translate(16, 132)">
          <rect width="168" height="34" rx="8" fill="#F0EFEC" className="dark:fill-[#2a241f]" />
          <circle cx="18" cy="17" r="7" fill="#2563EB" />
          <path d="M15.5 17 L17 18.5 L20.5 15" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="32" y="11" width="75" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="32" y="20" width="40" height="4" rx="2" fill="#74716B" className="dark:fill-[#9d9285]" />
          <rect x="126" y="11" width="32" height="12" rx="4" fill="#EFF6FF" className="dark:fill-[#201b17]" stroke="#BFDBFE" strokeWidth="1" />
          <rect x="132" y="15" width="20" height="4" rx="2" fill="#2563EB" />
        </g>
      </g>
    </svg>
  )
}
