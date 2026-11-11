// The banner at the top of every inner page: small label, chrome title and an optional intro line.
export default function PageHero({ eyebrow, title, children }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="metal">{title}</h1>
        {children && <div className="page-intro">{children}</div>}
      </div>
    </header>
  );
}
