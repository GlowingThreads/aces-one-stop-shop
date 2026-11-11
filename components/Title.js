"use client";
import { useEffect, useRef } from "react";

// The main heading of a page.
//
// The heading is ordinary text first (readable by search engines and screen readers, and shown if
// anything below fails). On top of it, `chrome` draws the same words as real 3D chrome lettering:
// solid letters with bevelled edges that mirror a small studio of lights, in the style of the logo.
// See lib/chromeText.js for the drawing. `lines` splits a title so each line animates on its own.
export default function Title({ text, lines = [text], chrome = true }) {
  const wrap = useRef(null);

  useEffect(() => {
    if (!chrome) return;
    let stop = () => {};
    let cancelled = false;
    // Loaded only in the browser and only when needed, so three.js never slows the first paint.
    import("../lib/chromeText").then(({ mountChromeText }) => {
      if (!cancelled && wrap.current) stop = mountChromeText(wrap.current);
    }).catch(() => {}); // the plain heading stays visible
    return () => { cancelled = true; stop(); };
  }, [chrome, text]);

  return (
    <div className="title-wrap" ref={wrap}>
      <h1 className="title">
        {lines.map((line, i) => (
          <span className="line" key={line}>
            {/* Each word is wrapped so the 3D drawing can find where the browser placed it. */}
            {line.split(" ").map((word, n) => <span key={n}><span className="w">{word}</span> </span>)}
            {i < lines.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
    </div>
  );
}
