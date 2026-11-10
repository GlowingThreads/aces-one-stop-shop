import { SkeletonCard } from "../../components/ProductCard";

// Shown while the shop or a product page is waiting for Ecwid.
export default function Loading() {
  return (
    <section className="wrap section" aria-busy="true">
      <p className="sr-only" role="status">Loading products</p>
      <div className="sk-line title" aria-hidden="true" />
      <div className="grid">
        {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
      </div>
    </section>
  );
}
