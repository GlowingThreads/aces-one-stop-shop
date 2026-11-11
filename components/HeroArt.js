// Decorative hero artwork drawn in SVG: a chrome spade with glass highlights, orbit rings and a floor reflection.
// No photos or outside imagery.
const SPADE =
  "M100 8C100 8 18 88 18 140c0 34 25 55 53 55 12 0 22-5 29-13-3 23-12 40-31 50h62c-19-10-28-27-31-50 7 8 17 13 29 13 28 0 53-21 53-55C182 88 100 8 100 8Z";

export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 400 470" aria-hidden="true" focusable="false">
      <defs>
        {/* Chrome: bright sky, a dark horizon band, then a silver floor. */}
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.36" stopColor="#aeb3ba" />
          <stop offset="0.49" stopColor="#1c2023" />
          <stop offset="0.56" stopColor="#0e4a35" />
          <stop offset="0.74" stopColor="#d5d8dc" />
          <stop offset="1" stopColor="#4d535a" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#7d838c" />
          <stop offset="1" stopColor="#f2f4f7" />
        </linearGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2f4f7" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f2f4f7" />
          <stop offset="1" stopColor="#f2f4f7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1c8f62" stopOpacity="0.75" />
          <stop offset="1" stopColor="#14704c" stopOpacity="0" />
        </radialGradient>
        {/* Fades the reflection out towards the bottom */}
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflect"><rect x="0" y="372" width="400" height="100" fill="url(#fade)" /></mask>
      </defs>

      <ellipse cx="200" cy="230" rx="200" ry="190" fill="url(#glow)" />
      {/* Orbit rings behind the spade */}
      <g fill="none" stroke="url(#ring)" strokeWidth="1.2">
        <ellipse cx="200" cy="215" rx="190" ry="58" transform="rotate(-18 200 215)" />
        <ellipse cx="200" cy="215" rx="170" ry="40" transform="rotate(24 200 215)" opacity="0.6" />
      </g>

      {/* Floor reflection */}
      <g mask="url(#reflect)">
        <path d={SPADE} fill="url(#chrome)" transform="translate(62 742) scale(1.38 -1.38)" />
      </g>
      <ellipse cx="200" cy="372" rx="120" ry="7" fill="#000" opacity="0.6" />

      <g transform="translate(62 40) scale(1.38)">
        <path d={SPADE} fill="url(#chrome)" stroke="url(#rim)" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Glass highlights */}
        <path d="M96 30C70 58 36 104 34 138" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 112c9 13 14 25 14 34" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <g fill="#fff">
        <path d="M318 96l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" />
        <path d="M78 286l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" opacity="0.7" />
      </g>
    </svg>
  );
}

// Smoke for the hero background: two layers of generated cloud texture that drift slowly (see globals.css).
export function Smoke() {
  return (
    <div className="smoke" aria-hidden="true">
      {[7, 23].map((seed) => (
        <svg key={seed} preserveAspectRatio="none" focusable="false">
          <filter id={`fog-${seed}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.011" numOctaves="4" seed={seed} />
            {/* Turn the noise into silver wisps: colour is fixed, and only the brighter noise stays visible. */}
            <feColorMatrix values="0 0 0 0 0.82  0 0 0 0 0.85  0 0 0 0 0.88  1.9 0 0 0 -0.82" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#fog-${seed})`} />
        </svg>
      ))}
    </div>
  );
}
