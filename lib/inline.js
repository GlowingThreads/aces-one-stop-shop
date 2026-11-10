// Tiny scripts placed in <head> so they run before the page is first painted.

// Age gate: if this visitor already confirmed their age, mark <html> so CSS hides the gate straight away.
// localStorage is tried first, then a cookie, so it still works when one of them is blocked.
export const AGE_KEY = "age-verified";
export const ageScript = `(function(){var ok=false;try{ok=!!localStorage.getItem("${AGE_KEY}")}catch(e){}try{ok=ok||document.cookie.indexOf("${AGE_KEY}=1")>-1}catch(e){}if(ok)document.documentElement.setAttribute("data-age","ok")})()`;

// Ecwid: its script is loaded after the page, so it must not use document.write.
export const ecwidScript = "window.ecwid_script_defer=true;window.ecwid_dynamic_widgets=true;";
