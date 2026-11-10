// Edit the placeholders below. Everything on the site reads from this file.
const site = {
  name: "Ace's One Stop Shop",
  storeId: process.env.NEXT_PUBLIC_ECWID_STORE_ID || "",
  publicToken: process.env.ECWID_PUBLIC_TOKEN || "",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // your live domain, e.g. https://acesshop.ca
  currency: "CAD",
  minAge: 19,
  address: "Your street address, City, AB", // TODO: real address (drives the map)
  phone: "(000) 000-0000", // TODO
  email: "hello@example.com", // TODO
  hours: [
    ["Monday to Thursday", "10am to 9pm"],
    ["Friday and Saturday", "10am to 10pm"],
    ["Sunday", "11am to 7pm"],
  ], // TODO
  // Shown until your Ecwid store is connected; afterwards categories come from Lightspeed.
  categories: [
    "Glass Pipes", "Bongs & Water Pipes", "Dab Rigs", "Bubblers", "Rolling Papers",
    "Grinders", "Storage & Stash", "Vape Devices", "Disposable Vapes", "E-Liquid & Pods",
  ],
};
export default site;
