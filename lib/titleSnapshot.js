// Saved pictures of chrome titles. This file is deliberately tiny and has no 3D code in it, so it can
// run the moment a page starts, long before three.js has arrived.
//
// After a title is drawn, a picture of it is saved in the browser (localStorage). The next
// time that page is opened from scratch, the saved picture is shown at once while the 3D equipment
// starts up, and is then swapped for the live drawing. Only the first ever view of a title has to wait.
const SNAP_PREFIX = "chrome-title:";
const SNAP_LIMIT = 12; // pictures kept; the oldest is dropped beyond this

export function snapKey(wrap) {
  const title = wrap.querySelector(".title");
  const size = parseFloat(getComputedStyle(title).fontSize);
  const box = wrap.getBoundingClientRect();
  // The picture only fits if the words, their size and their layout are all the same.
  return `${SNAP_PREFIX}${title.textContent.trim()}|${size}|${Math.round(box.width)}x${Math.round(box.height)}|${Math.min(window.devicePixelRatio || 1, 2)}`;
}

export function saveSnap(key, canvas) {
  try {
    if (localStorage.getItem(key)) return;
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(SNAP_PREFIX));
    if (keys.length >= SNAP_LIMIT) localStorage.removeItem(keys[0]);
    localStorage.setItem(key, JSON.stringify({ src: canvas.toDataURL("image/webp", 0.92), left: canvas.style.left, top: canvas.style.top, width: canvas.style.width, height: canvas.style.height }));
  } catch {} // storage blocked or full: snapshots are only a speed-up
}

export function showSnap(wrap) {
  try {
    const snap = JSON.parse(localStorage.getItem(snapKey(wrap)) || "null");
    if (!snap?.src?.startsWith("data:image/")) return null;
    const img = document.createElement("img");
    img.className = "title-3d";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.src = snap.src;
    Object.assign(img.style, { left: snap.left, top: snap.top, width: snap.width, height: snap.height });
    wrap.appendChild(img);
    wrap.classList.add("is-3d", "instant"); // show it at once, with no fade
    return img;
  } catch {
    return null;
  }
}
