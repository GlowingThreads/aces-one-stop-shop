import Link from "next/link";
import site from "../site.config";
import { getCategories, childrenOf } from "../lib/ecwid";
import { Hours, tel } from "./Sections";
import Spade from "./Spade";

export default async function Footer() {
  const categories = childrenOf(await getCategories(), 0).slice(0, 6);
  return (
    <footer className="footer">
      <div className="wrap foot">
        <div className="foot-brand">
          <p className="brand"><Spade size={26} /><span className="metal">{site.name}</span></p>
          <p>{site.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <h2>Explore</h2>
          <Link href="/shop">Shop all</Link>
          <Link href="/about">About Us</Link>
          <Link href="/find-us">Find Us</Link>
        </nav>
        {categories.length > 0 && (
          <nav aria-label="Categories">
            <h2>Categories</h2>
            {categories.map((c) => <Link key={c.id} href={`/shop?category=${c.id}`}>{c.name}</Link>)}
          </nav>
        )}
        <div>
          <h2>Visit</h2>
          <address>
            {site.address}<br />
            <a href={tel}>{site.phone}</a>
            {site.email && <><br /><a href={`mailto:${site.email}`}>{site.email}</a></>}
          </address>
          <Hours />
        </div>
        <p className="fine">
          Products are for adults aged {site.minAge} and over. Cannabis accessories are sold for use with legal products only.
          <span>© {new Date().getFullYear()} {site.name}</span>
        </p>
      </div>
    </footer>
  );
}
