import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/achievements`, changeFrequency: "monthly", priority: 0.6 },
  ];

  for (const project of projects) {
    routes.push({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return routes;
}
