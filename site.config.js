// Edit the placeholders below. Everything on the site reads from this file.
const site = {
  name: "Ace's One Stop Shop",
  storeId: process.env.NEXT_PUBLIC_ECWID_STORE_ID || "",
  publicToken: process.env.ECWID_PUBLIC_TOKEN || "",
  // Host of the storefront script, taken from the "custom code" snippet in your Lightspeed admin.
  scriptHost: "app.business.shop",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // your live domain, e.g. https://acesshop.ca
  currency: "CAD",
  minAge: 19,
  city: "Edmonton, Alberta",
  address: "8927 Whyte Ave NW, Edmonton, AB T6C 0W8", // also drives the map
  phone: "(780) 757-3420",
  email: "", // optional: add an address to show it in the footer and on Find Us
  // Your Google Business Profile. Used for the "hours on Google" link.
  googleUrl: "https://share.google/76OWNjN8PvT4TNC8y",
  // Opening hours, one line each, e.g. ["Monday to Thursday", "10am to 9pm"].
  // While this list is empty the site links to Google for today's hours instead.
  hours: [],
  // Home page: the line under the store name, and the three "what we carry" blocks. Edit freely.
  tagline: "Glassware, smoking accessories and nicotine vapes under one roof. Browse the range online or stop by the store.",
  highlights: [
    { icon: "glass", title: "Glassware", text: "Hand pipes, water pipes, bubblers and dab rigs, from everyday pieces to detailed showpieces." },
    { icon: "tools", title: "Accessories", text: "Grinders, rolling papers, storage and the small parts that keep a collection in good order." },
    { icon: "vape", title: "Vapes", text: "Nicotine vape devices, disposables, pods and e-liquid for adult customers." },
  ],
  // Shown until your Ecwid store is connected; afterwards categories come from Lightspeed.
  categories: [
    "Glass Pipes", "Bongs & Water Pipes", "Dab Rigs", "Bubblers", "Rolling Papers",
    "Grinders", "Storage & Stash", "Vape Devices", "Disposable Vapes", "E-Liquid & Pods",
  ],
};
export default site;
