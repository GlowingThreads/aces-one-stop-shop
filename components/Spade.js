import { useId } from "react";

// Small chrome spade used as the logo mark in the header, footer and age gate.
export default function Spade({ size = 22 }) {
  const id = useId(); // keeps the gradient id unique when the mark appears more than once on a page
  return (
    <svg className="spade" width={size} height={size * 1.2} viewBox="0 0 200 240" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#aeb3ba" />
          <stop offset="0.5" stopColor="#1c2023" />
          <stop offset="0.58" stopColor="#14704c" />
          <stop offset="0.76" stopColor="#d5d8dc" />
          <stop offset="1" stopColor="#5c626a" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M100 6C112 40 190 86 190 140c0 32-24 54-52 54-16 0-29-7-36-18 2 24 12 46 32 58H66c20-12 30-34 32-58-7 11-20 18-36 18-28 0-52-22-52-54C10 86 88 40 100 6Z"
      />
    </svg>
  );
}
