import React from 'react';

export default function Logo({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Professional Black Squircle with Border */}
      <rect x="5" y="5" width="90" height="90" rx="24" fill="#000000" stroke="white" strokeWidth="2" />
      
      {/* LH Monogram in White */}
      <path 
        d="M32 32V68H48" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
      <path 
        d="M54 32V68" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
      <path 
        d="M74 32V68" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
      <path 
        d="M54 50H74" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
    </svg>
  );
}
