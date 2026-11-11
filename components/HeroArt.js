import ChromeSpade, { SPADE } from "./ChromeSpade";

// Decorative hero artwork drawn in SVG: an ace-of-spades card outline with a liquid-chrome spade breaking out of it.
// Everything is generated here (shapes, reflections and lighting). No photos or outside imagery.
export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 420 520" aria-hidden="true" focusable="false">
      <defs>
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

      {/* The chrome spade */}
      <g transform="translate(40 75) scale(1.7)">
        <ellipse cx="100" cy="246" rx="62" ry="5" fill="#000" opacity="0.55" />
        <ChromeSpade />
      </g>
    </svg>
  );
}
