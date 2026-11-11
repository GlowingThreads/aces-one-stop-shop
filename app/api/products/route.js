// JSON endpoint used by the shop's "Load more" button.
// It runs on the server, so the Ecwid token never reaches the browser.
import { getCategories, getProducts, withDescendants, SORTS } from "../../../lib/ecwid";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const category = Number(params.get("category")) || 0;
  const sort = params.get("sort") || "";
  const offset = Math.max(0, Math.floor(Number(params.get("offset")) || 0));

  const categoryIds = category ? withDescendants(await getCategories(), category) : undefined;
  const result = await getProducts({
    categoryIds,
    keyword: (params.get("q") || "").slice(0, 100),
    sort: sort in SORTS ? sort : "",
    offset,
  });
  return Response.json(result, { status: result.error ? 502 : 200 });
}
