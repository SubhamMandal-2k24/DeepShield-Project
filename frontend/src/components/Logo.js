import React from "react";

function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 4L42 11V22C42 33 34.5 41.5 24 44C13.5 41.5 6 33 6 22V11L24 4Z"
        stroke="url(#shieldGradient)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="23" r="8" stroke="#00ffb2" strokeWidth="1.5" />
      <line x1="24" y1="15" x2="24" y2="31" stroke="#00ffb2" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="23" x2="32" y2="23" stroke="#00ffb2" strokeWidth="1" opacity="0.5" />
      <circle cx="24" cy="23" r="2.5" fill="#00ffb2" />
      <defs>
        <linearGradient id="shieldGradient" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00ffb2" />
          <stop offset="100%" stopColor="#ff2e93" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Logo;