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
  email: "acesonestopshopyeg@gmail.com", // shown in the footer and on Find Us
  // Your Google Business Profile. Used for the "hours on Google" link.
  googleUrl: "https://share.google/76OWNjN8PvT4TNC8y",
  // Your Google rating, shown as stars on the home page. Update these two numbers by hand now and then.
  google: { rating: 4.8, reviews: 399 },
  // Photos of the store for the About page, e.g. ["/store/front.jpg", "/store/counter.jpg"].
  // Put the files in public/store/ and list them here; the section appears once there is at least one.
  photos: [],
  // Opening hours, one line each, e.g. ["Monday to Thursday", "10am to 9pm"].
  // If this list is emptied the site links to Google for today's hours instead.
  hours: [["Every day", "9:30am to 11pm"]],
  // The same hours in the short form search engines read (days, then 24-hour times). Keep in step with the list above.
  hoursForSearch: "Mo-Su 09:30-23:00",
  // Kept off the website (they stay in Lightspeed). See lib/hidden.js for how this works.
  hiddenCategories: ["Ace's Fragrance", "Candles, Sprays and Incense"],   // category names; their subcategories are hidden too
  hideRollingSupplies: true,               // papers, wraps, cones, tips, rollers, filters, trays, ashtrays,
                                           // roach clips, pokers, doob tubes, RAW merch, backflow incense cones and burners
  hideCandlesAndSprays: true,              // candles, odour sprays, air fresheners and incense, wherever they are filed
  hiddenProducts: [],                      // Lightspeed product IDs to hide regardless of the rules
  shownProducts: [],                       // product IDs to show even if a rule would hide them
  // Home page: the line under the store name, and the three "what we carry" blocks. Edit freely.
  tagline: "Glassware, smoking accessories and nicotine vapes under one roof. Browse the range online or stop by the store.",
  highlights: [
    { icon: "glass", title: "Glassware", text: "Hand pipes, water pipes, bubblers and dab rigs, from everyday pieces to detailed showpieces." },
    { icon: "tools", title: "Accessories", text: "Grinders, rolling papers, storage and the small parts that keep a collection in good order." },
    { icon: "vape", title: "Vapes", text: "Nicotine vape devices, disposables, pods and e-liquid for adult customers." },
  ],
};
export default site;
