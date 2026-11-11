import Link from "next/link";
import PageHero from "../components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="Page not found">
        <p>That page does not exist, or the product is no longer available.</p>
        <div className="actions">
          <Link className="btn" href="/shop">Go to the shop</Link>
          <Link className="btn ghost" href="/">Home</Link>
        </div>
      </PageHero>
    </>
  );
}
