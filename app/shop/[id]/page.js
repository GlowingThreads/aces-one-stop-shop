import Link from "next/link";
import { notFound } from "next/navigation";
import site from "../../../site.config";
import { getProduct, productImages } from "../../../lib/ecwid";
import AddToCart from "../../../components/AddToCart";
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

  const images = productImages(p);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: images,
    description: plain(p.description),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: site.currency,
      availability: p.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <section className="wrap section">
      {!p.demo && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      )}
      <Link href="/shop" className="back">Back to shop</Link>
      <div className="detail">
        <Gallery images={images} alt={p.name} />
        <div>
          <h1 className="metal">{p.name}</h1>
          <p className="price big">{p.defaultDisplayedPriceFormatted}</p>
          <p>{p.inStock === false ? "Out of stock" : "In stock"}</p>
          <AddToCart id={p.id} disabled={p.inStock === false || p.demo} />
          {/* Description HTML comes from your own Lightspeed admin, so it is trusted content. */}
          {p.description && <div className="desc" dangerouslySetInnerHTML={{ __html: p.description }} />}
        </div>
      </div>
    </section>
  );
}
