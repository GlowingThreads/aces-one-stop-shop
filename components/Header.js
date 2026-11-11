import Link from "next/link";
import site from "../site.config";
import CartButton from "./CartButton";
import NavLinks from "./NavLinks";
import Spade from "./Spade";

export default function Header() {
  return (
    <header className="header">
      <div className="wrap bar">
        <Link href="/" className="brand">
          <Spade />
          <span className="metal">{site.name}</span>
        </Link>
        <NavLinks />
        {site.storeId && <CartButton />}
      </div>
    </header>
  );
}
