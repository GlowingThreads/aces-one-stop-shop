"use client";
import { useEffect } from "react";
import { STORE_DIV, whenEcwidReady } from "./EcwidScript";

// Hosts Lightspeed's own storefront widget and opens it on one of its pages:
// "cart" (which leads into the secure checkout) or "account/settings" (sign in, orders, addresses).
export default function EcwidCart({ page = "cart" }) {
  useEffect(() => {
    // If the script loaded before this page was shown (browser back/forward), start the widget now.
    if (window.xProductBrowser && !document.getElementById(STORE_DIV)?.hasChildNodes()) {
      window.xProductBrowser(`id=${STORE_DIV}`);
    }
    return whenEcwidReady((Ecwid) => Ecwid.openPage(page));
  }, [page]);
  return <div id={STORE_DIV} className="ecwid-host" />;
}
