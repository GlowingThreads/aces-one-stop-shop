"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { showSnap } from "../lib/titleSnapshot";

// The main heading of a page.
//
// The heading is ordinary text first (readable by search engines and screen readers, and shown if
// anything below fails). On top of it, `chrome` draws the same words as real 3D chrome lettering:
// solid letters with bevelled edges that mirror soft surroundings, in the style of the logo.
// See lib/chromeText.js for the drawing. `lines` splits a title so each line sits on its own row.

// The 3D code is fetched in the background as soon as any page with a title loads, and kept.
// `chromeText` is filled in when it has arrived.
let chromeText = null;
const loading = typeof window === "undefined"
  ? null
  : import("../lib/chromeText").then((module) => { chromeText = module; return module.prepare().then(() => module); }).catch(() => null);

// Runs before the browser paints, so on later pages the chrome is in place from the first frame.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Title({ text, lines = [text], chrome = true }) {
  const wrap = useRef(null);

  useBeforePaint(() => {
    if (!chrome) return;
    const el = wrap.current;
    let stop = () => {};
    let cancelled = false;
    let picture = null;

    if (chromeText?.isReady()) {
      // Already loaded (moving between pages): draw straight away, with no fade.
      stop = chromeText.mountChromeText(el, { instant: true });
    } else {
      // First page of the visit: the 3D code is still loading. If this title has been seen before, show
      // the saved picture of it at once; otherwise the plain heading shows and then fades to chrome.
      picture = showSnap(el);
      // Called once the live drawing has taken over, or once it is clear this device cannot draw 3D.
      const settle = (drew) => {
        picture?.remove();
        picture = null;
        if (!drew) el.classList.remove("is-3d", "instant"); // back to the plain heading
      };
      loading?.then((module) => {
        if (cancelled) return;
        if (!module) return settle(false);
        stop = module.mountChromeText(el, { instant: Boolean(picture), onSettled: settle });
      });
    }

    return () => {
      cancelled = true;
      stop();
      picture?.remove();
      el.classList.remove("is-3d", "instant");
    };
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
