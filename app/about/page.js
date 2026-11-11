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
        <p>A local shop in {site.city} for glassware, smoking accessories and nicotine vaping products.</p>
      </PageHero>

      <section className="wrap section split">
        <div className="prose">
          {/* TODO: replace with your real story */}
          <p className="lead">
            {site.name} stocks everything from everyday pipes and grinders to detailed water pipes and dab rigs.
          </p>
          <p>
            Our staff can help you choose the right piece, whether you are buying your first or adding to a collection.
            Ask us anything in store, or browse the shop online.
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
