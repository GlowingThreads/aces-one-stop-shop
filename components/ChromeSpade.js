import { useId } from "react";

// The chrome spade, drawn in a 200 x 240 box. Used large in the hero and small as the logo mark.
// Chrome is a mirror, so the look comes from what it "reflects": a bright sky, a hard dark horizon,
// and a lighter floor with a little green in it. Filters then bend that reflection around the shape
// and add an edge shadow and highlights so it reads as a rounded, polished object.
export const SPADE =
  "M100 6C112 40 190 86 190 140c0 32-24 54-52 54-16 0-29-7-36-18 2 24 12 46 32 58H66c20-12 30-34 32-58-7 11-20 18-36 18-28 0-52-22-52-54C10 86 88 40 100 6Z";

export default function ChromeSpade() {
  const id = useId(); // unique ids, because the spade can appear several times on one page
  const env = `${id}env`, chrome = `${id}chrome`, clip = `${id}clip`;
  return (
    <>
      <defs>
        {/* The reflected surroundings: sky, horizon, floor */}
        <linearGradient id={env} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.12" stopColor="#e3e8ee" />
          <stop offset="0.27" stopColor="#9aa3ae" />
          <stop offset="0.4" stopColor="#59616b" />
          <stop offset="0.435" stopColor="#0c0e10" />
          <stop offset="0.47" stopColor="#030404" />
          <stop offset="0.5" stopColor="#0b3d2c" />
          <stop offset="0.55" stopColor="#1a7a55" />
          <stop offset="0.575" stopColor="#dfe4e8" />
          <stop offset="0.68" stopColor="#f6f8fa" />
          <stop offset="0.82" stopColor="#99a1aa" />
          <stop offset="0.93" stopColor="#3b4047" />
          <stop offset="1" stopColor="#15181b" />
        </linearGradient>
        <clipPath id={clip}><path d={SPADE} /></clipPath>
        <filter id={chrome} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          {/* 1. A height map: bright in the middle of the shape, falling away at the edges, with a slow ripple added */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="dome" />
          <feColorMatrix in="dome" values="0 0 0 1 0  0 0 0 1 0  0 0 0 0 0.5  0 0 0 0 1" result="height" />
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.011" numOctaves="1" seed="5" result="ripple" />
          <feComposite in="height" in2="ripple" operator="arithmetic" k1="0" k2="0.86" k3="0.14" k4="0" result="map" />
          {/* 2. Bend the reflection with that map, so the horizon curves around the body */}
          <feGaussianBlur in="map" stdDeviation="3" result="smoothMap" />
          <feDisplacementMap in="SourceGraphic" in2="smoothMap" scale="-58" xChannelSelector="B" yChannelSelector="R" result="bentRaw" />
          <feGaussianBlur in="bentRaw" stdDeviation="0.9" result="bent" />
          <feMerge result="filled"><feMergeNode in="SourceGraphic" /><feMergeNode in="bent" /></feMerge>
          <feComposite in="filled" in2="SourceAlpha" operator="in" result="body" />
          {/* 3. Edges of a rounded mirror reflect the dark surroundings */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="inner" />
          <feFlood floodColor="#000" floodOpacity="0.6" />
          <feComposite in2="inner" operator="out" />
          <feComposite in2="SourceAlpha" operator="in" result="edge" />
          {/* 4. Highlights: a sharp white key light from the upper left and a soft green light from below */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="soft" />
          <feSpecularLighting in="soft" surfaceScale="9" specularConstant="1.3" specularExponent="60" lightingColor="#ffffff" result="key">
            <feDistantLight azimuth="232" elevation="50" />
          </feSpecularLighting>
          <feComposite in="key" in2="SourceAlpha" operator="in" result="keyIn" />
          <feSpecularLighting in="soft" surfaceScale="6" specularConstant="0.4" specularExponent="30" lightingColor="#2fb37f" result="fill">
            <feDistantLight azimuth="60" elevation="38" />
          </feSpecularLighting>
          <feComposite in="fill" in2="SourceAlpha" operator="in" result="fillIn" />
          <feMerge>
            <feMergeNode in="body" /><feMergeNode in="edge" /><feMergeNode in="fillIn" /><feMergeNode in="keyIn" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${chrome})`}>
        <g clipPath={`url(#${clip})`}>
          <rect x="0" y="0" width="200" height="240" fill={`url(#${env})`} />
        </g>
      </g>
      {/* Hairline rim */}
      <path d={SPADE} fill="none" stroke="#f2f4f7" strokeOpacity="0.5" strokeWidth="0.7" />
    </>
  );
}
