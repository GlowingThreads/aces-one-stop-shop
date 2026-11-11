// Draws a page title as 3D chrome lettering with three.js, laid exactly over the real heading text.
//
// How it works:
//   1. The heading's words are measured where the browser placed them (so wrapping always matches).
//   2. Each line is built as solid, bevelled 3D letters from the same font the site uses (Unbounded).
//   3. The letters get a mirror-like metal surface that reflects smooth, soft surroundings (a bright
//      sky, a dark horizon, a cool floor). Those reflections are what make chrome look like chrome.
//   4. The surroundings turn very slowly, so a gentle sheen drifts across the letters.
// The renderer and its surroundings are built once per visit and reused on every page, and a saved
// picture of each title covers the moment while they start up.
// If WebGL or the font is unavailable, nothing is drawn and the normal heading stays visible.
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { snapKey, saveSnap } from "./titleSnapshot";

// Unbounded Bold as letter outlines, in the JSON format three.js reads. It was converted once from the
// font file (Latin letters, numbers and punctuation only) so no font parser has to be sent to the browser.
const FONT_URL = "/fonts/unbounded-700.json";
const SIZE = 100; // the size letters are built at; they are then scaled to the heading's font size
const EM = SIZE * (100000 / 72000); // at that size, one em of the font is this many units (three.js's font scale)

let fontPromise; // the font is loaded once and shared by every title
function loadFont() {
  fontPromise ||= new Promise((resolve, reject) => {
    new FontLoader().load(FONT_URL, resolve, undefined, reject);
  });
  return fontPromise;
}

// What the chrome reflects. A mirror only looks like a mirror because of its surroundings, so this
// paints a smooth, soft "sky" all around the letters: bright white overhead, fading to silver, a soft
// dark horizon, then a cool blue floor fading to near black with a hint of green. There are no hard
// edges anywhere in it, which is what keeps the reflections smooth and sleek.
// It is built as numbers (not a picture) so the bright areas can be brighter than white, like real lights.
function buildSurroundings(renderer) {
  const w = 512, h = 256, data = new Uint16Array(w * h * 4);
  const half = THREE.DataUtils.toHalfFloat;
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  // Colours from straight up (elevation 1) to straight down (-1), as [red, green, blue] light levels.
  const stops = [
    [1.0, [3.4, 3.5, 3.8]], [0.6, [2.6, 2.7, 3.0]], [0.3, [1.15, 1.2, 1.4]], [0.13, [0.3, 0.33, 0.4]],
    [0.02, [0.05, 0.055, 0.07]], [-0.1, [0.06, 0.07, 0.09]], [-0.2, [0.75, 0.85, 1.1]], [-0.45, [1.7, 1.85, 2.2]], [-0.8, [0.5, 0.65, 0.66]], [-1.0, [0.06, 0.2, 0.14]],
  ];
  for (let y = 0; y < h; y++) {
    const elevation = Math.sin((0.5 - (y + 0.5) / h) * Math.PI); // 1 at the top row, -1 at the bottom row
    let colour = stops[stops.length - 1][1];
    for (let i = 0; i < stops.length - 1; i++) {
      const [e0, c0] = stops[i], [e1, c1] = stops[i + 1];
      if (elevation <= e0 && elevation >= e1) { colour = mix(c0, c1, smooth(e0, e1, elevation)); break; }
    }
    for (let x = 0; x < w; x++) {
      // Two broad, soft columns of extra light, on opposite sides. As the surroundings turn slowly,
      // these drift across the letters as a gentle sheen.
      const angle = (x / w) * Math.PI * 2;
      const glow = 1 + 1.1 * Math.pow(Math.max(0, Math.cos(angle - 0.9)), 6) + 0.7 * Math.pow(Math.max(0, Math.cos(angle - 4.1)), 8);
      const i = (y * w + x) * 4;
      data[i] = half(colour[0] * glow); data[i + 1] = half(colour[1] * glow); data[i + 2] = half(colour[2] * glow); data[i + 3] = half(1);
    }
  }
  const sky = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.HalfFloatType);
  sky.mapping = THREE.EquirectangularReflectionMapping;
  sky.colorSpace = THREE.LinearSRGBColorSpace;
  sky.minFilter = sky.magFilter = THREE.LinearFilter;
  sky.wrapS = THREE.RepeatWrapping;
  sky.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromEquirectangular(sky).texture;
  pmrem.dispose(); sky.dispose();
  return texture;
}

// Gives the flat front of every letter a gentle, pillow-like curve (without changing its outline):
// the top of a letter leans back to mirror the bright sky, the bottom leans forward to mirror the floor.
// That produces the smooth light-to-dark sweep of polished chrome on each line of text.
// `BAND` is the height, in letter units, that one curve covers: from below the descenders to above the capitals.
const BAND = { bottom: -45, top: 125 };
function buildCurve() {
  const w = 64, h = 256, data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);                          // 0 at the bottom of the band, 1 at the top
    const tiltY = (t - 0.5) * 1.3;                  // lean back at the top, forward at the bottom
    for (let x = 0; x < w; x++) {
      const tiltX = Math.sin((x / w) * Math.PI * 2) * 0.07; // a very slight sideways wave, so the sheen can travel
      const n = new THREE.Vector3(Math.sin(tiltX), Math.sin(tiltY), Math.cos(tiltY)).normalize();
      data.set([(n.x * 0.5 + 0.5) * 255, (n.y * 0.5 + 0.5) * 255, (n.z * 0.5 + 0.5) * 255, 255], (y * w + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(data, w, h);
  texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  // Letter faces are mapped in letter units: stretch the curve over one line's height, and the wave over ~9 letters.
  const span = BAND.top - BAND.bottom;
  texture.repeat.set(1 / 900, 1 / span);
  texture.offset.set(0, -BAND.bottom / span);
  texture.needsUpdate = true;
  return texture;
}

// Where the browser put each line of the heading, in pixels relative to the wrapper.
function measureLines(wrap) {
  const box = wrap.getBoundingClientRect();
  const lines = [];
  for (const word of wrap.querySelectorAll(".w")) {
    const r = word.getBoundingClientRect();
    if (!r.width) continue;
    const last = lines.at(-1);
    if (last && Math.abs(last.top - (r.top - box.top)) < r.height / 2) {
      last.text += " " + word.textContent;
    } else {
      lines.push({ text: word.textContent, left: r.left - box.left, top: r.top - box.top });
    }
  }
  return { lines, width: box.width, height: box.height };
}

// Solid, bevelled letters for one line. Letters are placed one by one so the spacing matches the heading's CSS.
function buildLine(font, text, letterSpacingEm) {
  const shapes = [];
  let x = 0;
  for (const ch of text) {
    const glyph = font.data.glyphs[ch] || font.data.glyphs["?"];
    for (const shape of font.generateShapes(ch, SIZE)) {
      // Move the letter to its place in the line.
      const move = (path) => path.curves.forEach((c) => Object.values(c).forEach((v) => v?.isVector2 && (v.x += x)));
      move(shape); shape.holes.forEach(move);
      shapes.push(shape);
    }
    x += ((glyph?.ha || 0) / font.data.resolution) * SIZE + letterSpacingEm * EM;
  }
  // Deep, rounded bevels give the letters a soft polished edge.
  return new THREE.ExtrudeGeometry(shapes, { depth: 14, curveSegments: 16, bevelEnabled: true, bevelThickness: 7, bevelSize: 3.4, bevelOffset: -1.7, bevelSegments: 12 });
}

// The drawing equipment: one canvas, one renderer, the surroundings and the metal surface. It is built
// once and then kept for the whole visit, and simply moved from one page's title to the next. Building
// it is the slow part (roughly a second on a phone), so doing it once is what makes titles appear at
// once when moving between pages.
let engine;        // undefined = not built yet, null = this device cannot draw 3D
let loadedFont;    // set once the letter outlines have arrived

function getEngine() {
  if (engine !== undefined) return engine;
  const canvas = document.createElement("canvas");
  canvas.className = "title-3d";
  canvas.setAttribute("aria-hidden", "true");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    return (engine = null);
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  const scene = new THREE.Scene();
  scene.environment = buildSurroundings(renderer);
  // A pure metal mirror, with just enough softness (roughness) that reflections stay silky instead of glittery.
  const material = new THREE.MeshStandardMaterial({ color: 0xf2f5fa, metalness: 1, roughness: 0.12, envMapIntensity: 1, normalMap: buildCurve(), normalScale: new THREE.Vector2(1, 1) });
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -500, 500);
  const group = new THREE.Group();
  scene.add(group);
  // If the browser takes the 3D context away (it can, on phones), fall back to the plain heading.
  canvas.addEventListener("webglcontextlost", () => { canvas.parentElement?.classList.remove("is-3d"); canvas.remove(); engine = null; });
  return (engine = { canvas, renderer, scene, material, camera, group });
}

// Gets everything ready ahead of time: the letter outlines and the drawing equipment.
// Called as soon as this file loads, so the first title has as little to wait for as possible.
export function prepare() {
  return loadFont().then((font) => { loadedFont = font; getEngine(); });
}

// True once a title can be drawn immediately, with nothing left to load.
export const isReady = () => Boolean(loadedFont && engine);

// Draws chrome lettering over the heading inside `wrap`. Returns a function that removes it again.
// `instant` skips the fade-in: used when moving between pages, or when a saved picture is already showing.
// `onSettled(drew)` is called once: with true after the first drawing, or false if this device cannot draw 3D.
export function mountChromeText(wrap, { instant = false, onSettled = () => {} } = {}) {
  let stopped = false, frame = 0, visible = true, last = 0, began = 0;
  let resize, watch;

  function start() {
    const e = getEngine();
    if (stopped) return;
    if (!e || !loadedFont) return onSettled(false); // no 3D on this device: the plain heading stays
    const { canvas, renderer, scene, material, camera, group } = e;
    const draw = () => renderer.render(scene, camera);

    function layout() {
      const style = getComputedStyle(wrap.querySelector(".title"));
      const fontSize = parseFloat(style.fontSize);
      const spacing = (parseFloat(style.letterSpacing) || 0) / fontSize;
      const { lines, width, height } = measureLines(wrap);
      const pad = Math.ceil(fontSize * 0.2); // room around the text for bevels
      const w = width + pad * 2, h = height + pad * 2;
      renderer.setSize(w, h, false);
      Object.assign(canvas.style, { width: `${w}px`, height: `${h}px`, left: `${-pad}px`, top: `${-pad}px` });
      camera.right = w; camera.bottom = -h; camera.updateProjectionMatrix();

      group.children.forEach((m) => m.geometry.dispose());
      group.clear();
      const scale = fontSize / EM;
      // Distance from the top of a line of text to its baseline, taken from the font itself.
      const ascent = (loadedFont.data.ascender / loadedFont.data.resolution) * SIZE * scale;
      for (const line of lines) {
        const mesh = new THREE.Mesh(buildLine(loadedFont, line.text, spacing), material);
        mesh.scale.setScalar(scale);
        mesh.position.set(pad + line.left, -(pad + line.top + ascent), 0);
        group.add(mesh);
      }
      scene.environmentRotation.y = 0; // every title starts from the same pose, so a saved picture matches the live one
      began = 0;
      draw();
      saveSnap(snapKey(wrap), canvas); // must directly follow draw(), while the picture is still in the canvas
    }

    // Slowly turn the surroundings so the sheen drifts across the letters. About 30 frames a second, only while on screen.
    function tick(now) {
      frame = requestAnimationFrame(tick);
      if (!visible || now - last < 33) return;
      last = now;
      began ||= now;
      scene.environmentRotation.y = (now - began) / 9000; // one slow full turn every ~57 seconds
      draw();
    }

    wrap.appendChild(canvas); // moves the one shared canvas into this title
    layout();
    wrap.classList.toggle("instant", instant);
    wrap.classList.add("is-3d"); // hides the plain text (it stays in the page for accessibility)
    onSettled(true);

    let first = true;
    resize = new ResizeObserver(() => { if (first) first = false; else layout(); }); // it fires once straight away; skip that
    watch = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    resize.observe(wrap);
    watch.observe(wrap);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) frame = requestAnimationFrame(tick);
  }

  if (isReady() && document.fonts?.status !== "loading") {
    start(); // everything is already loaded: draw now, before the page is shown
  } else {
    // Wait for the outlines and for the page's own web font, so the measurements are final.
    prepare().then(() => document.fonts?.ready).then(start).catch(() => onSettled(false));
  }

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    resize?.disconnect();
    watch?.disconnect();
    wrap.classList.remove("is-3d", "instant");
    if (engine?.canvas.parentElement === wrap) engine.canvas.remove(); // the equipment itself is kept for the next page
  };
}
