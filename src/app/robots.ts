import type { MetadataRoute } from "next";
import { site } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/register", "/forgot-password"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
