"use client";
import { useEffect, useRef, useState } from "react";
import { AGE_KEY } from "../lib/inline";

// Full-screen age check. It is part of the server-rendered page, so it covers the content from the first paint.
// For returning visitors a script in <head> (see lib/inline.js) hides it before anything is drawn.
export default function AgeGate({ minAge }) {
  const [open, setOpen] = useState(true);
  const yes = useRef(null);

  useEffect(() => {
    if (document.documentElement.dataset.age === "ok") return setOpen(false);
    // Make the page behind the gate unreachable by keyboard and screen readers.
    const page = document.getElementById("site");
    page?.setAttribute("inert", "");
    yes.current?.focus();
    return () => page?.removeAttribute("inert");
  }, []);

  function confirm() {
    // Remember the answer wherever the browser allows. If nothing is allowed, it lasts until the page is reloaded.
    try { localStorage.setItem(AGE_KEY, "1"); } catch {}
    try { document.cookie = `${AGE_KEY}=1; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`; } catch {}
    document.documentElement.dataset.age = "ok";
    document.getElementById("site")?.removeAttribute("inert");
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-text">
      <div className="gate-box">
        <h2 id="gate-title" className="metal">Are you {minAge} or older?</h2>
        <p id="gate-text">This site sells products for adults only. You must be {minAge}+ to enter.</p>
        <div className="actions">
          <button ref={yes} className="btn" onClick={confirm}>Yes, I am {minAge}+</button>
          <a className="btn ghost" href="https://www.google.com">No, leave</a>
        </div>
        <noscript><p>Please turn on JavaScript to confirm your age and use this site.</p></noscript>
      </div>
    </div>
  );
}
