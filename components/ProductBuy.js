"use client";
import { useState } from "react";
import AddToCart from "./AddToCart";

// The buying panel on a product page: option pickers (size, colour and so on), quantity, live price and stock.
// Option names and values are sent to Ecwid exactly as they are set up in Lightspeed.

const PICK_ONE = ["SELECT", "RADIO", "SIZE"];

function firstSelection(options) {
  const selected = {};
  for (const o of options) {
    if (o.type === "CHECKBOX") selected[o.name] = [];
    else if (PICK_ONE.includes(o.type)) selected[o.name] = o.choices?.[o.defaultChoice]?.text ?? "";
    else selected[o.name] = "";
  }
  return selected;
}

export default function ProductBuy({ product: p, currency }) {
  // File-upload options cannot be filled in here, so they are not shown.
  const options = (p.options || []).filter((o) => o.type !== "FILES");
  const [selected, setSelected] = useState(() => firstSelection(options));
  const [quantity, setQuantity] = useState(1);
  const [showMissing, setShowMissing] = useState(false);

  const set = (name, value) => setSelected((old) => ({ ...old, [name]: value }));
  const format = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(n);

  // A variation ("combination" in Ecwid) matches when all of its option values are the ones selected.
  const variation = (p.combinations || []).find((c) => (c.options || []).every((o) => selected[o.name] === o.value));

  // Price: a variation with its own price wins. Otherwise add up the price modifiers of the chosen options.
  let price = p.price;
  if (variation?.price != null && variation.price !== p.price) {
    price = variation.price;
  } else {
    for (const o of options) {
      const chosen = [].concat(selected[o.name]);
      for (const choice of o.choices || []) {
        if (!chosen.includes(choice.text) || !choice.priceModifier) continue;
        price += choice.priceModifierType === "PERCENT" ? (p.price * choice.priceModifier) / 100 : choice.priceModifier;
      }
    }
  }
  const priceText = price === p.price && p.priceFormatted ? p.priceFormatted : format(price);
  const inStock = variation ? variation.inStock !== false : p.inStock;

  const isEmpty = (o) => (o.type === "CHECKBOX" ? selected[o.name].length === 0 : !selected[o.name]);
  const missing = options.filter((o) => o.required && isEmpty(o)).map((o) => o.name);

  // Only send options that have a value.
  const chosenOptions = Object.fromEntries(options.filter((o) => !isEmpty(o)).map((o) => [o.name, selected[o.name]]));

  const extra = (choice) => {
    if (!choice.priceModifier) return "";
    const amount = choice.priceModifierType === "PERCENT" ? `${Math.abs(choice.priceModifier)}%` : format(Math.abs(choice.priceModifier));
    return ` (${choice.priceModifier > 0 ? "+" : "-"}${amount})`;
  };

  return (
    <div className="buy">
      <p className="price big" aria-live="polite">{priceText}</p>
      <p className={inStock ? "stock" : "stock out"}>{inStock ? "In stock" : "Out of stock"}</p>

      {options.map((o) => {
        const id = `opt-${o.name.replace(/\W+/g, "-")}`;
        const label = <>{o.name}{o.required && <span className="req"> (required)</span>}</>;

        if (o.type === "SELECT") return (
          <div className="field" key={o.name}>
            <label htmlFor={id}>{label}</label>
            <select id={id} value={selected[o.name]} onChange={(e) => set(o.name, e.target.value)}>
              <option value="">Choose</option>
              {o.choices.map((c) => <option key={c.text} value={c.text}>{c.text}{extra(c)}</option>)}
            </select>
          </div>
        );

        if (o.type === "RADIO" || o.type === "SIZE" || o.type === "CHECKBOX") {
          const many = o.type === "CHECKBOX";
          return (
            <fieldset className="pills" key={o.name}>
              <legend>{label}</legend>
              {o.choices.map((c) => {
                const on = many ? selected[o.name].includes(c.text) : selected[o.name] === c.text;
                const toggle = () =>
                  set(o.name, many ? (on ? selected[o.name].filter((t) => t !== c.text) : [...selected[o.name], c.text]) : c.text);
                return (
                  <label key={c.text} className={on ? "pill on" : "pill"}>
                    <input type={many ? "checkbox" : "radio"} name={id} checked={on} onChange={toggle} />
                    {c.text}{extra(c)}
                  </label>
                );
              })}
            </fieldset>
          );
        }

        // TEXTFIELD, TEXTAREA and DATE
        const Input = o.type === "TEXTAREA" ? "textarea" : "input";
        return (
          <div className="field" key={o.name}>
            <label htmlFor={id}>{label}</label>
            <Input id={id} type={o.type === "DATE" ? "date" : "text"} value={selected[o.name]} onChange={(e) => set(o.name, e.target.value)} />
          </div>
        );
      })}

      <div className="buy-row">
        <div className="field qty">
          <label htmlFor="qty">Quantity</label>
          <input
            id="qty" type="number" inputMode="numeric" min="1" max="99" value={quantity}
            onChange={(e) => setQuantity(Math.min(99, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
          />
        </div>
        <AddToCart
          id={p.id} large options={chosenOptions} quantity={quantity} disabled={!inStock || p.demo}
          check={() => { setShowMissing(missing.length > 0); return missing.length === 0; }}
        />
      </div>
      {showMissing && missing.length > 0 && (
        <p className="error" role="alert">Please choose: {missing.join(", ")}.</p>
      )}
    </div>
  );
}
