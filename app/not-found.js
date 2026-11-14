import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap lost">
      <img src="/spade-plain.webp" alt="" width="220" height="230" />
      <p className="eyebrow">Error 404</p>
      <h1 className="metal">This page is not in the deck</h1>
      <p>The page does not exist, or the product is no longer available.</p>
      <div className="actions">
        <Link className="btn" href="/shop">Go to the shop</Link>
        <Link className="btn ghost" href="/">Home</Link>
      </div>
    </section>
  );
}
