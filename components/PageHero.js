import Title from "./Title";

// The banner at the top of every inner page: small label, title and an optional intro line.
export default function PageHero({ eyebrow, title, children }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Title text={title} />
        {children && <div className="page-intro">{children}</div>}
      </div>
    </header>
  );
}
