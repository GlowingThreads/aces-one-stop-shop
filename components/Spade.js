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
        d="M100 8C100 8 18 88 18 140c0 34 25 55 53 55 12 0 22-5 29-13-3 23-12 40-31 50h62c-19-10-28-27-31-50 7 8 17 13 29 13 28 0 53-21 53-55C182 88 100 8 100 8Z"
      />
    </svg>
  );
}
