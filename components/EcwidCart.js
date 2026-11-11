"use client";
import { useEffect } from "react";
import { STORE_DIV, whenEcwidReady } from "./EcwidScript";

// Hosts Ecwid's own storefront widget and opens it on the cart, which leads into Ecwid's secure checkout.
export default function EcwidCart() {
  useEffect(() => {
    // If the script loaded before this page was shown (browser back/forward), start the widget now.
    if (window.xProductBrowser && !document.getElementById(STORE_DIV)?.hasChildNodes()) {
      window.xProductBrowser(`id=${STORE_DIV}`);
    }
    return whenEcwidReady((Ecwid) => Ecwid.openPage("cart"));
  }, []);
  return <div id={STORE_DIV} className="ecwid-host" />;
}
