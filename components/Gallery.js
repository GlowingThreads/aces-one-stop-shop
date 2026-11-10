"use client";
import { useState } from "react";

export default function Gallery({ images, alt }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return <div className="ph" />;
  return (
    <div className="gallery">
      <img className="main" src={images[current]} alt={alt} />
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, n) => (
            <button key={src} onClick={() => setCurrent(n)} aria-label={`Show image ${n + 1}`} className={n === current ? "on" : ""}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
