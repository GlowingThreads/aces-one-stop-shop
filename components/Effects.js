"use client";
import { useEffect } from "react";

// Two small pointer effects for people using a mouse (they do nothing on touch screens):
//   1. A soft light follows the cursor across glass panels, as if light were catching the chrome edge.
//      It works by telling the panel under the cursor where the pointer is (--mx and --my); the CSS
//      in globals.css paints the glow there.
//   2. The hero artwork leans slightly toward the cursor (--tx and --ty, each from -1 to 1).
const GLOW = ".card, .tile, .features li, .panel, .buy, .search, .visit, .hero-facts";

export default function Effects() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lit = null, event = null, frame = 0;

    function update() {
      frame = 0;
      const target = event.target.closest?.(GLOW) || null;
      if (lit && lit !== target) { lit.style.removeProperty("--mx"); lit.style.removeProperty("--my"); }
      lit = target;
      if (lit) {
        const box = lit.getBoundingClientRect();
        lit.style.setProperty("--mx", `${event.clientX - box.left}px`);
        lit.style.setProperty("--my", `${event.clientY - box.top}px`);
      }
      const hero = document.querySelector(".hero");
      if (hero && !still.matches) {
        const box = hero.getBoundingClientRect();
        const inside = event.clientY < box.bottom;
        hero.style.setProperty("--tx", inside ? ((event.clientX - box.left) / box.width * 2 - 1).toFixed(3) : 0);
        hero.style.setProperty("--ty", inside ? ((event.clientY - box.top) / box.height * 2 - 1).toFixed(3) : 0);
      }
    }
    // At most one update per screen refresh, however fast the mouse moves.
    const onMove = (e) => { event = e; frame ||= requestAnimationFrame(update); };
    const onLeave = () => { if (lit) { lit.style.removeProperty("--mx"); lit.style.removeProperty("--my"); lit = null; } };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
