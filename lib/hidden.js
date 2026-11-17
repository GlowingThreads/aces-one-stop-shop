// Decides which products are kept off the website. They stay in Lightspeed untouched; the site
// simply never lists them, links to them, or opens their pages.
//
// Two kinds of rules:
//   1. Whole categories, by name, listed in site.config.js (hiddenCategories). Every product in one of
//      those categories, or in any of its subcategories, is hidden, and the category itself disappears.
//   2. Rolling papers, wraps, cones, tips and the things used with them (trays, ashtrays, roach clips,
//      pokers, doob tubes, RAW clothing and merch, and backflow incense cones and burners). Most have no category in
//      the store, so they are recognised by their names, using the rules below.
//
// To hide or show one particular product regardless of these rules, add its Lightspeed product ID to
// hiddenProducts or shownProducts in site.config.js.
import site from "../site.config";

// Lower case, straight apostrophes and single spaces, so "Ace’s  Fragrance" and "ace's fragrance" match.
const tidy = (text) => ` ${String(text || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, " ").trim()} `;

const hiddenCategoryNames = new Set((site.hiddenCategories || []).map((name) => tidy(name).trim()));
export const isHiddenCategoryName = (name) => hiddenCategoryNames.has(tidy(name).trim());

/* ---------- Rolling papers, wraps and related ---------- */

// Accessories that go with them, hidden as well. Each rule is [what it is, how its name looks].
const ROLLING_ACCESSORIES = [
  ["trays and ashtrays", (n) => /\btrays?\b|ash ?tray|ashtray|bashtray|sk8tray/.test(n)], // every tray, incl. kief trays
  ["roach clips", (n) => /roach clip/.test(n)],
  ["pokers", (n) => /\bpokers?\b/.test(n)],
  ["doob tubes", (n) => /\bdoob/.test(n)],
  ["backflow incense cones and burners", (n) => /backflow/.test(n)],
  ["RAW clothing and merch", (n) => /^ raw /.test(n) && /hoodie|shirt|onesie|tote|face mask|stocking|vday|cards|activity book|clock|day bag/.test(n)],
];

// Things that look like a match by name but are not rolling supplies, so they stay on the site.
const NOT_ROLLING = [
  /incense|burner/,                          // other incense products
  /\bperc\b|showerhead|bong|beaker|rig\b/,   // "cone perc" bongs and rigs
  /cone screen|bowl/,                        // bowl screens and cone bowls
  /grinder|shredder/,                        // grinders
  /\bjar\b/,                                 // storage jars
];

// Names that mean a product is a rolling supply.
const ROLLING = [
  /\bpapers?\b/,                             // rolling papers of every brand
  /\bwraps?\b/,                              // hemp, rose and leaf wraps, and wrap glue
  /\bcones?\b/,                              // pre-rolled cones, cone packs, cone fillers and cases
  /\b1[ -]1\/4\b|\bking ?size\b|\bsingle wide\b|\bslims?\b|\bks\b/, // paper sizes
  /\broller\b(?! ball)|\brolling\b|bump box|\braw 2 stage\b|paper puncher/, // rolling machines and tools
  /\bfilters?\b/,                            // filter tips and cigarette filters (exceptions below)
  /^ (elements|zig ?zag|ocb|gizeh|vibes|lion'?s choice|blazy susan|skunk|hazo|dlx|pure hemp|randys wired|juicy jay|king palm|endo|kingpin|raw five on it)\b/, // paper and wrap brands
];

// "Tips" are rolling tips, except on dab and vape gear ("quartz tip", "nectar collector tip" and so on).
const ROLLING_TIPS = /\btips?\b/;
const NOT_ROLLING_TIPS = /quartz|vapou?r|nectar|collector|\brip tip|slurp|sluper|atomizer|dab|w\/ /;

// Filters that belong to pipes, bongs and vapes, not to joints.
const NOT_ROLLING_FILTERS = /bong|pipe|tube|moose ?labs|dabox|phx|replacement|vape/;

export function isRollingSupply(name) {
  const n = tidy(name);
  if (ROLLING_ACCESSORIES.some(([, rule]) => rule(n))) return true;
  if (NOT_ROLLING.some((rule) => rule.test(n))) return false;
  if (ROLLING_TIPS.test(n) && !NOT_ROLLING_TIPS.test(n)) return true;
  if (/\bfilters?\b/.test(n) && NOT_ROLLING_FILTERS.test(n)) return false;
  return ROLLING.some((rule) => rule.test(n));
}

/* ---------- The decision ---------- */

const alwaysHidden = new Set((site.hiddenProducts || []).map(String));
const alwaysShown = new Set((site.shownProducts || []).map(String));

// `product` needs { id, name, categoryIds }. `hiddenCategoryIds` is a Set of category IDs to hide.
export function isHiddenProduct(product, hiddenCategoryIds) {
  const id = String(product.id);
  if (alwaysShown.has(id)) return false;
  if (alwaysHidden.has(id)) return true;
  if ((product.categoryIds || []).some((c) => hiddenCategoryIds.has(c))) return true;
  if (product.defaultCategoryId && hiddenCategoryIds.has(product.defaultCategoryId)) return true;
  return site.hideRollingSupplies !== false && isRollingSupply(product.name);
}
