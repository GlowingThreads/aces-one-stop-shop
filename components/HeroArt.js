// Decorative hero artwork drawn in SVG: a chrome spade with glass highlights. No photos or outside imagery.
export default function HeroArt() {
  const spade =
    "M100 8C100 8 18 88 18 140c0 34 25 55 53 55 12 0 22-5 29-13-3 23-12 40-31 50h62c-19-10-28-27-31-50 7 8 17 13 29 13 28 0 53-21 53-55C182 88 100 8 100 8Z";
  return (
    <svg className="hero-art" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
      <defs>
        {/* Chrome: bright sky, a dark horizon band, then a silver floor. */}
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.38" stopColor="#aeb3ba" />
          <stop offset="0.5" stopColor="#23272b" />
          <stop offset="0.56" stopColor="#0b3d2c" />
          <stop offset="0.75" stopColor="#c9ccd1" />
          <stop offset="1" stopColor="#5c626a" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#7d838c" />
          <stop offset="1" stopColor="#f2f4f7" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#14704c" stopOpacity="0.7" />
          <stop offset="1" stopColor="#14704c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="150" rx="100" ry="90" fill="url(#glow)" />
      <path d={spade} fill="url(#chrome)" stroke="url(#rim)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Glass highlights */}
      <path d="M96 30C70 58 36 104 34 138" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
      <path d="M150 112c9 13 14 25 14 34" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
