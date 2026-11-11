// Small line icons for the home page. Drawn here so no icon package is needed.
const paths = {
  glass: <><path d="M9 3h6M10 3v6l-4.5 8.5A2.5 2.5 0 0 0 7.7 21h8.6a2.5 2.5 0 0 0 2.2-3.5L14 9V3" /><path d="M7.5 15h9" /></>,
  tools: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" /></>,
  vape: <><rect x="8" y="7" width="8" height="14" rx="2" /><path d="M10 7V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V7M11 12h2" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" /><circle cx="12" cy="9.500" r="2.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20.500c1.200-3.600 4.300-5.500 8-5.500s6.800 1.900 8 5.500" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  phone: <path d="M5 4h4l1.500 4.500-2 1.500a12 12 0 0 0 5.500 5.500l1.500-2L20 15v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
};

export default function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name] || paths.glass}
    </svg>
  );
}
