import Link from "next/link";
import site from "../../site.config";
import PageHero from "../../components/PageHero";
import { Highlights, Hours, Cta, tel } from "../../components/Sections";

export const metadata = {
  title: "About Us",
  description: `Meet the team behind ${site.name}, a local store for glassware, smoking accessories and nicotine vapes.`,
};

export default function About() {
  return (
    <>
      <PageHero eyebrow="Our store" title="About us">
        <p>A local shop in {site.city} Located right on Whyte Ave in Edmonton, {site.name} (formerly The Smoke Shop YEG) is your premier destination for quality vape and cannabis accessories. Whether you are a daily enthusiast or just stopping by for the essentials, we stock a massive selection of glassware, dab setups, grinders, rolling papers, vaporizers, and smoking accessories to fit every style and budget. Our team is passionate about what we carry—we pride ourselves on offering fair, competitive pricing, loyalty perks, and friendly, knowledgeable service without the pressure. Stop by our storefront at 8927 Whyte Ave or browse our catalog online to find everything you need under one roof.</p>

        <p>
          Our staff can help you choose the right piece, whether you are buying your first or adding to a collection.
          Ask us anything in store, or browse the shop online.
        </p>
      </PageHero>

      <section className="wrap section split">
        <div className="prose">
          <p className="lead">

          </p>

        </div>
        <aside className="panel" aria-labelledby="about-visit">
          <h2 id="about-visit">Visit the store</h2>
          <address>
            {site.address}<br />
            <a href={tel}>{site.phone}</a>
          </address>
          <Hours />
          <p><Link className="btn small ghost" href="/find-us">Map and directions</Link></p>
        </aside>
      </section>

      {site.photos.length > 0 && (
        <section className="wrap section" aria-labelledby="inside-title">
          <div className="section-head reveal">
            <p className="eyebrow">Come and see</p>
            <h2 id="inside-title">Inside the store</h2>
          </div>
          <div className="photos">
            {site.photos.map((src, i) => <img key={src} src={src} alt={`Inside ${site.name}, photo ${i + 1}`} loading="lazy" />)}
          </div>
        </section>
      )}

      <section className="wrap section" aria-labelledby="carry-title">
        <div className="section-head reveal">
          <p className="eyebrow">In store and online</p>
          <h2 id="carry-title">What we carry</h2>
        </div>
        <Highlights />
      </section>

      <Cta secondary={["/find-us", "Find the store"]} />
    </>
  );
}
