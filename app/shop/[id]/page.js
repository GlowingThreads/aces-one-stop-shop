import Link from "next/link";
import { notFound } from "next/navigation";
import site from "../../../site.config";
import { getProduct, getRelated, getCategories, pathTo, productImages } from "../../../lib/ecwid";
import ProductBuy from "../../../components/ProductBuy";
import ProductCard from "../../../components/ProductCard";
import Gallery from "../../../components/Gallery";
import Icon from "../../../components/Icon";
import ChromeTitle from "../../../components/ChromeTitle";
import { tel } from "../../../components/Sections";

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
    <div className="wrap section product">
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
          {trail.length > 0 && <p className="eyebrow">{trail.at(-1).name}</p>}
          <ChromeTitle text={p.name} small />
          <ProductBuy product={buy} currency={site.currency} />
          <ul className="assure">
            <li><Icon name="pin" /><span>Also in store at {site.address}</span></li>
            <li><Icon name="phone" /><span>Questions? Call <a href={tel}>{site.phone}</a></span></li>
          </ul>
          {/* Description HTML comes from your own Lightspeed admin, so it is trusted content. */}
          {p.description && (
            <section className="desc" aria-labelledby="details-title">
              <h2 id="details-title">Details</h2>
              <div dangerouslySetInnerHTML={{ __html: p.description }} />
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <div className="section-head">
            <p className="eyebrow">More to see</p>
            <h2 id="related-title">You may also like</h2>
          </div>
          <div className="grid">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
