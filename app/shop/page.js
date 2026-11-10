import Link from "next/link";
import { getCategories, getProducts, SORTS } from "../../lib/ecwid";
import AddToCart from "../../components/AddToCart";

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return {
    title: "Shop",
    description: "Shop glass pipes, bongs, dab rigs, grinders, rolling papers, vapes and disposable vapes.",
    alternates: { canonical: "/shop" },
    robots: q ? { index: false } : undefined,
  };
}

export default async function Shop({ searchParams }) {
  const { category, q, sort } = await searchParams;
  const activeSort = sort in SORTS ? sort : "";
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category, keyword: q, sort: activeSort }),
  ]);

  return (
    <section className="wrap section">
      <h1 className="metal">Shop</h1>
      <form action="/shop" className="search" role="search">
        {category && <input type="hidden" name="category" value={category} />}
        <input type="search" name="q" defaultValue={q || ""} placeholder="Search products" aria-label="Search products" />
        <select name="sort" defaultValue={activeSort} aria-label="Sort products">
          {Object.entries(SORTS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button className="btn small" type="submit">Apply</button>
      </form>
      <div className="chips">
        <Link href="/shop" className={!category ? "chip on" : "chip"}>All</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/shop?category=${c.id}`} className={String(c.id) === category ? "chip on" : "chip"}>
            {c.name}
          </Link>
        ))}
      </div>
      {products.length === 0 ? (
        <p>No products found. Try a different search or category.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <article key={p.id} className="card">
              <Link href={`/shop/${p.id}`}>
                {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt={p.name} loading="lazy" /> : <div className="ph" />}
                <h3>{p.name}</h3>
              </Link>
              <p className="price">{p.defaultDisplayedPriceFormatted}</p>
              <AddToCart id={p.id} disabled={!p.inStock || p.demo} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
