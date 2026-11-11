import Link from "next/link";
import site from "../site.config";
import { getCategories, getProducts, childrenOf } from "../lib/ecwid";
import HeroArt from "../components/HeroArt";
import Smoke from "../components/Smoke";
import Title from "../components/Title";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import { Highlights, Hours, Cta, tel } from "../components/Sections";


export default async function Home() {
  const [all, latest] = await Promise.all([
    getCategories(),
    getProducts({ sort: "ADDED_TIME_DESC", limit: 8 }),
  ]);
  const categories = childrenOf(all, 0); // top-level categories only
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

  // "Ace's One Stop Shop" becomes ["Ace's One", "Stop Shop"]
  const words = site.name.split(" ");
  const titleLines = [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")].filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <Smoke />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">{site.city} · {site.minAge}+ only</p>
            {/* The name is split over two lines so each can be styled and animated on its own. */}
            <Title text={site.name} lines={titleLines} />
            <p className="lead">{site.tagline}</p>
            <div className="actions">
              <Link className="btn" href="/shop">Shop all products</Link>
              <Link className="btn ghost" href="/find-us">Find the store</Link>
            </div>
          </div>
          <HeroArt />
        </div>
        {/* Store facts along the bottom edge of the hero */}
        <div className="wrap">
          <ul className="hero-facts">
            <li><Icon name="pin" /><span><strong>Visit</strong>{site.address}</span></li>
            <li>
              <Icon name="clock" />
              {site.hours.length ? (
                <span><strong>{site.hours[0][0]}</strong>{site.hours[0][1]}</span>
              ) : (
                <span><strong>Hours</strong><a href={site.googleUrl} target="_blank" rel="noopener noreferrer">Today's hours on Google</a></span>
              )}
            </li>
            <li><Icon name="phone" /><span><strong>Call</strong><a href={tel}>{site.phone}</a></span></li>
          </ul>
        </div>
      </section>

      {/* Category names scrolling across a divider strip */}
      {categories.length > 0 && (
        <div className="strip" aria-hidden="true">
          {/* The same list twice, side by side. The pair slides left by exactly one list, so the loop is seamless. */}
          <div className="strip-track">
            {[0, 1].map((copy) => (
              <p key={copy}>
                {categories.concat(categories).map((c, i) => <span key={i}>{c.name}</span>)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="wrap section" aria-labelledby="cat-title">
          <div className="section-head reveal">
            <p className="eyebrow">Browse</p>
            <h2 id="cat-title">Shop by category</h2>
            <Link href="/shop" className="more-link">View everything <span aria-hidden="true">→</span></Link>
          </div>
          <ul className="tiles">
            {categories.map((c, i) => (
              <li key={c.id} className="reveal">
                <Link
                  href={`/shop?category=${c.id}`}
                  className={c.image ? "tile has-image fit" : "tile"}
                  style={c.image ? { backgroundImage: `url("${c.image}")` } : undefined}
                >
                  {c.image && <img src={c.image} alt="" loading="lazy" />}
                  <span className="tile-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="tile-name">{c.name}</span>
                  <span className="tile-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Newest products */}
      {latest.items.length > 0 && (
        <section className="band" aria-labelledby="new-title">
          <div className="wrap section">
            <div className="section-head reveal">
              <p className="eyebrow">Just in</p>
              <h2 id="new-title">New arrivals</h2>
              <Link href="/shop?sort=ADDED_TIME_DESC" className="more-link">See all new products <span aria-hidden="true">→</span></Link>
            </div>
            <div className="grid four">
              {latest.items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* What we carry */}
      <section className="wrap section" aria-labelledby="carry-title">
        <div className="section-head reveal">
          <p className="eyebrow">In store and online</p>
          <h2 id="carry-title">What we carry</h2>
        </div>
        <Highlights />
      </section>

      {/* Visit */}
      <section className="wrap section" aria-labelledby="visit-title">
        <div className="visit reveal">
          <div className="visit-info">
            <p className="eyebrow">Come by</p>
            <h2 id="visit-title">Visit the store</h2>
            <address>
              {site.address}<br />
              <a href={tel}>{site.phone}</a>
            </address>
            <Hours />
            <Link className="btn" href="/find-us">Map and directions</Link>
          </div>
          <iframe className="map" title={`Map showing ${site.name}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <Cta />
    </>
  );
}
