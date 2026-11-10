"use client";
import { useState } from "react";

export default function AddToCart({ id, disabled }) {
  const [state, setState] = useState("idle");

  function add() {
    if (!window.Ecwid?.Cart) return setState("error");
    setState("busy");
    window.Ecwid.Cart.addProduct({ id, quantity: 1, callback: () => setState("added") });
  }

  const label = { idle: "Add to cart", busy: "Adding", added: "Added", error: "Try again" }[state];
  return (
    <button className="btn small" onClick={add} disabled={disabled || state === "busy"}>
      {disabled ? "Unavailable" : label}
    </button>
  );
}
