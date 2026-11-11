import Link from "next/link";
import site from "../site.config";
import Icon from "./Icon";

// Blocks shared by the home page and the About page.

export function Highlights() {
  return (
    <ul className="features">
      {site.highlights.map((h) => (
        <li key={h.title} className="reveal">
          <Icon name={h.icon} />
          <h3>{h.title}</h3>
          <p>{h.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Hours() {
  // No hours in site.config.js yet: point to the Google listing, which is always current.
  if (!site.hours.length) {
    return (
      <p className="hours-link">
        <a href={site.googleUrl} target="_blank" rel="noopener noreferrer">See today's hours on Google (opens in a new tab)</a>
      </p>
    );
  }
  return (
    <dl className="hours">
      {site.hours.map(([d, h]) => (
        <div key={d}><dt>{d}</dt><dd>{h}</dd></div>
      ))}
    </dl>
  );
}

export const tel = `tel:${site.phone.replace(/[^\d+]/g, "")}`;

export function Cta({ line = "One stop. The whole range.", secondary = ["/about", "About us"] }) {
  return (
    <section className="cta">
      <div className="wrap reveal">
        <p className="cta-line metal">{line}</p>
        <div className="actions">
          <Link className="btn" href="/shop">Start shopping</Link>
          <Link className="btn ghost" href={secondary[0]}>{secondary[1]}</Link>
        </div>
        <p className="fine">For adults aged {site.minAge} and over.</p>
      </div>
    </section>
  );
}
