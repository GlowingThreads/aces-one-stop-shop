"use client";
import { useState } from "react";

export default function Gallery({ images, alt }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return <div className="ph" role="img" aria-label="No photo available" />;
  return (
    <div className="gallery">
      {/* The whole photo is shown; a blurred copy fills any empty space around it (see .fit in globals.css) */}
      <div className="frame fit" style={{ backgroundImage: `url("${images[current]}")` }}>
        <img className="main" src={images[current]} alt={alt} width="800" height="800" />
      </div>
      {images.length > 1 && (
        <div className="thumbs" role="group" aria-label="Product photos">
          {images.map((src, n) => (
            <button
              key={src} type="button" onClick={() => setCurrent(n)}
              aria-label={`Show photo ${n + 1} of ${images.length}`} aria-current={n === current ? "true" : undefined}
              className={n === current ? "on" : ""}
            >
              <img src={src} alt="" loading="lazy" width="72" height="72" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
