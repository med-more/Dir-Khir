'use client'

import React from 'react'

export function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Moroccan Star Background */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle with Moroccan pattern */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#gradient1)"
          stroke="url(#gradient2)"
          strokeWidth="2"
        />
        
        {/* Moroccan 5-pointed star (from flag) */}
        <path
          d="M50 15 L60 40 L85 40 L67 57 L75 82 L50 65 L25 82 L33 57 L15 40 L40 40 Z"
          fill="url(#gradient3)"
        />
        
        {/* Inner geometric pattern */}
        <circle cx="50" cy="50" r="20" fill="none" stroke="url(#gradient4)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="12" fill="url(#gradient5)" />
        
        {/* Arabic letter د in center */}
        <text
          x="50"
          y="58"
          fontSize="28"
          fontWeight="900"
          fill="white"
          textAnchor="middle"
          fontFamily="serif"
          className="font-serif"
        >
          د
        </text>
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C17A3F" />
            <stop offset="100%" stopColor="#2D8659" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#C17A3F" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#2D8659" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C17A3F" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C17A3F" />
            <stop offset="100%" stopColor="#A05A2E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function LogoSimple({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Simplified version with star and letter */}
      <div className="relative w-full h-full">
        {/* Star background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C17A3F] to-[#2D8659] shadow-lg border-2 border-[#D4AF37]/30" />
        
        {/* Moroccan star pattern overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 20 L58 38 L78 38 L63 50 L71 68 L50 58 L29 68 L37 50 L22 38 L42 38 Z"
              fill="#1E3A5F"
              fillOpacity="0.3"
            />
          </svg>
        </div>
        
        {/* Arabic letter */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <span className="text-white font-serif font-black text-2xl">د</span>
        </div>
      </div>
    </div>
  )
}
