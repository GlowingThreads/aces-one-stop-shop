// Server-side access to the Lightspeed eCom (Ecwid) REST API.
// Only the PUBLIC (read-only) token is used, and it is sent in a header so it never appears in URLs or logs.
import site from "../site.config";

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

// Follows Ecwid's offset paging until every item has been read.
async function callAll(path, params = {}) {
  const items = [];
  for (let page = 0; page < 50; page++) {
    const data = await call(path, { ...params, limit: String(MAX_LIMIT), offset: String(items.length) });
    items.push(...(data.items || []));
    if (!data.items?.length || items.length >= (data.total || 0)) break;
  }
  return items;
}

/* ---------- Categories ---------- */

// Flat list of every enabled category. Each has { id, parentId, name }; top-level ones have parentId 0.
export async function getCategories() {
  if (!ecwidReady) return demoCategories;
  try {
    const items = await callAll("/categories");
    return items
      .filter((c) => c.enabled !== false)
      .sort((a, b) => (a.orderBy || 0) - (b.orderBy || 0))
      .map((c) => ({ id: c.id, parentId: c.parentId || 0, name: c.name }));
  } catch {
    return []; // the shop still works without category chips
  }
}

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
    image: p.thumbnailUrl || p.imageUrl || "",
    inStock: p.inStock !== false,
    hasOptions: (p.options || []).length > 0,
    demo: Boolean(p.demo),
  };
}

// Returns { items, total, error }. `error` is true when Ecwid could not be reached,
// so pages can tell "the API failed" apart from "nothing matched".
export async function getProducts({ categoryIds, keyword, sort, offset = 0, limit = PAGE_SIZE } = {}) {
  if (!ecwidReady) return demoSearch({ categoryIds, keyword, sort, offset, limit });
  try {
    const params = { enabled: "true", offset: String(offset), limit: String(Math.min(limit, MAX_LIMIT)) };
    // `categories` takes a comma-separated list, so a parent category also shows its subcategories' products.
    if (categoryIds?.length) params.categories = categoryIds.join(",");
    if (keyword) params.keyword = keyword;
    if (sort && sort in SORTS) params.sortBy = sort;
    const data = await call("/products", params);
    return { items: (data.items || []).map(toCard), total: data.total || 0, error: false };
  } catch {
    return { items: [], total: 0, error: true };
  }
}

// Every product id, for the sitemap.
export async function getAllProductIds() {
  if (!ecwidReady) return [];
  try {
    return (await callAll("/products", { enabled: "true", responseFields: "total,items(id)" })).map((p) => p.id);
  } catch {
    return [];
  }
}

// Returns the product, or null when it does not exist. Other failures throw and are caught by app/shop/error.js.
export async function getProduct(id) {
  if (!/^\d+$/.test(String(id))) return null;
  if (!ecwidReady) return demoProducts.find((p) => String(p.id) === String(id)) || null;
  try {
    const p = await call(`/products/${id}`);
    return p.enabled === false ? null : p;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

// Related products: the ones picked in the Lightspeed admin first, then others from the same category.
export async function getRelated(p, limit = 4) {
  if (!ecwidReady) {
    return demoProducts.filter((d) => d.id !== p.id && d.defaultCategoryId === p.defaultCategoryId).slice(0, limit).map(toCard);
  }
  try {
    const found = [];
    const add = (items) => {
      for (const item of items || []) {
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
      add((await call("/products", { enabled: "true", categories: String(categoryId), limit: String(limit + 1) })).items);
    }
    return found;
  } catch {
    return []; // related products are optional
  }
}

export function productImages(p) {
  const images = (p.media?.images || []).map((i) => i.image800pxUrl || i.imageOriginalUrl).filter(Boolean);
  if (!images.length && p.imageUrl) images.push(p.imageUrl);
  return images;
}

/* ---------- Demo catalog (shown only until the store ID and token are set) ---------- */

const money = (n) => `$${n.toFixed(2)}`;

const demoCategories = site.categories.map((name, i) => ({ id: i + 1, parentId: 0, name }));
// Two subcategories so nested filtering can be tried before the store is connected.
if (demoCategories[1]) {
  demoCategories.push(
    { id: 101, parentId: demoCategories[1].id, name: "Beakers" },
    { id: 102, parentId: demoCategories[1].id, name: "Straight Tubes" }
  );
}

const demoProducts = site.categories.flatMap((category, c) =>
  Array.from({ length: 6 }, (_, n) => {
    const price = 10 + ((c * 6 + n) * 7) % 60;
    const categoryId = c === 1 ? 101 + (n % 2) : c + 1;
    return {
      id: c * 6 + n + 1,
      name: `${category} sample ${n + 1}`,
      price,
      defaultDisplayedPrice: price,
      defaultDisplayedPriceFormatted: money(price),
      description: "<p>Demo product. Connect your Lightspeed store to see your real catalog.</p>",
      inStock: n !== 5,
      defaultCategoryId: categoryId,
      categoryIds: [categoryId],
      // Every sixth demo product has options, to show the option pickers.
      options: n === 0 ? [
        { type: "SELECT", name: "Size", required: true, defaultChoice: 0, choices: [
          { text: "Small", priceModifier: 0, priceModifierType: "ABSOLUTE" },
          { text: "Large", priceModifier: 10, priceModifierType: "ABSOLUTE" },
        ] },
        { type: "RADIO", name: "Colour", required: true, choices: [
          { text: "Clear", priceModifier: 0, priceModifierType: "ABSOLUTE" },
          { text: "Smoke", priceModifier: 0, priceModifierType: "ABSOLUTE" },
          { text: "Green", priceModifier: 5, priceModifierType: "ABSOLUTE" },
        ] },
      ] : [],
      demo: true,
    };
  })
);

function demoSearch({ categoryIds, keyword, sort, offset, limit }) {
  let list = demoProducts.filter(
    (p) =>
      (!categoryIds?.length || categoryIds.includes(p.defaultCategoryId)) &&
      (!keyword || p.name.toLowerCase().includes(keyword.toLowerCase()))
  );
  if (sort === "NAME_ASC") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "PRICE_ASC") list.sort((a, b) => a.price - b.price);
  if (sort === "PRICE_DESC") list.sort((a, b) => b.price - a.price);
  if (sort === "ADDED_TIME_DESC") list.reverse();
  return { items: list.slice(offset, offset + limit).map(toCard), total: list.length, error: false };
}
