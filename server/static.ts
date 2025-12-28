import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const PRERENDERED_ROUTES = [
  "/",
  "/our-approach",
  "/our-team",
  "/services",
  "/contact",
  "/client-portal",
];

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static assets
  app.use(express.static(distPath));

  // Handle specific routes: check for pre-rendered HTML first
  app.use((req, res, next) => {
    // Skip API routes and static assets
    if (req.path.startsWith("/api") || req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webm|pdf|json)$/)) {
      return next();
    }

    // Check if this is a pre-rendered route
    const route = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
    if (PRERENDERED_ROUTES.includes(route)) {
      let htmlPath: string;
      
      if (route === "/") {
        // Home page: use index.html (already pre-rendered)
        htmlPath = path.resolve(distPath, "index.html");
      } else {
        // Other routes: check for route/index.html
        htmlPath = path.resolve(distPath, route.slice(1), "index.html");
      }

      if (fs.existsSync(htmlPath)) {
        return res.sendFile(htmlPath);
      }
    }

    // Fall through to SPA index.html for non-pre-rendered routes
    next();
  });

  // SPA fallback: serve index.html for all non-API routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
