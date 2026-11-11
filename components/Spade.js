// Small chrome spade used as the logo mark in the header, footer and age gate.
// The picture is public/spade-mark.webp, a web-sized copy of assets/originals/plain_spade.png.
export default function Spade({ size = 24 }) {
  return <img className="spade" src="/spade-mark.webp" alt="" width={size} height={Math.round(size * 1.05)} />;
}
