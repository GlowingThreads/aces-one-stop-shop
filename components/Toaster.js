"use client";
import { useEffect, useRef, useState } from "react";

// A small confirmation that slides up from the bottom of the screen, e.g. after adding to the cart.
// Any component can show one with:  toast("Added to cart", { detail: "Product name", cart: true })
export function toast(message, options = {}) {
  window.dispatchEvent(new CustomEvent("shop:toast", { detail: { message, ...options } }));
}

export default function Toaster() {
  const [note, setNote] = useState(null);   // what to show
  const [open, setOpen] = useState(false);  // whether it is on screen (kept separate so it can slide out)
  const timer = useRef(0);

  useEffect(() => {
    const show = (e) => {
      setNote(e.detail);
      setOpen(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(false), 4500);
    };
    window.addEventListener("shop:toast", show);
    return () => { window.removeEventListener("shop:toast", show); clearTimeout(timer.current); };
  }, []);

  return (
    // role="status" makes screen readers announce the message without interrupting.
    <div className={open ? "toast open" : "toast"} role="status" aria-live="polite">
      {note && (
        <>
          <span className="toast-tick" aria-hidden="true">✓</span>
          <p>
            <strong>{note.message}</strong>
            {note.detail && <span>{note.detail}</span>}
          </p>
          {note.cart && (
            <button
              className="btn small" tabIndex={open ? 0 : -1}
              onClick={() => { setOpen(false); window.dispatchEvent(new Event("cart:open")); }}
            >
              View cart
            </button>
          )}
          <button className="toast-close" aria-label="Dismiss" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>×</button>
        </>
      )}
    </div>
  );
}
