import site from "../site.config";

export const ecwidReady = Boolean(site.storeId && site.publicToken);

export const SORTS = {
  "": "Featured",
  ADDED_TIME_DESC: "Newest",
  PRICE_ASC: "Price, low to high",
  PRICE_DESC: "Price, high to low",
  NAME_ASC: "Name, A to Z",
};

async function call(path, params = {}) {
  const qs = new URLSearchParams({ token: site.publicToken, ...params });
  const res = await fetch(`https://app.ecwid.com/api/v3/${site.storeId}${path}?${qs}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Ecwid ${res.status}`);
  return res.json();
}

const demo = [
  "Spoon pipe", "Beaker bong", "Mini dab rig", "Metal grinder", "Rolling papers", "Vape starter kit", "Disposable vape",
].map((name, i) => ({
  id: i + 1,
  name,
  price: 0,
  defaultDisplayedPriceFormatted: "$0.00",
  description: "<p>Demo product. Connect your Lightspeed store to see your real catalog.</p>",
  inStock: true,
  demo: true,
}));

export async function getCategories() {
  if (!ecwidReady) return site.categories.map((name, i) => ({ id: i + 1, name }));
  try {
    return (await call("/categories", { parent: 0 })).items || [];
  } catch {
    return [];
  }
}

export async function getProducts({ category, keyword, sort, limit = 48 } = {}) {
  if (!ecwidReady) {
    let list = keyword ? demo.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase())) : [...demo];
    if (sort === "NAME_ASC") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }
  try {
    const params = { enabled: "true", limit: String(limit) };
    if (category) params.categoryId = category;
    if (keyword) params.keyword = keyword;
    if (sort && sort in SORTS) params.sortBy = sort;
    return (await call("/products", params)).items || [];
  } catch {
    return [];
  }
}

export async function getProduct(id) {
  if (!ecwidReady) return demo.find((p) => String(p.id) === String(id)) || null;
  try {
    return await call(`/products/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export function productImages(p) {
  const images = (p.media?.images || []).map((i) => i.image800pxUrl || i.imageOriginalUrl).filter(Boolean);
  if (!images.length && p.imageUrl) images.push(p.imageUrl);
  return images;
}
