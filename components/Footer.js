import Link from "next/link";
import site from "../site.config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot">
        <div>
          <strong>{site.name}</strong>
          <p>{site.address}</p>
          <p>{site.phone}</p>
        </div>
        <div>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/find-us">Find Us</Link>
        </div>
        <p className="fine">
          Products are for adults aged {site.minAge} and over. Cannabis accessories are sold for use with legal products only.
        </p>
      </div>
    </footer>
  );
}
