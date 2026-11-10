import Link from "next/link";
import site from "../site.config";
import { getCategories, childrenOf } from "../lib/ecwid";
import HeroArt from "../components/HeroArt";

export default async function Home() {
  const categories = childrenOf(await getCategories(), 0); // top-level categories only
  return (
    <>
      <section className="hero">
        {/* Two soft smoke layers, drawn and animated in CSS */}
        <div className="smoke" aria-hidden="true" />
        <div className="wrap hero-inner">
          <div>
            <p className="eyebrow">Alberta · {site.minAge}+ only</p>
            <h1 className="metal">{site.name}</h1>
            <p className="lead">
              Glassware, smoking accessories and nicotine vapes under one roof. Browse the range online or stop by the store.
            </p>
            <div className="actions">
              <Link className="btn" href="/shop">Shop all products</Link>
              <Link className="btn ghost" href="/find-us">Find the store</Link>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="wrap section" aria-labelledby="cat-title">
          <h2 id="cat-title">Shop by category</h2>
          <ul className="tiles">
            {categories.map((c, i) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.id}`} className="tile">
                  <span className="tile-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="tile-name">{c.name}</span>
                  <span className="tile-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap section" aria-labelledby="visit-title">
        <div className="panel visit">
          <div>
            <h2 id="visit-title">Visit the store</h2>
            <p>{site.address}</p>
            <p><a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a></p>
            <Link className="btn small ghost" href="/find-us">Map and directions</Link>
          </div>
          <dl className="hours">
            {site.hours.map(([d, h]) => (
              <div key={d}><dt>{d}</dt><dd>{h}</dd></div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
