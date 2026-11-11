import "./globals.css";
import { Unbounded, Hanken_Grotesk } from "next/font/google";
import site from "../site.config";
import { ageScript, ecwidScript } from "../lib/inline";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeGate from "../components/AgeGate";
import EcwidScript from "../components/EcwidScript";
import { ChromeFilters } from "../components/ChromeTitle";

const display = Unbounded({ subsets: ["latin"], variable: "--font-display" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });

const description = "Glassware, smoking accessories and nicotine vapes. Shop online or visit the store.";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description,
  openGraph: { siteName: site.name, type: "website", locale: "en_CA", title: site.name, description },
};

export const viewport = { themeColor: "#000000" };

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the age script below may add data-age to <html> before React starts.
    <html lang="en-CA" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        {/* First thing in <body>, so it runs before any content is drawn. It is deliberately not in <head>:
            hosts such as Netlify add their own tags there, which React must not be asked to match. */}
        <script dangerouslySetInnerHTML={{ __html: ageScript + (site.storeId ? ecwidScript : "") }} />
        <ChromeFilters />
        <div id="site">
          <a href="#main" className="skip">Skip to content</a>
          <Header />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <AgeGate minAge={site.minAge} />
        <EcwidScript storeId={site.storeId} />
      </body>
    </html>
  );
}
