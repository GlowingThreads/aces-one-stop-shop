"use client";
import Script from "next/script";

// Loads Ecwid's script on every page so the cart API (window.Ecwid.Cart) is available.
// Ecwid's own storefront widget is only shown on /cart, where it displays the cart and checkout.
export const STORE_DIV = "ecwid-store";

export default function EcwidScript({ storeId }) {
  if (!storeId) return null;
  return (
      <Script
        src={`https://app.ecwid.com/script.js?${storeId}&data_platform=code`}
        strategy="afterInteractive"
        onLoad={() => {
          // On /cart the storefront widget starts the API. Elsewhere there is no widget, so start it directly.
          if (document.getElementById(STORE_DIV)) window.xProductBrowser?.(`id=${STORE_DIV}`);
          else window.Ecwid?.init?.();
          window.dispatchEvent(new Event("ecwid-loaded"));
        }}
      />
  );
}

// Runs `fn(Ecwid)` once Ecwid's JavaScript API is ready. Returns a function that cancels the wait.
export function whenEcwidReady(fn) {
  let cancelled = false;
  const start = () => {
    const Ecwid = window.Ecwid;
    if (cancelled || !Ecwid?.OnAPILoaded) return false;
    Ecwid.OnAPILoaded.add(() => !cancelled && fn(Ecwid));
    return true;
  };
  if (!start()) window.addEventListener("ecwid-loaded", start, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("ecwid-loaded", start);
  };
}
