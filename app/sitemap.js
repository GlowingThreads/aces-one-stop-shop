import site from "../site.config";
import { getAllProductIds } from "../lib/ecwid";

export default async function sitemap() {
  const pages = ["", "/shop", "/about", "/find-us"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
  }));
  const ids = await getAllProductIds();
  return [...pages, ...ids.map((id) => ({ url: `${site.url}/shop/${id}`, changeFrequency: "daily" }))];
}
