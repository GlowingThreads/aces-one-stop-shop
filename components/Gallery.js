"use client";
import { useEffect, useState } from "react";

// Product photos: a large photo with thumbnails underneath.
// `photos` is a list of { src, label }. When the customer picks an option on the product page (for example a
// flavour), the photo for that choice is shown. A photo belongs to a choice when its label (its alt text in
// Lightspeed) is the choice's name; if no photo is labelled, photos are matched to choices by their order,
// as long as there is exactly one photo per choice.
export default function Gallery({ photos, alt }) {
  const [current, setCurrent] = useState(0);

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

  if (!photos.length) return <div className="ph" role="img" aria-label="No photo available" />;
  const photo = photos[current] || photos[0];
  return (
    <div className="gallery">
      {/* The whole photo is shown; a blurred copy fills any empty space around it (see .fit in globals.css) */}
      <div className="frame fit" style={{ backgroundImage: `url("${photo.src}")` }}>
        <img className="main" src={photo.src} alt={photo.label ? `${alt}, ${photo.label}` : alt} width="800" height="800" />
      </div>
      {photos.length > 1 && (
        <div className="thumbs" role="group" aria-label="Product photos">
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
