// Chrome lettering for page titles. Each line reflects a bright sky, a dark horizon and a pale floor,
// a lighting filter raises the letter edges, and a band of light sweeps across now and then (see globals.css).
// Screen readers get the plain text from aria-label; the styled copies are hidden from them.
export default function ChromeTitle({ text, lines = [text], small = false }) {
  return (
    <h1 className={small ? "chrome-title small" : "chrome-title"} aria-label={text}>
      {lines.map((line) => (
        <span className="line" key={line} data-text={line} aria-hidden="true">
          <span className="chrome-lit"><span className="chrome-text">{line}</span></span>
        </span>
      ))}
    </h1>
  );
}

// The lighting filters used by ChromeTitle. Placed once in the layout so every page can use them.
// "type-chrome" is for the large home page title, "type-chrome-sm" for smaller titles.
export function ChromeFilters() {
  const filter = (id, blur, scale, shadow) => (
    <filter id={id} x="-5%" y="-20%" width="110%" height="150%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="soft" />
      <feSpecularLighting in="soft" surfaceScale={scale} specularConstant="1.1" specularExponent="34" lightingColor="#ffffff" result="light">
        <feDistantLight azimuth="235" elevation="55" />
      </feSpecularLighting>
      <feComposite in="light" in2="SourceAlpha" operator="in" result="edge" />
      <feDropShadow in="SourceGraphic" dx="0" dy={shadow} stdDeviation={shadow * 1.2} floodColor="#000" floodOpacity="0.65" result="shadowed" />
      <feMerge><feMergeNode in="shadowed" /><feMergeNode in="edge" /></feMerge>
    </filter>
  );
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      {filter("type-chrome", 1.8, 5, 8)}
      {filter("type-chrome-sm", 1.1, 3.5, 5)}
    </svg>
  );
}
