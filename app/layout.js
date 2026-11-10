import "./globals.css";
import { Unbounded, Hanken_Grotesk } from "next/font/google";
import site from "../site.config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeGate from "../components/AgeGate";
import EcwidScript from "../components/EcwidScript";

const display = Unbounded({ subsets: ["latin"], variable: "--font-display" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });

const description = "Glassware, smoking accessories and nicotine vapes. Shop online or visit the store.";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description,
  openGraph: { siteName: site.name, type: "website", locale: "en_CA", title: site.name, description },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <AgeGate minAge={site.minAge} />
        <EcwidScript storeId={site.storeId} />
      </body>
    </html>
  );
}
