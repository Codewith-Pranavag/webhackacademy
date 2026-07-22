import type { MetadataRoute } from "next";
import { site } from "@/constants/site";
import { courses } from "@/constants/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/courses",
    "/mentors",
    "/contact",
    "/login",
    "/register",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const courseRoutes = courses.map((c) => ({
    url: `${site.url}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...courseRoutes];
}
