import Link from "next/link";
import site from "../site.config";
import { getCategories, childrenOf } from "../lib/ecwid";

export default async function Home() {
  const categories = childrenOf(await getCategories(), 0); // top-level categories only
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="metal">{site.name}</h1>
          <p className="lead">
            Glassware, smoking accessories and nicotine vapes under one roof. Browse the range online or stop by the store.
          </p>
          <div className="actions">
            <Link className="btn" href="/shop">Shop all products</Link>
            <Link className="btn ghost" href="/find-us">Find the store</Link>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <h2>Shop by category</h2>
        <div className="tiles">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.id}`} className="tile">{c.name}</Link>
          ))}
        </div>
      </section>
    </>
  );
}
