// ===========================================
// SITE CONFIGURATION
// Reads from src/content/settings/site.json
// ===========================================

import siteData from "../content/settings/site.json";

const defaults = {
  business: {
    name: "Lil' B's Indoor Billboards",
    fullName: "Lil' B's Indoor Billboards & Digital Marketing",
    tagline: "We bring local businesses to the forefront of our community",
    description:
      "Local advertising company in Bedford, Texas offering indoor digital billboards, website design, SEO, PPC, and social media management.",
  },
  location: {
    city: "Bedford",
    state: "TX",
    stateFull: "Texas",
    address: "Bedford, TX",
    fullAddress: "Bedford, TX",
  },
  contact: {
    email: "lilbsbillboards@gmail.com",
    phone: "+18178943612",
    phoneFormatted: "(817) 894-3612",
  },
  colors: {
    primary: "#0A0A0A",
    secondary: "#C71B23",
    tertiary: "#A12128",
    quaternary: "#FFFFFF",
  },
  logo: {
    src: "/logo/lil-bs-logo.png",
    whiteSrc: "/logo/lil-bs-logo.png",
    alt: "Lil' B's Indoor Billboards & Digital Marketing logo",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  seo: {
    siteName: "Lil' B's Indoor Billboards & Digital Marketing",
    defaultTitle: "Bedford TX Indoor Billboards & Digital Marketing | Lil' B's",
    defaultDescription:
      "Local advertising company in Bedford, Texas offering indoor digital billboards, website design, SEO, PPC, and social media management.",
    keywords: "indoor billboards, digital marketing, Bedford TX advertising, website design, SEO, PPC",
    siteUrl: "https://lilbsbillboards.com",
    ogImage: "/images/og-image.jpg",
    twitterHandle: "",
  },
  analytics: { googleAnalyticsId: "" },
};

// ─── URL Resolution Chain (Vercel-aware) ─────────────────────────────────────
function normalizeUrl(u: string | undefined | null): string | null {
  if (!u) return null;
  const t = String(u).trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withProto.replace(/\/+$/, "");
}

const env = import.meta.env as Record<string, string | undefined>;
const SETTINGS_URL = normalizeUrl(siteData.seo?.siteUrl) ?? normalizeUrl(defaults.seo.siteUrl);
const PLACEHOLDER =
  !SETTINGS_URL ||
  /example\.com$/.test(SETTINGS_URL) ||
  /\.vercel\.app$/.test(SETTINGS_URL);

const RESOLVED_SITE_URL =
  normalizeUrl(env.PUBLIC_SITE_URL) ||
  normalizeUrl(env.SITE_URL) ||
  (PLACEHOLDER
    ? normalizeUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ||
      normalizeUrl(env.VERCEL_URL) ||
      SETTINGS_URL
    : SETTINGS_URL) ||
  "https://example.com";

export const siteConfig = {
  business: {
    name: siteData.business?.name || defaults.business.name,
    fullName: siteData.business?.fullName || defaults.business.fullName,
    tagline: siteData.business?.tagline || defaults.business.tagline,
    description: siteData.business?.description || defaults.business.description,
  },

  location: {
    city: siteData.location?.city || defaults.location.city,
    state: siteData.location?.state || defaults.location.state,
    stateFull:
      (siteData.location as { stateFull?: string })?.stateFull ||
      defaults.location.stateFull,
    address: siteData.location?.address || defaults.location.address,
    fullAddress: siteData.location?.fullAddress || defaults.location.fullAddress,
  },

  contact: {
    email: siteData.contact?.email || defaults.contact.email,
    phone: siteData.contact?.phone || defaults.contact.phone,
    phoneFormatted: siteData.contact?.phoneFormatted || defaults.contact.phoneFormatted,
  },

  colors: {
    primary: siteData.colors?.primary || defaults.colors.primary,
    secondary: siteData.colors?.secondary || defaults.colors.secondary,
    tertiary: siteData.colors?.tertiary || defaults.colors.tertiary,
    quaternary: siteData.colors?.quaternary || defaults.colors.quaternary,
  },

  logo: {
    src: siteData.logo?.src || defaults.logo.src,
    whiteSrc:
      (siteData.logo as { whiteSrc?: string })?.whiteSrc ||
      siteData.logo?.src ||
      defaults.logo.whiteSrc,
    alt: siteData.logo?.alt || defaults.logo.alt,
  },

  social: {
    facebook: (siteData as any).social?.facebook || "",
    instagram: (siteData as any).social?.instagram || "",
    linkedin: (siteData as any).social?.linkedin || "",
    twitter: (siteData as any).social?.twitter || "",
    youtube: (siteData as any).social?.youtube || "",
  },

  seo: {
    siteName: siteData.seo?.siteName || defaults.seo.siteName,
    defaultTitle: siteData.seo?.defaultTitle || defaults.seo.defaultTitle,
    defaultDescription:
      siteData.seo?.defaultDescription || defaults.seo.defaultDescription,
    keywords: siteData.seo?.keywords || defaults.seo.keywords,
    siteUrl: RESOLVED_SITE_URL,
    ogImage: siteData.seo?.ogImage || defaults.seo.ogImage,
    twitterHandle: siteData.seo?.twitterHandle || defaults.seo.twitterHandle,
  },

  analytics: {
    googleAnalyticsId: siteData.analytics?.googleAnalyticsId || "",
  },
};

// ─── Token Replacement Helpers ──────────────────────────────────────────────
export function getLocationText(text: string) {
  return text
    .replaceAll("{city}", siteConfig.location.city)
    .replaceAll("{state}", siteConfig.location.state)
    .replaceAll("{stateFull}", siteConfig.location.stateFull)
    .replaceAll("{business}", siteConfig.business.name)
    .replaceAll("{email}", siteConfig.contact.email)
    .replaceAll("{phone}", siteConfig.contact.phone)
    .replaceAll("{phoneFormatted}", siteConfig.contact.phoneFormatted);
}

export function localizeData<T>(data: T): T {
  if (typeof data === "string") return getLocationText(data) as T;
  if (Array.isArray(data)) return data.map((item) => localizeData(item)) as T;
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = localizeData(value);
    }
    return result as T;
  }
  return data;
}

export function localizeMetadata(
  meta: any,
  extras: Record<string, string> = {}
) {
  if (!meta) return meta;
  const apply = (s: string | undefined) => {
    if (!s) return s;
    let out = getLocationText(s);
    for (const [k, v] of Object.entries(extras)) {
      out = out.replaceAll(`{${k}}`, v);
    }
    return out;
  };
  return {
    ...meta,
    title: apply(meta.title),
    description: apply(meta.description),
    keywords: apply(meta.keywords),
  };
}
