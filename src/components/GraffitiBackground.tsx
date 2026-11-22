'use client';

import React from 'react';

export function GraffitiBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
      {/* ================= TOP LEFT ================= */}
      {/* 4-Point Sparkle Star - Emerald Green */}
      <svg
        className="absolute top-20 left-4 sm:left-12 w-10 h-10 sm:w-14 sm:h-14 rotate-12 drop-shadow-sm opacity-80"
        viewBox="0 0 100 100"
        fill="#10B981"
      >
        <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
      </svg>

      {/* Street Art Crown - Bright Yellow */}
      <svg
        className="absolute top-44 left-8 sm:left-24 w-12 h-12 -rotate-12 opacity-90"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 75 L15 35 L38 55 L50 20 L62 55 L85 35 L85 75 Z" fill="#FEF3C7" />
        <circle cx="15" cy="30" r="4" fill="#FBBF24" />
        <circle cx="50" cy="15" r="4" fill="#FBBF24" />
        <circle cx="85" cy="30" r="4" fill="#FBBF24" />
      </svg>

      {/* Wavy Red/Coral String Squiggle */}
      <svg
        className="absolute top-72 left-2 sm:left-8 w-16 h-28 opacity-85 -rotate-6"
        viewBox="0 0 80 140"
        fill="none"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M15 10 Q 65 35, 20 65 T 60 120" />
      </svg>

      {/* Mini Crosses - Black & Green */}
      <div className="absolute top-36 left-2 sm:left-6 flex flex-col gap-1.5 opacity-70">
        <span className="text-sm font-mono font-black text-street-green">+</span>
        <span className="text-xs font-mono font-black text-street-red ml-2">+</span>
        <span className="text-sm font-mono font-black text-black">+</span>
      </div>

      {/* ================= TOP RIGHT ================= */}
      {/* Lightning Bolt - Coral Red */}
      <svg
        className="absolute top-20 right-6 sm:right-16 w-10 h-16 rotate-12 drop-shadow-sm opacity-90"
        viewBox="0 0 50 90"
        fill="#EF4444"
        stroke="#B91C1C"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <polygon points="30,0 5,45 25,45 15,90 45,35 25,35" />
      </svg>

      {/* Loop-de-loop Green String */}
      <svg
        className="absolute top-48 right-4 sm:right-28 w-24 h-24 opacity-80 rotate-45"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#059669"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M10 50 C 40 10, 80 20, 50 60 C 20 90, 80 90, 90 40" />
      </svg>

      {/* Hand-Drawn 5-point Star - Sunny Yellow */}
      <svg
        className="absolute top-80 right-8 sm:right-12 w-10 h-10 sm:w-12 sm:h-12 -rotate-12 opacity-85"
        viewBox="0 0 100 100"
        fill="#FFE600"
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
      </svg>

      {/* Graffiti Spray Dots */}
      <svg
        className="absolute top-32 right-24 sm:right-48 w-16 h-16 opacity-60"
        viewBox="0 0 80 80"
        fill="#10B981"
      >
        <circle cx="20" cy="20" r="3" />
        <circle cx="45" cy="15" r="4.5" />
        <circle cx="65" cy="35" r="2.5" fill="#EF4444" />
        <circle cx="30" cy="50" r="3.5" fill="#FBBF24" />
        <circle cx="55" cy="60" r="2" />
      </svg>

      {/* ================= MIDDLE LEFT ================= */}
      {/* Hand-Drawn Curved Arrow - Forest Green */}
      <svg
        className="hidden lg:block absolute top-[450px] left-8 w-20 h-20 -rotate-12 opacity-75"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#059669"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 70 Q 50 15, 80 40" />
        <polyline points="65,30 80,40 75,55" />
      </svg>

      {/* Graffiti Smiley Doodle - Yellow & Black */}
      <svg
        className="hidden md:block absolute top-[600px] left-6 sm:left-14 w-12 h-12 rotate-6 opacity-85"
        viewBox="0 0 100 100"
        fill="#FEF3C7"
        stroke="#111111"
        strokeWidth="5"
      >
        <circle cx="50" cy="50" r="42" fill="#FFE600" />
        <circle cx="36" cy="40" r="5" fill="#111111" />
        <circle cx="64" cy="40" r="5" fill="#111111" />
        <path d="M30 62 Q 50 82, 70 62" fill="none" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* ================= MIDDLE RIGHT ================= */}
      {/* Vibrant Red Spiral String */}
      <svg
        className="hidden md:block absolute top-[480px] right-6 sm:right-14 w-16 h-24 opacity-80 rotate-12"
        viewBox="0 0 60 100"
        fill="none"
        stroke="#DC2626"
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        <path d="M10 20 Q 50 20, 30 50 T 50 80" />
      </svg>

      {/* 4-point Sparkle Star - Red/Coral */}
      <svg
        className="hidden lg:block absolute top-[620px] right-8 sm:right-20 w-11 h-11 rotate-45 opacity-80"
        viewBox="0 0 100 100"
        fill="#EF4444"
      >
        <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
      </svg>

      {/* Double Zigzag Lines - Green & Black */}
      <svg
        className="hidden lg:block absolute top-[740px] right-6 sm:right-16 w-20 h-10 opacity-70"
        viewBox="0 0 100 50"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 15 L30 35 L50 15 L70 35 L90 15" stroke="#10B981" />
        <path d="M10 30 L30 50 L50 30 L70 50 L90 30" stroke="#111111" />
      </svg>

      {/* ================= BOTTOM LEFT ================= */}
      {/* Scribble Loop Ribbon - Sunny Yellow & Red */}
      <svg
        className="absolute bottom-28 left-4 sm:left-14 w-20 h-20 -rotate-45 opacity-80"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M15 85 Q 40 10, 85 45 Q 60 90, 25 35" />
      </svg>

      {/* Hashtag / Crosshatch - Green */}
      <div className="absolute bottom-12 left-8 sm:left-28 opacity-75 font-mono font-black text-2xl text-street-green rotate-12">
        #
      </div>

      {/* ================= BOTTOM RIGHT ================= */}
      {/* Dynamic Lightning Bolt - Green with Red outline */}
      <svg
        className="absolute bottom-24 right-6 sm:right-16 w-10 h-16 -rotate-12 opacity-85"
        viewBox="0 0 50 90"
        fill="#10B981"
        stroke="#065F46"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <polygon points="30,0 5,45 25,45 15,90 45,35 25,35" />
      </svg>

      {/* Wavy Ribbon Line - Coral Red */}
      <svg
        className="absolute bottom-10 right-14 sm:right-32 w-28 h-12 opacity-80"
        viewBox="0 0 120 40"
        fill="none"
        stroke="#EF4444"
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        <path d="M5 25 Q 35 5, 65 25 T 115 20" />
      </svg>
    </div>
  );
}
