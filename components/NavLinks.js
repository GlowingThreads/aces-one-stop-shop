"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["/", "Home"], ["/shop", "Shop"], ["/about", "About Us"], ["/find-us", "Find Us"]];

// Main menu. Marks the current page for screen readers and for styling.
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="nav">
      {links.map(([href, label]) => {
        const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={current ? "page" : undefined}>{label}</Link>
        );
      })}
    </nav>
  );
}
