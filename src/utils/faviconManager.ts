/**
 * Favicon & App Icon Dynamic Initializer
 * Guarantees that the new official Allôresto logo is instantly applied to:
 * 1. Browser Tab Favicons (SVG & PNG Data-URI fallbacks)
 * 2. Mobile Safari / iOS Home Screen Icons (apple-touch-icon)
 * 3. Android PWA & Chrome Mobile Toolbars
 */

// Embedded official vector SVG of the Allôresto Cloche & Casque Gourmand
const ALLORESTO_SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#0A0F1D"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9E00"/>
      <stop offset="45%" stop-color="#FF5100"/>
      <stop offset="100%" stop-color="#2DD4BF"/>
    </linearGradient>
    <linearGradient id="clocheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA62B"/>
      <stop offset="30%" stop-color="#FF6600"/>
      <stop offset="75%" stop-color="#FF3C00"/>
      <stop offset="100%" stop-color="#D92200"/>
    </linearGradient>
    <linearGradient id="headsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="35%" stop-color="#2DD4BF"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>
    <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="45%" stop-color="#E2E8F0"/>
      <stop offset="80%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <radialGradient id="aura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.35"/>
      <stop offset="65%" stop-color="#FF4500" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF2200" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="20" y="20" width="472" height="472" rx="116" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="12"/>
  <circle cx="256" cy="256" r="210" fill="url(#aura)"/>
  <g transform="translate(256, 262) scale(3.35) translate(-64, -64)">
    <g stroke="#FFB703" stroke-width="3" stroke-linecap="round" opacity="0.95">
      <path d="M 44 15 C 50 9 56 7 64 7 C 72 7 78 9 84 15"/>
      <path d="M 52 20 C 56 17 60 16 64 16 C 68 16 72 17 76 20"/>
    </g>
    <path d="M 98 17 L 100.5 22.5 L 106 24.5 L 100.5 26.5 L 98 32 L 95.5 26.5 L 90 24.5 L 95.5 22.5 Z" fill="#FBBF24"/>
    <path d="M 46 33 C 46 22 82 22 82 33" stroke="url(#headsetGrad)" stroke-width="6.5" stroke-linecap="round"/>
    <circle cx="64" cy="24" r="6" fill="#FBBF24" stroke="#D97706" stroke-width="1.2"/>
    <rect x="79.5" y="29" width="7.5" height="13" rx="3.5" fill="#0F766E"/>
    <path d="M 85 38 C 89 42 88 47 83 50" stroke="#2DD4BF" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="81" cy="50.5" r="2.2" fill="#2DD4BF"/>
    <path d="M 64 32 C 41 32 25 50 21 76 C 20 83 24 87 31 87 L 97 87 C 104 87 108 83 107 76 C 103 50 87 32 64 32 Z" fill="url(#clocheGrad)"/>
    <path d="M 64 37 C 49 37 36 47 31 62 C 29 66 32 68 35 66 C 39 54 49 44 64 43 C 67 43 68 39 66 37.5 C 65.5 37.2 64.8 37 64 37 Z" fill="#FFFFFF" opacity="0.45"/>
    <path d="M 40 61 C 43.5 55.5 51.5 55.5 55 61" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round"/>
    <ellipse cx="73" cy="59" rx="4.8" ry="6" fill="#0F172A"/>
    <circle cx="71.5" cy="57" r="1.9" fill="#FFFFFF"/>
    <circle cx="75" cy="61" r="1" fill="#FFFFFF"/>
    <circle cx="36" cy="67" r="3.5" fill="#EF4444" opacity="0.45"/>
    <circle cx="80" cy="67" r="3.5" fill="#EF4444" opacity="0.45"/>
    <path d="M 47 67 C 47 77 69 77 69 67 Z" fill="#0F172A"/>
    <path d="M 54 72 C 54 75.5 62 75.5 62 72 Z" fill="#F43F5E"/>
    <path d="M 17 87 C 17 85 21 83 27 83 L 101 83 C 107 83 111 85 111 87 L 109 91 C 109 94 105 96 99 96 L 29 96 C 23 96 19 94 19 91 Z" fill="url(#plateGrad)" stroke="#94A3B8" stroke-width="0.8"/>
    <rect x="13" y="95" width="102" height="4.5" rx="2.2" fill="#334155"/>
    <rect x="22" y="96" width="84" height="1.8" rx="0.9" fill="#E2E8F0" opacity="0.9"/>
    <g stroke="#FF6B00" stroke-width="2.6" stroke-linecap="round" opacity="0.95">
      <line x1="7" y1="75" x2="15" y2="75"/>
      <line x1="3" y1="83" x2="12" y2="83"/>
      <line x1="6" y1="91" x2="13" y2="91"/>
    </g>
  </g>
</svg>`;

export function applyOfficialBrandFavicon(): void {
  if (typeof document === "undefined") return;

  try {
    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ALLORESTO_SVG_FAVICON)}`;

    // Helper to set or create a link tag
    const setLinkTag = (rel: string, href: string, type?: string, sizes?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ""}`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        if (sizes) link.setAttribute("sizes", sizes);
        document.head.appendChild(link);
      }
      if (type) link.type = type;
      link.href = href;
    };

    // 1. Primary Vector SVG Favicon (Supported on all modern browsers with ultra-crisp resolution)
    setLinkTag("icon", svgDataUri, "image/svg+xml");
    setLinkTag("shortcut icon", "/favicon.ico?v=2026", "image/x-icon");

    // 2. High-Res PNG Favicons for legacy & fallback
    setLinkTag("icon", "/favicon-32x32.png?v=2026", "image/png", "32x32");
    setLinkTag("icon", "/favicon-16x16.png?v=2026", "image/png", "16x16");

    // 3. Apple Touch Icons (iOS Safari & iPadOS Home Screen)
    setLinkTag("apple-touch-icon", "/apple-touch-icon.png?v=2026");
    setLinkTag("apple-touch-icon", "/apple-touch-icon-180x180.png?v=2026", undefined, "180x180");

    // 4. Update document title if needed
    if (!document.title.includes("Allôresto")) {
      document.title = "Allôresto Niger — Livraison de Repas & Restaurants à Niamey";
    }
  } catch (err) {
    console.warn("Could not dynamically update favicon:", err);
  }
}
