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

// Smoke for the hero background: curling ribbons, each made of many fine lines that fan out and
// fold over themselves the way real smoke does. A soft haze sits behind them. Both drift slowly (see globals.css).
const W = 1600, H = 700;

// One ribbon. Every line follows the same looping path, but with a slightly larger curl than the
// line before it, so the lines bunch together and spread apart like a sheet of smoke.
function ribbon({ y0, loops, radius, wave, phase, lines, spread }) {
  const paths = [];
  for (let i = 0; i < lines; i++) {
    const f = i / (lines - 1);
    const r = radius * (0.2 + 0.8 * f);
    let d = "";
    for (let n = 0; n <= 110; n++) {
      const t = n / 110;
      const turn = 2 * Math.PI * loops * t + phase + f * 0.9;
      const x = -150 + (W + 300) * t + r * Math.sin(turn);
      const y = y0 + wave * Math.sin(2 * Math.PI * 1.3 * t + phase) + r * 0.8 * Math.cos(turn) + (f - 0.5) * spread * Math.sin(4 * Math.PI * t + phase);
      d += `${n ? "L" : "M"}${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    paths.push(<path key={i} d={d} strokeOpacity={(0.1 + 0.16 * f).toFixed(2)} />);
  }
  return paths;
}

const RIBBONS = [
  { y0: 300, loops: 3, radius: 170, wave: 90, phase: 0.6, lines: 13, spread: 70, color: "#e8edf1" },
  { y0: 430, loops: 2.4, radius: 130, wave: 70, phase: 2.9, lines: 11, spread: 90, color: "#7fd9b0" },
  { y0: 180, loops: 3.6, radius: 90, wave: 50, phase: 4.4, lines: 9, spread: 50, color: "#c9ccd1" },
];

export function Smoke() {
  return (
    <div className="smoke" aria-hidden="true">
      {/* Haze */}
      <svg className="haze" preserveAspectRatio="none" focusable="false">
        <filter id="fog" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.011" numOctaves="4" seed="7" />
          <feColorMatrix values="0 0 0 0 0.82  0 0 0 0 0.85  0 0 0 0 0.88  1.9 0 0 0 -0.82" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fog)" />
      </svg>
      {/* Ribbons */}
      <svg className="wisps" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <filter id="wisp" x="-5%" y="-20%" width="110%" height="140%">
          {/* A gentle warp so the lines are not perfectly regular, then a glow under the sharp lines */}
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="9" result="glow" />
          <feGaussianBlur in="warped" stdDeviation="2.6" result="fine" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="fine" /></feMerge>
        </filter>
        <g filter="url(#wisp)" fill="none" strokeWidth="3.4" strokeLinecap="round">
          {RIBBONS.map((r, i) => <g key={i} stroke={r.color}>{ribbon(r)}</g>)}
        </g>
      </svg>
    </div>
  );
}
