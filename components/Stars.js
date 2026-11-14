import site from "../site.config";

// The store's Google rating, as five chrome stars filled to match the score, linking to the listing.
// The numbers come from site.config.js (google.rating and google.reviews) and are updated by hand.
const STAR = "M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.900 3.100 1.200-6.600L2.500 9.500l6.600-.900z";

export default function Stars() {
  const { rating, reviews } = site.google || {};
  if (!rating) return null;
  const filled = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (className) => (
    <svg className={className} viewBox="0 0 120 24" width="110" height="22" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={STAR} transform={`translate(${i * 24} 0)`} />)}
    </svg>
  );
  return (
    <a className="rating" href={site.googleUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`Rated ${rating} out of 5 from ${reviews} Google reviews (opens in a new tab)`}>
      <span className="stars">
        {row("stars-empty")}
        {/* The filled row sits on top and is cut off at the score, e.g. 96% for 4.8 */}
        <span className="stars-fill" style={{ width: `${filled}%` }}>{row("stars-full")}</span>
      </span>
      <span className="rating-text"><strong>{rating.toFixed(1)}</strong> · {reviews} Google reviews</span>
    </a>
  );
}
