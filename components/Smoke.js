"use client";
import { useEffect, useRef } from "react";

// Smoke behind the hero: a short, silent, looping video (public/smoke.mp4).
// The clip is smoke on black, and CSS blends the black away so only the smoke shows.
// Visitors who ask for reduced motion get the still poster image instead.
export default function Smoke() {
  const video = useRef(null);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true; // browsers only allow autoplay for muted video
    v.play().catch(() => {}); // if the browser still refuses, the poster stays visible
  }, []);

  return (
    <div className="smoke" aria-hidden="true">
      <video ref={video} muted loop playsInline preload="metadata" poster="/smoke-poster.jpg" tabIndex={-1}>
        <source src="/smoke.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
