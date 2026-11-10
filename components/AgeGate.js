"use client";
import { useEffect, useState } from "react";

export default function AgeGate({ minAge }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("age-verified")) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function confirm() {
    try { localStorage.setItem("age-verified", "1"); } catch {}
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-box">
        <h2 id="gate-title" className="metal">Are you {minAge} or older?</h2>
        <p>This site sells products for adults only. You must be {minAge}+ to enter.</p>
        <div className="actions">
          <button className="btn" onClick={confirm}>Yes, I am {minAge}+</button>
          <a className="btn ghost" href="https://www.google.com">No, leave</a>
        </div>
      </div>
    </div>
  );
}
