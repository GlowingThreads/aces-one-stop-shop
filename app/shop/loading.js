import { SkeletonCard } from "../../components/ProductCard";
import PageHero from "../../components/PageHero";

// Shown while the shop or a product page is waiting for Ecwid.
export default function Loading() {
  return (
    <div aria-busy="true">
      <PageHero eyebrow="Loading" title="Shop" />
      <section className="wrap section">
        <p className="sr-only" role="status">Loading products</p>
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    </div>
  );
}
