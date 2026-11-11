import site from "../../site.config";
import PageHero from "../../components/PageHero";
import Icon from "../../components/Icon";
import { Hours, tel } from "../../components/Sections";

export const metadata = {
  title: "Find Us",
  description: `Store address, opening hours and map for ${site.name}.`,
};

export default function FindUs() {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address)}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    address: site.address,
    sameAs: site.googleUrl,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow="Come by" title="Find us">
        <p>{site.address}</p>
      </PageHero>
      <section className="wrap section">
        <div className="find">
          <div className="panel">
            <h2><Icon name="pin" /> Address</h2>
            <address>
              {site.address}<br />
              <a href={tel}>{site.phone}</a>
              {site.email && <><br /><a href={`mailto:${site.email}`}>{site.email}</a></>}
            </address>
            <p><a className="btn small" href={directions} target="_blank" rel="noopener noreferrer">Get directions (opens Google Maps)</a></p>
            <h2><Icon name="clock" /> Hours</h2>
            <Hours />
          </div>
          <iframe className="map" title={`Map showing ${site.name}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}
