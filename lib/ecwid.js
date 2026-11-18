// Server-side access to the Lightspeed eCom (Ecwid) REST API.
// Only the PUBLIC (read-only) token is used, and it is sent in a header so it never appears in URLs or logs.
import site from "../site.config";
import { isHiddenCategoryName, isHiddenProduct } from "./hidden";

export const ecwidReady = Boolean(site.storeId && site.publicToken);
export const PAGE_SIZE = 48; // products per "Load more" step
const MAX_LIMIT = 100; // Ecwid's maximum page size

export const SORTS = {
  "": "Featured",
  ADDED_TIME_DESC: "Newest",
  PRICE_ASC: "Price, low to high",
  PRICE_DESC: "Price, high to low",
  NAME_ASC: "Name, A to Z",
};

async function call(path, params = {}) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`https://app.ecwid.com/api/v3/${site.storeId}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${site.publicToken}` },
    next: { revalidate: 300 }, // cache for 5 minutes
  });
  if (!res.ok) {
    const error = new Error(`Ecwid ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// Reads every page of a list. The first page tells how many there are; the rest are fetched together.
async function callAll(path, params = {}) {
  const first = await call(path, { ...params, limit: String(MAX_LIMIT), offset: "0" });
  const items = [...(first.items || [])];
  const offsets = [];
  for (let offset = items.length; offset < Math.min(first.total || 0, MAX_LIMIT * 60); offset += MAX_LIMIT) offsets.push(offset);
  const pages = await Promise.all(offsets.map((offset) => call(path, { ...params, limit: String(MAX_LIMIT), offset: String(offset) })));
  for (const page of pages) items.push(...(page.items || []));
  return items;
}

// Keeps the result of `load` for a few minutes within one server, so a page that asks for the same list
// several times (header, footer, shop) only works it out once. Ecwid's responses are cached separately.
function remember(load, ms = 60_000) {
  let value, until = 0;
  return () => {
    if (Date.now() > until) { value = load(); until = Date.now() + ms; value.catch(() => { until = 0; }); }
    return value;
  };
}

/* ---------- Categories ---------- */

// Every enabled category, split into the ones shown on the site and the IDs of the hidden ones
// (a category named in site.config.js hiddenCategories, plus all of its subcategories).
const loadCategoryData = remember(async () => {
  const all = (await callAll("/categories"))
    .filter((c) => c.enabled !== false)
    .sort((a, b) => (a.orderBy || 0) - (b.orderBy || 0))
    .map((c) => ({ id: c.id, parentId: c.parentId || 0, name: c.name, image: c.thumbnailUrl || "" }));
  const hidden = all.filter((c) => isHiddenCategoryName(c.name)).map((c) => c.id);
  const hiddenIds = new Set(hidden.flatMap((id) => withDescendants(all, id)));
  return { visible: all.filter((c) => !hiddenIds.has(c.id)), hiddenIds };
});

async function getCategoryData() {
  if (!ecwidReady) return { visible: [], hiddenIds: new Set() };
  try {
    return await loadCategoryData();
  } catch {
    return { visible: [], hiddenIds: new Set() }; // the shop still works without category chips
  }
}

// Hidden category IDs for filtering products. Unlike getCategoryData this does not fall back to "none"
// when Lightspeed cannot be reached: it fails, so a hidden product is never shown by accident.
async function getHiddenCategoryIds() {
  return (await loadCategoryData()).hiddenIds;
}

// Flat list of the categories shown on the site. Each has { id, parentId, name }; top-level ones have parentId 0.
// A category is also left off when none of its products can be shown (counting its subcategories), so an
// empty category, or one whose products are all hidden, never appears as a tile, filter or footer link.
export async function getCategories() {
  const { visible } = await getCategoryData();
  try {
    const index = await loadCatalogIndex();
    const withProducts = new Set();
    for (const p of index) if (!p.hidden) for (const id of p.categoryIds) withProducts.add(id);
    // A parent stays if any of its subcategories has products.
    const keep = new Set();
    for (const c of visible) if (withProducts.has(c.id)) for (const a of pathTo(visible, c.id)) keep.add(a.id);
    return visible.filter((c) => keep.has(c.id));
  } catch {
    return visible; // product list unavailable right now: show the categories rather than none
  }
}

// Every enabled product's ID, name and categories, with the ones the site hides marked. Used to count
// exactly how many products a list will show, and for the sitemap. Rebuilt every few minutes.
const loadCatalogIndex = remember(async () => {
  const hiddenIds = await getHiddenCategoryIds();
  const items = await callAll("/products", { enabled: "true", responseFields: "total,count,items(id,name,categoryIds,defaultCategoryId)" });
  return items.map((p) => ({ id: p.id, name: p.name || "", categoryIds: p.categoryIds || [], hidden: isHiddenProduct(p, hiddenIds) }));
}, 5 * 60_000);

export const childrenOf = (categories, parentId) => categories.filter((c) => c.parentId === parentId);

// The chosen category followed by all of its subcategories, at any depth.
export function withDescendants(categories, id) {
  const ids = [id];
  for (let i = 0; i < ids.length; i++) ids.push(...childrenOf(categories, ids[i]).map((c) => c.id));
  return ids;
}

// Path from the top-level category down to the chosen one, e.g. [Vapes, Disposable Vapes].
export function pathTo(categories, id) {
  const path = [];
  let current = categories.find((c) => c.id === id);
  while (current && path.length < 10) {
    path.unshift(current);
    current = categories.find((c) => c.id === current.parentId);
  }
  return path;
}

/* ---------- Products ---------- */

// Only the fields a product card needs, so little data is sent to the browser.
function toCard(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.defaultDisplayedPriceFormatted || "",
    image: p.hdThumbnailUrl || p.thumbnailUrl || p.imageUrl || "", // already sized by Ecwid, never cropped
    inStock: p.inStock !== false,
    hasOptions: (p.options || []).length > 0,
  };
}

// How many products a list leaves out because they are hidden, so the count shown on the page is exact.
async function hiddenInList({ categoryIds, keyword }, params, total) {
  const index = await loadCatalogIndex();
  if (keyword) {
    // A search can match on more than the name, so look at what the search itself returns.
    if (total <= 1500) {
      const matches = await callAll("/products", { ...params, responseFields: "total,count,items(id)" });
      const hidden = new Set(index.filter((p) => p.hidden).map((p) => p.id));
      return matches.filter((p) => hidden.has(p.id)).length;
    }
    const word = keyword.toLowerCase();
    return index.filter((p) => p.hidden && p.name.toLowerCase().includes(word)).length; // close estimate for huge searches
  }
  if (categoryIds?.length) {
    const wanted = new Set(categoryIds);
    return index.filter((p) => p.hidden && p.categoryIds.some((c) => wanted.has(c))).length;
  }
  return index.filter((p) => p.hidden).length;
}

// Returns { items, total, next, error }.
//   items  the products for this page, with hidden products already left out
//   total  how many products the whole list shows
//   next   where the following page starts (pass it back as `offset`); null when there is nothing more
//   error  true when Ecwid could not be reached, so pages can tell "the API failed" from "nothing matched"
// Because hidden products are skipped, a page may need more than one request to Ecwid to fill up.
export async function getProducts({ categoryIds, keyword, sort, offset = 0, limit = PAGE_SIZE } = {}) {
  if (!ecwidReady) return { items: [], total: 0, next: null, error: false }; // store not connected yet
  try {
    const hiddenIds = await getHiddenCategoryIds();
    const params = { enabled: "true" };
    // `categories` takes a comma-separated list, so a parent category also shows its subcategories' products.
    if (categoryIds?.length) params.categories = categoryIds.join(",");
    if (keyword) params.keyword = keyword;
    if (sort && sort in SORTS) params.sortBy = sort;

    const items = [];
    let at = offset, apiTotal = Infinity, next = null;
    for (let request = 0; request < 12 && at < apiTotal && next === null; request++) {
      const data = await call("/products", { ...params, offset: String(at), limit: String(MAX_LIMIT) });
      apiTotal = data.total || 0;
      const page = data.items || [];
      if (!page.length) break;
      for (let i = 0; i < page.length; i++) {
        if (isHiddenProduct(page[i], hiddenIds)) continue;
        items.push(toCard(page[i]));
        if (items.length === limit) { next = at + i + 1; break; }
      }
      if (next === null) at += page.length;
    }
    if (next === null && at < apiTotal) next = at; // stopped early on a very hidden-heavy list: carry on next time

    const total = Math.max(items.length, apiTotal - (await hiddenInList({ categoryIds, keyword }, params, apiTotal)));
    // If everything that is left is hidden, there is no next page.
    if (next !== null && offset === 0 && items.length >= total) next = null;
    return { items, total, next: next !== null && next < apiTotal ? next : null, error: false };
  } catch {
    return { items: [], total: 0, next: null, error: true };
  }
}

// Every product ID the site shows, for the sitemap.
export async function getAllProductIds() {
  if (!ecwidReady) return [];
  try {
    return (await loadCatalogIndex()).filter((p) => !p.hidden).map((p) => p.id);
  } catch {
    return [];
  }
}

// Returns the product, or null when it does not exist. Other failures throw and are caught by app/shop/error.js.
export async function getProduct(id) {
  if (!/^\d+$/.test(String(id))) return null;
  if (!ecwidReady) return null;
  try {
    const p = await call(`/products/${id}`);
    if (p.enabled === false) return null;
    // A hidden product's page behaves as if it did not exist.
    return isHiddenProduct(p, await getHiddenCategoryIds()) ? null : p;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

// Related products: the ones picked in the Lightspeed admin first, then others from the same category.
export async function getRelated(p, limit = 4) {
  if (!ecwidReady) return [];
  try {
    const hiddenIds = await getHiddenCategoryIds();
    const found = [];
    const add = (items) => {
      for (const item of items || []) {
        if (isHiddenProduct(item, hiddenIds)) continue;
        if (item.id !== p.id && !found.some((f) => f.id === item.id) && found.length < limit) found.push(toCard(item));
      }
    };
    const picked = p.relatedProducts?.productIds || [];
    if (picked.length) {
      add((await call("/products", { enabled: "true", productId: picked.slice(0, 20).join(",") })).items);
    }
    const related = p.relatedProducts?.relatedCategory;
    const categoryId = (related?.enabled && related.categoryId) || p.defaultCategoryId || p.categoryIds?.[0];
    if (found.length < limit && categoryId) {
      add((await call("/products", { enabled: "true", categories: String(categoryId), limit: "20" })).items);
    }
    return found;
  } catch {
    return []; // related products are optional
  }
}

// The product's photos with their labels (the alt text set in Lightspeed), e.g. a flavour name.
// The product page uses the labels to show the right photo when a customer picks a flavour.
export function productPhotos(p) {
  const photos = (p.media?.images || [])
    .map((i) => ({
      src: i.image800pxUrl || i.imageOriginalUrl,
      label: (typeof i.alt === "string" ? i.alt : i.alt?.main) || "",
    }))
    .filter((photo) => photo.src);
  if (!photos.length && p.imageUrl) photos.push({ src: p.imageUrl, label: "" });
  return photos;
}

export function productImages(p) {
  const images = (p.media?.images || []).map((i) => i.image800pxUrl || i.imageOriginalUrl).filter(Boolean);
  if (!images.length && p.imageUrl) images.push(p.imageUrl);
  return images;
}
