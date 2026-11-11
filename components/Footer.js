import Link from "next/link";
import site from "../site.config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot">
        <div>
          <p className="brand metal">{site.name}</p>
          <address>
            {site.address}<br />
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
          </address>
        </div>
        <nav aria-label="Footer">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/find-us">Find Us</Link>
        </nav>
        <p className="fine">
          Products are for adults aged {site.minAge} and over. Cannabis accessories are sold for use with legal products only.
        </p>
      </div>
    </footer>
  );
}
