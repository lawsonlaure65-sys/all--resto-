/**
 * Favicon & App Icon Dynamic Initializer
 * Applies the official Allôresto logo icons across:
 * 1. Browser Tab Favicons (PNG & ICO)
 * 2. Mobile Safari / iOS Home Screen Icons (apple-touch-icon)
 * 3. Android PWA & Chrome Mobile Toolbars
 */

export function applyOfficialBrandFavicon(): void {
  if (typeof document === "undefined") return;

  try {
    const cacheBust = "v=4";

    // Remove any stale legacy icon links (SVG, mask-icon, or outdated unversioned links)
    const staleLinks = document.querySelectorAll(
      'link[rel="icon"][type="image/svg+xml"], link[rel="mask-icon"], link[rel="icon"]:not([href*="v=4"]), link[rel="shortcut icon"]:not([href*="v=4"])'
    );
    staleLinks.forEach((el) => el.parentNode?.removeChild(el));

    const setLinkTag = (rel: string, href: string, type?: string, sizes?: string) => {
      const selector = `link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ""}`;
      let link = document.querySelector(selector) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        if (sizes) link.setAttribute("sizes", sizes);
        document.head.appendChild(link);
      }
      if (type) link.type = type;
      link.href = href;
    };

    // 1. Standard & Multi-Size PNG Favicons + ICO
    setLinkTag("icon", `/favicon-32x32.png?${cacheBust}`, "image/png", "32x32");
    setLinkTag("icon", `/favicon-16x16.png?${cacheBust}`, "image/png", "16x16");
    setLinkTag("icon", `/favicon-48x48.png?${cacheBust}`, "image/png", "48x48");
    setLinkTag("icon", `/favicon.png?${cacheBust}`, "image/png", "64x64");
    setLinkTag("icon", `/icon-192.png?${cacheBust}`, "image/png", "192x192");
    setLinkTag("shortcut icon", `/favicon.ico?${cacheBust}`, "image/x-icon");

    // 2. Apple Touch Icons (iOS Safari & iPadOS Home Screen)
    setLinkTag("apple-touch-icon", `/apple-touch-icon.png?${cacheBust}`);
    setLinkTag("apple-touch-icon", `/apple-touch-icon-180x180.png?${cacheBust}`, undefined, "180x180");

    // 3. Web App Manifest
    setLinkTag("manifest", `/manifest.json?${cacheBust}`);

    // 4. Ensure document title includes Allôresto
    if (!document.title.includes("Allôresto")) {
      document.title = "Allôresto Niger — Livraison de Repas & Restaurants à Niamey";
    }
  } catch (err) {
    console.warn("Could not dynamically update favicon:", err);
  }
}
