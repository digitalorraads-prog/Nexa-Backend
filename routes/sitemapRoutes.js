const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Blog = require("../models/Blog");

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://nexainfotech.com";

  // Static Pages
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/gallery",
    "/portfolio",
    "/contact",
  ];

  try {
    // Dynamic Services (Slugs)
    const services = await Service.find({}, "slug updatedAt");
    const servicePages = services.map((s) => ({
      url: s.slug.startsWith("/") ? s.slug : `/${s.slug}`,
      lastmod: s.updatedAt.toISOString().split("T")[0],
    }));

    // Dynamic Blogs (IDs)
    const blogs = await Blog.find({}, "_id updatedAt");
    const blogPages = blogs.map((b) => ({
      url: `/blog/${b._id}`,
      lastmod: b.updatedAt.toISOString().split("T")[0],
    }));

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach((path) => {
      xml += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    });

    // Add dynamic services
    servicePages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // Add dynamic blogs
    blogPages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
