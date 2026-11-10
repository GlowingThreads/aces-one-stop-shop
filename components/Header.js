import Link from "next/link";
import site from "../site.config";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="header">
      <div className="wrap bar">
        <Link href="/" className="brand metal">{site.name}</Link>
        <nav aria-label="Main">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/find-us">Find Us</Link>
          {site.storeId && <CartButton />}
        </nav>
      </div>
    </header>
  );
}
