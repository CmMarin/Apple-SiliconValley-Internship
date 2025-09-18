import React from 'react';

export const Brain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M8 7a3 3 0 0 1 6 0v10a3 3 0 0 1-6 0"/>
    <path d="M5 10a3 3 0 0 1 6 0v7a3 3 0 1 1-6 0V10z"/>
    <path d="M13 10a3 3 0 1 1 6 0v7a3 3 0 1 1-6 0V10z"/>
  </svg>
);

export const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18"/>
    <path d="M12 3c2.5 3 2.5 15 0 18"/>
  </svg>
);

export const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M16 3v4M8 3v4M3 11h18"/>
  </svg>
);

export const Lightning = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
  </svg>
);

export const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v6l4 2"/>
  </svg>
);

export const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="11" cy="11" r="7"/>
    <path d="M21 21l-4.3-4.3"/>
  </svg>
);

export const Bell = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/>
    <path d="M9 19a3 3 0 0 0 6 0"/>
  </svg>
);

export const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a8.38 8.38 0 0 1 13 0"/>
  </svg>
);

export const Close = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

export const Tag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M20.59 13.41 12 22l-8-8 8-8 8.59 8.41z"/>
    <circle cx="7.5" cy="12.5" r="1.5"/>
  </svg>
);
