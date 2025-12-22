
import React from 'react';

export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shape */}
      <path 
        d="M20 15H80V30L35 75H20V60L65 15H20V15Z" 
        fill="currentColor"
      />
      {/* Visual Stripe Voids / Accents mimicking the provided design */}
      <path 
        d="M40 15L15 40V55L55 15H40Z" 
        fill="currentColor" 
        fillOpacity="0.4"
      />
      <path 
        d="M85 45L45 85H60L85 60V45Z" 
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path 
        d="M20 85H80V70L35 25H20V40L65 85H20V85Z" 
        fill="currentColor"
      />
    </svg>
  );
}
