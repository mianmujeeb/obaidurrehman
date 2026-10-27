export const THEME_KEY = "theme";

// Inlined in <head> so a saved choice is on <html> before the first paint. With no
// saved choice the CSS follows the system setting. Mirrors applyTheme() in theme.ts.
export const themeInit = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
