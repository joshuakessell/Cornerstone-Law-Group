import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const routesToPrerender = [
  "/",
  "/our-approach",
  "/our-team",
  "/services",
  "/contact",
  "/client-portal",
];

const baseUrl = process.env.PRERENDER_BASE_URL || "http://localhost:5000";
const distPath = path.resolve(process.cwd(), "dist/public");

export async function prerender() {
  console.log("[PRERENDER] Starting pre-render process...");

  // Ensure dist/public directory exists
  if (!existsSync(distPath)) {
    await mkdir(distPath, { recursive: true });
  }

  // Launch browser
  console.log("[PRERENDER] Launching browser...");
  let browser;
  try {
    browser = await chromium.launch();
    console.log("[PRERENDER] Browser launched successfully");
  } catch (error) {
    console.error("[PRERENDER] Error launching browser:", error);
    throw error;
  }
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Read the base index.html (original SPA shell)
  const indexPath = path.resolve(distPath, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error(
      `Index file not found at ${indexPath}. Make sure to run 'pnpm build' first.`
    );
  }
  const originalHtml = await readFile(indexPath, "utf-8");

  for (const route of routesToPrerender) {
    try {
      console.log(`Pre-rendering ${route}...`);
      
      const url = `${baseUrl}${route}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      
      // Wait a bit more for any animations or lazy-loaded content
      await page.waitForTimeout(1000);
      
      // Get the rendered HTML
      const html = await page.content();
      
      // Determine output path
      let outputPath: string;
      if (route === "/") {
        // Keep index.html at root for the home page
        outputPath = path.resolve(distPath, "index.html");
      } else {
        // Create directory structure for nested routes
        const routeDir = path.resolve(distPath, route.slice(1));
        await mkdir(routeDir, { recursive: true });
        outputPath = path.resolve(routeDir, "index.html");
      }
      
      // Extract the rendered content from the root div
      const rootDivRegex = /<div id="root">([\s\S]*?)<\/div>/;
      const rootDivMatch = html.match(rootDivRegex);
      
      if (rootDivMatch && rootDivMatch[1]) {
        // Inject the pre-rendered content into the original HTML shell
        const renderedContent = rootDivMatch[1];
        const prerenderedHtml = originalHtml.replace(
          /<div id="root"><\/div>/,
          `<div id="root">${renderedContent}</div>`
        );
        await writeFile(outputPath, prerenderedHtml, "utf-8");
      } else {
        // Fallback: use the full HTML from Playwright (should include all assets)
        await writeFile(outputPath, html, "utf-8");
      }
      
      console.log(`✓ Pre-rendered ${route} -> ${outputPath}`);
    } catch (error) {
      console.error(`✗ Failed to pre-render ${route}:`, error);
      throw error;
    }
  }

  await browser.close();
  console.log("Pre-render complete!");
}

