import ChromeSpade from "./ChromeSpade";

// Small chrome spade used as the logo mark in the header, footer and age gate.
export default function Spade({ size = 22 }) {
  return (
    <svg className="spade" width={size} height={size * 1.2} viewBox="-4 0 208 240" aria-hidden="true" focusable="false">
      <ChromeSpade />
    </svg>
  );
}
