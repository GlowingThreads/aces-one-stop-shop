import Link from "next/link";
import AddToCart from "./AddToCart";

// One product tile. Used by the shop grid and by "You may also like".
export default function ProductCard({ product: p }) {
  return (
    <article className="card">
      <Link href={`/shop/${p.id}`} className="card-link">
        {/* "fit" shows the whole photo; the background is a blurred copy that fills any empty space (see globals.css) */}
        <div className={p.image ? "card-media fit" : "card-media"} style={p.image ? { backgroundImage: `url("${p.image}")` } : undefined}>
          {p.image ? <img src={p.image} alt="" loading="lazy" width="400" height="400" /> : <div className="ph" />}
          {!p.inStock && <span className="tag">Out of stock</span>}
        </div>
        <h3>{p.name}</h3>
      </Link>
      <p className="price">{p.price}</p>
      {p.hasOptions && p.inStock ? (
        // Products with sizes, colours and so on must be configured on their own page.
        <Link href={`/shop/${p.id}`} className="btn small ghost" aria-label={`Choose options for ${p.name}`}>
          Choose options
        </Link>
      ) : (
        <AddToCart id={p.id} name={p.name} disabled={!p.inStock || p.demo} />
      )}
    </article>
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="ph" />
      <div className="sk-line" />
      <div className="sk-line short" />
    </div>
  );
}
