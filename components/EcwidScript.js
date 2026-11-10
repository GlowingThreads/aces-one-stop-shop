"use client";
import Script from "next/script";

// Loads Ecwid's script so the cart and checkout API is available on every page.
export default function EcwidScript({ storeId }) {
  if (!storeId) return null;
  const id = `my-store-${storeId}`;
  return (
    <>
      <div id={id} hidden />
      <Script
        src={`https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=2026-11-10`}
        strategy="afterInteractive"
        onLoad={() => window.xProductBrowser?.(`id=${id}`)}
      />
    </>
  );
}
