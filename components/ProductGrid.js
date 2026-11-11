"use client";
import { useState } from "react";
import ProductCard, { SkeletonCard } from "./ProductCard";

// Shows the first page of products (rendered on the server) and loads further pages on request.
// `query` is the current filter as a query string, e.g. "category=3&sort=PRICE_ASC".
export default function ProductGrid({ initial, total, query }) {
  const [items, setItems] = useState(initial);
  const [state, setState] = useState("idle"); // idle | loading | error

  async function loadMore() {
    setState("loading");
    try {
      const res = await fetch(`/api/products?${query}${query ? "&" : ""}offset=${items.length}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      // Skip any product already shown, in case the catalog changed between requests.
      setItems((old) => [...old, ...data.items.filter((p) => !old.some((o) => o.id === p.id))]);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const remaining = Math.max(0, total - items.length);
  return (
    <>
      <div className="grid">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
        {state === "loading" && Array.from({ length: Math.min(remaining, 4) }, (_, i) => <SkeletonCard key={`s${i}`} />)}
      </div>
      <div className="more">
        <p role="status">Showing {items.length} of {Math.max(total, items.length)} products</p>
        {state === "error" && <p className="notice" role="alert">We could not load more products. Please try again.</p>}
        {remaining > 0 && (
          <button className="btn ghost" onClick={loadMore} disabled={state === "loading"}>
            {state === "loading" ? "Loading" : "Load more"}
          </button>
        )}
      </div>
    </>
  );
}
