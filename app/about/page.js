import site from "../../site.config";

export const metadata = {
  title: "About Us",
  description: "Meet the team behind Ace's One Stop Shop, a local store for glassware, smoking accessories and nicotine vapes.",
};

export default function About() {
  return (
    <section className="wrap section narrow">
      <h1 className="metal">About us</h1>
      {/* TODO: replace with your real story */}
      <p>
        {site.name} is a local shop for glassware, smoking accessories and nicotine vaping products. We stock
        everything from everyday pipes and grinders to detailed water pipes and dab rigs.
      </p>
      <p>
        Our staff can help you choose the right piece, whether you are buying your first or adding to a collection.
        Ask us anything in store, or browse the shop online.
      </p>
    </section>
  );
}
