import Link from "next/link";
import { notFound } from "next/navigation";
import site from "../../../site.config";
import { getProduct, getRelated, getCategories, pathTo, productImages } from "../../../lib/ecwid";
import ProductBuy from "../../../components/ProductBuy";
import ProductCard from "../../../components/ProductCard";
import Gallery from "../../../components/Gallery";

const plain = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "Product not found" };
  const images = productImages(p);
  const description = plain(p.description) || `Buy ${p.name} at ${site.name}.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/shop/${id}` },
    openGraph: { title: p.name, description, type: "website", images: images.slice(0, 1) },
  };
}

export default async function Product({ params }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const [related, categories] = await Promise.all([getRelated(p), getCategories()]);
  const trail = pathTo(categories, p.defaultCategoryId || p.categoryIds?.[0] || 0);
  const images = productImages(p);
  const price = p.defaultDisplayedPrice ?? p.price ?? 0;

  // Only what the buying panel needs is sent to the browser.
  const buy = {
    id: p.id,
    demo: Boolean(p.demo),
    inStock: p.inStock !== false,
    price,
    priceFormatted: p.defaultDisplayedPriceFormatted || "",
    options: (p.options || []).map((o) => ({
      type: o.type,
      name: o.name,
      required: Boolean(o.required),
      defaultChoice: o.defaultChoice,
      choices: (o.choices || []).map((c) => ({ text: c.text, priceModifier: c.priceModifier || 0, priceModifierType: c.priceModifierType })),
    })),
    combinations: (p.combinations || []).map((c) => ({
      options: (c.options || []).map((o) => ({ name: o.name, value: o.value })),
      inStock: c.inStock,
      price: c.defaultDisplayedPrice ?? c.price,
    })),
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: images,
    description: plain(p.description),
    offers: {
      "@type": "Offer",
      url: `${site.url}/shop/${p.id}`,
      price,
      priceCurrency: site.currency,
      availability: p.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="wrap section">
      {!p.demo && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      )}
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/shop">Shop</Link>
        {trail.map((c) => (
          <Link key={c.id} href={`/shop?category=${c.id}`}>{c.name}</Link>
        ))}
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="detail">
        <Gallery images={images} alt={p.name} />
        <div>
          <h1 className="metal">{p.name}</h1>
          <ProductBuy product={buy} currency={site.currency} />
          {/* Description HTML comes from your own Lightspeed admin, so it is trusted content. */}
          {p.description && <div className="desc" dangerouslySetInnerHTML={{ __html: p.description }} />}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <h2 id="related-title">You may also like</h2>
          <div className="grid">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
