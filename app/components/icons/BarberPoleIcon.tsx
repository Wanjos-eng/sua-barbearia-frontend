// app/components/icons/BarberPoleIcon.tsx
import React from 'react';

export const BarberPoleIcon = ({ className }: { className?: string }) => {
  // Use `currentColor` so the icon color can be controlled via Tailwind's text-* classes
  return (
    <svg
      viewBox="0 0 47 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath="url(#clip0_16_153)">
        <path d="M23.5 0C10.5213 0 0 10.5213 0 23.5V81.5C0 94.4787 10.5213 105 23.5 105C36.4787 105 47 94.4787 47 81.5V23.5C47 10.5213 36.4787 0 23.5 0Z" fill="currentColor" />
        <path d="M-4.5 15.5L51.5 3.5V-7.5L-4.5 4.5V15.5Z" fill="currentColor"/>
        <path d="M-4.5 35.5L51.5 23.5V12.5L-4.5 24.5V35.5Z" fill="currentColor"/>
        <path d="M-4.5 55.5L51.5 43.5V32.5L-4.5 44.5V55.5Z" fill="currentColor"/>
        <path d="M-4.5 75.5L51.5 63.5V52.5L-4.5 64.5V75.5Z" fill="currentColor"/>
        <path d="M-4.5 95.5L51.5 83.5V72.5L-4.5 84.5V95.5Z" fill="currentColor"/>
        <path d="M-4.5 115.5L51.5 103.5V92.5L-4.5 104.5V115.5Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_16_153">
          <rect width="47" height="105" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
