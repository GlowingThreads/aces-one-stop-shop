import site from "../site.config";
import { getProducts } from "../lib/ecwid";

export default async function sitemap() {
  const pages = ["", "/shop", "/about", "/find-us"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
  }));
  const products = (await getProducts({ limit: 100 })).filter((p) => !p.demo);
  return [...pages, ...products.map((p) => ({ url: `${site.url}/shop/${p.id}`, changeFrequency: "daily" }))];
}
