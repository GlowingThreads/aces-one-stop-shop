// Decorative hero artwork drawn in SVG: an ace-of-spades card outline with a liquid-chrome spade breaking out of it.
// Everything is generated here (shapes, reflections and lighting). No photos or outside imagery.
const SPADE =
  "M100 6C112 40 190 86 190 140c0 32-24 54-52 54-16 0-29-7-36-18 2 24 12 46 32 58H66c20-12 30-34 32-58-7 11-20 18-36 18-28 0-52-22-52-54C10 86 88 40 100 6Z";

export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 420 520" aria-hidden="true" focusable="false">
      <defs>
        {/* Bands of light and dark that become the "reflections" in the chrome */}
        <linearGradient id="bands" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#f7f8fa" />
          <stop offset="0.14" stopColor="#c3c7cd" />
          <stop offset="0.22" stopColor="#3a3f45" />
          <stop offset="0.3" stopColor="#eef0f3" />
          <stop offset="0.42" stopColor="#8d939b" />
          <stop offset="0.5" stopColor="#0a0c0d" />
          <stop offset="0.57" stopColor="#0f5a3f" />
          <stop offset="0.64" stopColor="#1c8f62" />
          <stop offset="0.7" stopColor="#dfe2e6" />
          <stop offset="0.82" stopColor="#6b7178" />
          <stop offset="0.9" stopColor="#15181a" />
          <stop offset="1" stopColor="#b9bdc3" />
        </linearGradient>
        {/* Bends the bands so they flow like liquid metal */}
        <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="95" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        {/* Rounded, lit edge so the spade reads as a solid object */}
        <filter id="bevel" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="soft" />
          <feSpecularLighting in="soft" surfaceScale="7" specularConstant="1.15" specularExponent="26" lightingColor="#ffffff" result="light">
            <feDistantLight azimuth="235" elevation="52" />
          </feSpecularLighting>
          <feComposite in="light" in2="SourceAlpha" operator="in" result="lit" />
          <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0" k2="1" k3="0.9" k4="0" />
        </filter>
        <clipPath id="spade-clip"><path d={SPADE} /></clipPath>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1c8f62" stopOpacity="0.7" />
          <stop offset="1" stopColor="#14704c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="card-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f4f7" />
          <stop offset="0.5" stopColor="#f2f4f7" stopOpacity="0.15" />
          <stop offset="1" stopColor="#f2f4f7" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="card-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.015" />
          <stop offset="1" stopColor="#14704c" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="270" rx="210" ry="230" fill="url(#glow)" />

      {/* The card: a glass panel with hairline edges and ace corner marks */}
      <g transform="rotate(-9 210 260)">
        <rect x="70" y="40" width="280" height="440" rx="18" fill="url(#card-glass)" stroke="url(#card-edge)" strokeWidth="1.2" />
        <rect x="84" y="54" width="252" height="412" rx="10" fill="none" stroke="#f2f4f7" strokeOpacity="0.14" strokeWidth="1" />
        <g fill="#f2f4f7" style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 600, fontSize: 30 }}>
          <text x="100" y="98">A</text>
          <path d={SPADE} transform="translate(101 106) scale(0.105)" />
          <g transform="rotate(180 210 260)">
            <text x="100" y="98">A</text>
            <path d={SPADE} transform="translate(101 106) scale(0.105)" />
          </g>
        </g>
      </g>

      {/* Outline echoes behind the spade, like engraved contour lines */}
      <g fill="none" stroke="#f2f4f7" strokeWidth="0.5">
        <path d={SPADE} transform="translate(-10 14) scale(2.2)" strokeOpacity="0.1" />
        <path d={SPADE} transform="translate(15 44) scale(1.95)" strokeOpacity="0.18" />
      </g>

      {/* The liquid-chrome spade */}
      <g transform="translate(40 75) scale(1.7)">
        <ellipse cx="100" cy="246" rx="62" ry="5" fill="#000" opacity="0.55" />
        <g filter="url(#bevel)">
          <g clipPath="url(#spade-clip)">
            <rect x="-60" y="-60" width="320" height="360" fill="url(#bands)" filter="url(#liquid)" />
          </g>
        </g>
        <path d={SPADE} fill="none" stroke="#f2f4f7" strokeOpacity="0.55" strokeWidth="0.8" />
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
