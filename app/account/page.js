import Link from "next/link";
import site from "../../site.config";
import EcwidCart from "../../components/EcwidCart";
import PageHero from "../../components/PageHero";

export const metadata = { title: "My account", robots: { index: false } };

// Customer account: sign in, past orders and saved addresses. The account itself is run by Lightspeed,
// so this page hosts their account screen.
export default function Account() {
  return (
    <>
      <PageHero eyebrow="Sign in and orders" title="My account" />
      <section className="wrap section">
        {site.storeId ? (
          <EcwidCart page="account/settings" />
        ) : (
          <div className="notice">
            <p>Accounts are available once the Lightspeed store is connected.</p>
            <Link className="btn small ghost" href="/shop">Back to shop</Link>
          </div>
        )}
      </section>
    </>
  );
}
