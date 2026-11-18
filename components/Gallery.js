"use client";
import { useEffect, useRef, useState } from "react";

// Products with more photos than this show their thumbnails as one row that scrolls sideways,
// so a long flavour list does not push the buying panel down the page.
const MANY = 8;

// Product photos: a large photo with thumbnails underneath.
// `photos` is a list of { src, label }. When the customer picks an option on the product page (for example a
// flavour), the photo for that choice is shown. A photo belongs to a choice when its label (its alt text in
// Lightspeed, or the choice name for photos in lib/flavour-photos.js) is the choice's name; if no photo is
// labelled, photos are matched to choices by their order, as long as there is exactly one photo per choice.
export default function Gallery({ photos, alt }) {
  const [current, setCurrent] = useState(0);
  const strip = useRef(null);

  useEffect(() => {
    const tidy = (text) => String(text || "").trim().toLowerCase();
    function onChoice(event) {
      const { value, choices = [] } = event.detail || {};
      let index = photos.findIndex((photo) => photo.label && tidy(photo.label) === tidy(value));
      if (index < 0 && photos.length === choices.length) index = choices.findIndex((choice) => tidy(choice) === tidy(value));
      if (index >= 0) setCurrent(index);
    }
    window.addEventListener("product:choice", onChoice); // sent by components/ProductBuy.js
    return () => window.removeEventListener("product:choice", onChoice);
  }, [photos]);

  // Keep the selected thumbnail in view in the scrolling row, without moving the page itself.
  useEffect(() => {
    const row = strip.current;
    const thumb = row?.children[current];
    if (!row || !thumb || photos.length <= MANY) return;
    const left = thumb.offsetLeft - (row.clientWidth - thumb.offsetWidth) / 2;
    row.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [current, photos.length]);

  if (!photos.length) return <div className="ph" role="img" aria-label="No photo available" />;
  const photo = photos[current] || photos[0];
  return (
    <div className="gallery">
      {/* The whole photo is shown; a blurred copy fills any empty space around it (see .fit in globals.css) */}
      <div className="frame fit" style={{ backgroundImage: `url("${photo.src}")` }}>
        <img className="main" src={photo.src} alt={photo.label ? `${alt}, ${photo.label}` : alt} width="800" height="800" />
      </div>
      {photos.length > 1 && (
        <div
          ref={strip}
          className={photos.length > MANY ? "thumbs many" : "thumbs"}
          role="group"
          aria-label={`Product photos, ${photos.length}`}
        >
          {photos.map((item, n) => (
            <button
              key={item.src} type="button" onClick={() => setCurrent(n)}
              aria-label={item.label ? `Show ${item.label}` : `Show photo ${n + 1} of ${photos.length}`}
              aria-current={n === current ? "true" : undefined}
              className={n === current ? "on" : ""}
            >
              <img src={item.src} alt="" loading="lazy" width="72" height="72" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
