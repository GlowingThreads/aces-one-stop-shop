import Link from "next/link";
import site from "../../site.config";
import EcwidCart from "../../components/EcwidCart";
import PageHero from "../../components/PageHero";

export const metadata = { title: "Cart and checkout", robots: { index: false } };

export default function Cart() {
  return (
    <>
      <PageHero eyebrow="Secure checkout" title="Cart and checkout" />
      <section className="wrap section">
        {site.storeId ? (
          <EcwidCart />
        ) : (
          <div className="notice">
            <p>Checkout is available once the Lightspeed store is connected.</p>
            <Link className="btn small ghost" href="/shop">Back to shop</Link>
          </div>
        )}
      </section>
    </>
  );
}
