import Link from "next/link";
import site from "../../site.config";
import EcwidCart from "../../components/EcwidCart";

export const metadata = { title: "Cart and checkout", robots: { index: false } };

export default function Cart() {
  return (
    <section className="wrap section">
      <h1 className="metal">Cart and checkout</h1>
      {site.storeId ? (
        <EcwidCart />
      ) : (
        <div className="notice">
          <p>Checkout is available once the Lightspeed store is connected.</p>
          <Link className="btn small ghost" href="/shop">Back to shop</Link>
        </div>
      )}
    </section>
  );
}
