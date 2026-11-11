import Link from "next/link";
import site from "../site.config";
import CartButton from "./CartButton";
import NavLinks from "./NavLinks";
import Icon from "./Icon";
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
        {site.storeId && (
          <div className="bar-tools">
            {/* A normal link (full page load) so Lightspeed's account screen always starts fresh. */}
            <a className="btn small ghost account-btn" href="/account" aria-label="My account">
              <Icon name="user" />
              <span>Account</span>
            </a>
            <CartButton />
          </div>
        )}
      </div>
    </header>
  );
}
