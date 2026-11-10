"use client";
import site from "../../site.config";

// Catches unexpected failures on the shop and product pages (for example Ecwid being unreachable).
export default function ShopError({ reset }) {
  return (
    <section className="wrap section">
      <div className="notice" role="alert">
        <h1 className="metal">Something went wrong</h1>
        <p>We could not load this page right now. Please try again in a moment, or call the store at {site.phone}.</p>
        <button className="btn small" onClick={() => reset()}>Try again</button>
      </div>
    </section>
  );
}
