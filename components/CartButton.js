"use client";
import { useEffect, useRef, useState } from "react";
import site from "../site.config";
import { whenEcwidReady } from "./EcwidScript";

// Header cart button with an item-count badge. Opens a drawer listing what is in the Ecwid cart.
export default function CartButton() {
  const [cart, setCart] = useState({ items: [], productsQuantity: 0 });
  const [subtotal, setSubtotal] = useState(null);
  const dialog = useRef(null);

  useEffect(() => {
    return whenEcwidReady((Ecwid) => {
      const update = (next) => {
        if (!next) return;
        setCart({ items: next.items || [], productsQuantity: next.productsQuantity || 0 });
        // Ask Ecwid for the subtotal rather than adding up prices here, so options and discounts are right.
        Ecwid.Cart.calculateTotal?.((order) => setSubtotal(order?.subtotal ?? null));
      };
      Ecwid.OnCartChanged.add(update); // fires whenever something is added or removed
      Ecwid.Cart.get(update); // the cart as it is right now
    });
  }, []);

  const count = cart.productsQuantity;
  const money = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: site.currency }).format(n);
  // Shows option choices such as "Size: Large, Colour: Smoke".
  const optionText = (options) =>
    Object.entries(options || {}).map(([name, value]) => `${name}: ${[].concat(value).join(", ")}`).join(", ");

  return (
    <>
      <button
        className="btn small ghost cart-btn"
        onClick={() => dialog.current?.showModal()}
        aria-label={count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
      >
        Cart{count > 0 && <span className="badge" aria-hidden="true">{count}</span>}
      </button>

      {/* A native <dialog> gives us the focus trap, Escape to close and an inert page behind it. */}
      <dialog
        ref={dialog} className="drawer" aria-labelledby="cart-title"
        onClick={(e) => e.target === dialog.current && dialog.current.close()} // click on the backdrop
      >
        <div className="drawer-body">
          <div className="drawer-head">
            <h2 id="cart-title">Your cart</h2>
            <button className="btn small ghost" onClick={() => dialog.current?.close()}>Close</button>
          </div>

          {cart.items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.items.map((item, index) => (
                <li key={`${item.product?.id}-${index}`}>
                  <div>
                    <strong>{item.product?.name}</strong>
                    {optionText(item.options) && <span className="cart-opts">{optionText(item.options)}</span>}
                    <span className="cart-opts">Quantity: {item.quantity}</span>
                  </div>
                  <button
                    className="link" onClick={() => window.Ecwid?.Cart?.removeProduct(index)}
                    aria-label={`Remove ${item.product?.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="drawer-foot">
            {cart.items.length > 0 && subtotal != null && (
              <p className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></p>
            )}
            <p className="fine">Taxes and shipping are calculated at checkout. You can change quantities there.</p>
            {/* A normal link (full page load) so Ecwid's checkout always starts fresh on /cart. */}
            {cart.items.length > 0 && <a className="btn" href="/cart">Review cart and check out</a>}
          </div>
        </div>
      </dialog>
    </>
  );
}
