import { useId } from "react";

// The chrome spade, drawn in a 200 x 240 box. Used large in the hero and small as the logo mark.
// It is built like a polished, cast-metal piece: two faces that meet at a ridge down the middle
// (the left face in shade, the right face catching the light), a dark bevelled rim, and soft
// reflections on the lobes. Everything is drawn here in SVG; no photo is used.
export const SPADE =
  "M100 4C106 34 132 62 160 92c24 24 36 42 36 62 0 26-20 44-44 44-16 0-30-5-40-16 2 24 16 44 38 54H50c22-10 36-30 38-54-10 11-24 16-40 16-24 0-44-18-44-44 0-20 12-38 36-62C68 62 94 34 100 4Z";

export default function ChromeSpade() {
  const id = useId(); // unique ids, because the spade can appear several times on one page
  const u = (name) => `${id}${name}`;
  const url = (name) => `url(#${id}${name})`;
  return (
    <>
      <defs>
        <clipPath id={u("clip")}><path d={SPADE} /></clipPath>
        <filter id={u("soft")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id={u("softer")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
        {/* Left face: in shade */}
        <linearGradient id={u("left")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#23272c" />
          <stop offset="0.3" stopColor="#5d656e" />
          <stop offset="0.7" stopColor="#8e97a1" />
          <stop offset="1" stopColor="#7c858f" />
        </linearGradient>
        {/* Right face: catching the light */}
        <linearGradient id={u("right")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bcc5cd" />
          <stop offset="0.45" stopColor="#eef2f5" />
          <stop offset="0.8" stopColor="#c0c8d0" />
          <stop offset="1" stopColor="#59616a" />
        </linearGradient>
        {/* Top-to-bottom shading shared by both faces */}
        <linearGradient id={u("shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.62" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.42" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={u("ridge")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* The rim is polished too, so it runs through light and dark as it turns */}
        <linearGradient id={u("bevel")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f6f8" />
          <stop offset="0.16" stopColor="#7d858e" />
          <stop offset="0.3" stopColor="#111315" />
          <stop offset="0.46" stopColor="#4a5057" />
          <stop offset="0.56" stopColor="#c9d0d6" />
          <stop offset="0.66" stopColor="#30353b" />
          <stop offset="0.85" stopColor="#0b0d0f" />
          <stop offset="1" stopColor="#6c747d" />
        </linearGradient>
        <linearGradient id={u("rim")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#8a929b" />
          <stop offset="1" stopColor="#e6eaee" />
        </linearGradient>
      </defs>

      <g clipPath={url("clip")}>
        {/* The two faces */}
        <rect x="0" y="0" width="100" height="240" fill={url("left")} />
        <rect x="100" y="0" width="100" height="240" fill={url("right")} />
        <rect x="0" y="0" width="200" height="240" fill={url("shade")} />

        {/* Soft reflections */}
        <g filter={url("softer")}>
          <ellipse cx="66" cy="92" rx="13" ry="46" transform="rotate(34 66 92)" fill="#14171a" opacity="0.55" />
          <ellipse cx="140" cy="100" rx="15" ry="50" transform="rotate(-34 140 100)" fill="#fff" opacity="0.75" />
        </g>
        <g filter={url("soft")}>
          <ellipse cx="30" cy="150" rx="7" ry="30" transform="rotate(-8 30 150)" fill="#fff" opacity="0.8" />
          <ellipse cx="56" cy="186" rx="40" ry="10" fill="#060708" opacity="0.85" />
          <ellipse cx="146" cy="188" rx="40" ry="9" fill="#101316" opacity="0.7" />
          <ellipse cx="172" cy="166" rx="8" ry="16" transform="rotate(14 172 166)" fill="#fff" opacity="0.75" />
          <ellipse cx="86" cy="222" rx="10" ry="12" fill="#0b0d0f" opacity="0.7" />
          <ellipse cx="118" cy="224" rx="8" ry="10" fill="#fff" opacity="0.6" />
        </g>

        {/* The ridge where the two faces meet */}
        <path d="M100 4V236" stroke={url("ridge")} strokeWidth="1.6" />
        <path d="M100 4V236" stroke="#000" strokeOpacity="0.18" strokeWidth="5" transform="translate(-3 0)" filter={url("soft")} />

        {/* Shadow just inside the rim, so the faces look raised */}
        <path d={SPADE} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="22" strokeLinejoin="round" filter={url("soft")} />
        {/* Bevelled rim: a light line on its inner edge, then the dark bevel itself */}
        <path d={SPADE} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="13" strokeLinejoin="round" />
        <path d={SPADE} fill="none" stroke={url("bevel")} strokeWidth="11" strokeLinejoin="round" />
      </g>
      {/* Bright outer edge */}
      <path d={SPADE} fill="none" stroke={url("rim")} strokeWidth="1.3" strokeLinejoin="round" />
    </>
  );
}
