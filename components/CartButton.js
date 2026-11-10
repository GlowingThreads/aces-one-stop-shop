"use client";
import { useEffect, useState } from "react";

export default function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let tries = 0;
    const timer = setInterval(() => {
      const Ecwid = window.Ecwid;
      if (Ecwid?.Cart && Ecwid.OnCartChanged) {
        clearInterval(timer);
        Ecwid.OnCartChanged.add((cart) => setCount(cart.productsQuantity || 0));
        Ecwid.Cart.get((cart) => setCount(cart.productsQuantity || 0));
      } else if (++tries > 40) {
        clearInterval(timer); // give up after about 10 seconds
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <button className="btn small ghost" onClick={() => window.Ecwid?.Cart?.gotoCheckout()}>
      Checkout{count > 0 && <span className="badge" aria-label={`${count} items in cart`}>{count}</span>}
    </button>
  );
}
