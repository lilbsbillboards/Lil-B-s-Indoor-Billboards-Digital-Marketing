import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";

const locationModules = import.meta.glob("/src/content/pages/locations/*.json", { eager: true });
const locations = Object.entries(locationModules)
  .map(([file, d]: [string, any]) => ({
    name: (d.location || d.city) as string,
    slug: file.split("/").pop()!.replace(".json", ""),
  }))
  .filter((l) => l.name)
  .sort((a, b) => a.name.localeCompare(b.name));

const body = () => `# ${siteConfig.business.name} - Indoor Billboard Advertising & Digital Marketing

> Local indoor digital billboard network and digital marketing company serving ${siteConfig.location.city}, ${siteConfig.location.state} and the surrounding Mid-Cities of Dallas–Fort Worth.

## About Us

${siteConfig.business.fullName} is a local business based in ${siteConfig.location.city}, ${siteConfig.location.stateFull}, operating since 2023. We connect local businesses with their customers through a network of indoor digital billboards in restaurants, gyms, shops, and other high-traffic venues, and we offer full-service digital marketing.

## Services

### Indoor Billboard Advertising
- Screen Advertising: Hyper-local digital screens in high-traffic venues — [/indoor-billboards/screen-advertising](${siteConfig.seo.siteUrl}/indoor-billboards/screen-advertising)
- Venue Network Locations: See where ads appear — [/indoor-billboards/locations](${siteConfig.seo.siteUrl}/indoor-billboards/locations)
- Become a Host Partner: Host a billboard in your business — [/indoor-billboards/become-a-venue-partner](${siteConfig.seo.siteUrl}/indoor-billboards/become-a-venue-partner)

### Foundational Marketing Services
- Website Design & Development: SEO-friendly, mobile-ready sites — [/solutions/foundational/website-design](${siteConfig.seo.siteUrl}/solutions/foundational/website-design)
- Google Business Profile Management: Local search optimization — [/solutions/foundational/google-business-profile](${siteConfig.seo.siteUrl}/solutions/foundational/google-business-profile)
- Social Media Management: Strategic content and engagement — [/solutions/foundational/social-media-management](${siteConfig.seo.siteUrl}/solutions/foundational/social-media-management)
- Design Services: Professional graphic design — [/solutions/foundational/design-services](${siteConfig.seo.siteUrl}/solutions/foundational/design-services)

### Lead Generation Services
- Pay-Per-Click Advertising: Google Ads that drive conversions — [/solutions/lead-gen/pay-per-click](${siteConfig.seo.siteUrl}/solutions/lead-gen/pay-per-click)
- Social Media Advertising: Targeted ads on Facebook, Instagram, LinkedIn — [/solutions/lead-gen/social-media-advertising](${siteConfig.seo.siteUrl}/solutions/lead-gen/social-media-advertising)

### Branding & Awareness Services
- Connected TV & OTT Ads: Non-skippable streaming TV ads — [/solutions/branding-awareness/connected-tv](${siteConfig.seo.siteUrl}/solutions/branding-awareness/connected-tv)
- Display Geofencing: Location-targeted digital ads — [/solutions/branding-awareness/display-geofencing](${siteConfig.seo.siteUrl}/solutions/branding-awareness/display-geofencing)
- Streaming Audio Ads: Podcast and music streaming advertising — [/solutions/branding-awareness/streaming-audio](${siteConfig.seo.siteUrl}/solutions/branding-awareness/streaming-audio)

## Service Areas

We serve businesses throughout the Mid-Cities of Dallas–Fort Worth, including:
${locations.map((c) => `- [${c.name}, ${siteConfig.location.state}](${siteConfig.seo.siteUrl}/locations/${c.slug})`).join("\n")}

## Key Pages

- [Home](${siteConfig.seo.siteUrl}/) — overview
- [About Us](${siteConfig.seo.siteUrl}/about-us) — team and approach
- [All Solutions](${siteConfig.seo.siteUrl}/solutions) — full service catalog
- [Contact](${siteConfig.seo.siteUrl}/contact-us) — request a consultation

## Contact Information

- Website: ${siteConfig.seo.siteUrl}
- Email: ${siteConfig.contact.email}
- Phone: ${siteConfig.contact.phoneFormatted}
- Location: ${siteConfig.location.fullAddress}
- Service Type: B2B Marketing Services
`;

export const GET: APIRoute = () => {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
