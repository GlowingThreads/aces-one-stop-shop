// Tiny scripts placed at the very start of <body> so they run before the page is first painted.

// Age gate: if this visitor already confirmed their age, mark <html> so CSS hides the gate straight away.
// window.__ageOk also remembers it for this page view, for browsers that block both kinds of storage.
// localStorage is tried first, then a cookie, so it still works when one of them is blocked.
export const AGE_KEY = "age-verified";
export const ageScript = `(function(){var ok=false;try{ok=!!localStorage.getItem("${AGE_KEY}")}catch(e){}try{ok=ok||document.cookie.indexOf("${AGE_KEY}=1")>-1}catch(e){}ok=ok||window.__ageOk===true;if(ok){window.__ageOk=true;document.documentElement.setAttribute("data-age","ok")}})();`;

// The same check, for use after the page has loaded.
export function ageConfirmed() {
  let ok = window.__ageOk === true;
  try { ok = ok || Boolean(localStorage.getItem(AGE_KEY)); } catch {}
  try { ok = ok || document.cookie.includes(`${AGE_KEY}=1`); } catch {}
  return ok;
}

// Ecwid: its script is loaded after the page, so it must not use document.write.
export const ecwidScript = "window.ecwid_script_defer=true;window.ecwid_dynamic_widgets=true;";
