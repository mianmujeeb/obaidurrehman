// Inlined in <head> so the install prompt is caught before React hydrates.
// Read by usePwaInstall() in components/pwa/install.tsx.
export const installPromptCapture = `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__installPrompt=e;window.dispatchEvent(new Event("installprompt-ready"))});`;
