"use client";
import { useState } from "react";

// Adds a product to the Ecwid cart.
// `options` is an object such as { Size: "Large", Colour: "Smoke" }, using the option names from Lightspeed.
export default function AddToCart({ id, name, disabled, options, quantity = 1, large }) {
  const [state, setState] = useState("idle"); // idle | busy | added | error

  function add() {
    if (!window.Ecwid?.Cart) return setState("error"); // Ecwid's script has not loaded (or was blocked)
    setState("busy");
    window.Ecwid.Cart.addProduct({
      id,
      quantity,
      options: options || {},
      // Ecwid reports whether the add worked, e.g. it fails when a required option is missing.
      callback: (success) => {
        setState(success ? "added" : "error");
        if (success) setTimeout(() => setState("idle"), 2500);
      },
    });
  }

  const label = { idle: "Add to cart", busy: "Adding", added: "Added to cart", error: "Could not add, try again" }[state];
  return (
    <button
      className={large ? "btn" : "btn small"}
      onClick={add}
      disabled={disabled || state === "busy"}
      aria-label={name && state === "idle" && !disabled ? `Add ${name} to cart` : undefined}
    >
      <span aria-live="polite">{disabled ? "Unavailable" : label}</span>
    </button>
  );
}
