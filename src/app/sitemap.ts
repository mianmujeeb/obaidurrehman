import type { MetadataRoute } from "next";
import { treatments } from "@/lib/treatments";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...["/about", "/reviews", "/contact"].map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...treatments.map((t) => ({
      url: `${siteUrl}/treatments/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
