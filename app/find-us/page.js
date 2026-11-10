import site from "../../site.config";

export const metadata = {
  title: "Find Us",
  description: "Store address, opening hours and map for Ace's One Stop Shop.",
};

export default function FindUs() {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    address: site.address,
  };
  return (
    <section className="wrap section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <h1 className="metal">Find us</h1>
      <div className="find">
        <div className="panel">
          <h2>Address</h2>
          <p>{site.address}</p>
          <p>{site.phone}</p>
          <p>{site.email}</p>
          <h2>Hours</h2>
          <dl className="hours">
            {site.hours.map(([d, h]) => (
              <div key={d}><dt>{d}</dt><dd>{h}</dd></div>
            ))}
          </dl>
        </div>
        <iframe className="map" title={`Map of ${site.name}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}
