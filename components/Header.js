import Link from "next/link";
import site from "../site.config";
import CartButton from "./CartButton";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="header">
      <div className="wrap bar">
        <Link href="/" className="brand metal">{site.name}</Link>
        <NavLinks />
        {site.storeId && <CartButton />}
      </div>
    </header>
  );
}
