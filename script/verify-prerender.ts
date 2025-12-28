import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const routesToCheck = [
  { path: "/", file: "index.html", heading: "Family" },
  { path: "/our-approach", file: "our-approach/index.html", heading: "Our Approach" },
  { path: "/our-team", file: "our-team/index.html", heading: "Team" },
  { path: "/services", file: "services/index.html", heading: "Services" },
  { path: "/contact", file: "contact/index.html", heading: "Contact" },
  { path: "/client-portal", file: "client-portal/index.html", heading: "Client Portal" },
];

const distPath = path.resolve(process.cwd(), "dist/public");

async function verifyPrerender() {
  console.log("Verifying pre-rendered HTML files...\n");
  
  let allPassed = true;

  for (const { path: route, file, heading } of routesToCheck) {
    const filePath = path.resolve(distPath, file);
    
    if (!existsSync(filePath)) {
      console.error(`✗ ${route}: File not found at ${file}`);
      allPassed = false;
      continue;
    }

    try {
      const html = await readFile(filePath, "utf-8");
      
      // Check if the HTML contains the expected heading/text
      if (!html.includes(heading)) {
        console.error(`✗ ${route}: Expected heading "${heading}" not found in HTML`);
        allPassed = false;
        continue;
      }

      // Check if the HTML contains rendered content (not just a root div)
      const rootDivRegex = /<div id="root">[\s\S]*?<\/div>/;
      const match = html.match(rootDivRegex);
      
      if (!match || match[0].length < 100) {
        console.error(`✗ ${route}: Root div appears to be empty or minimal`);
        allPassed = false;
        continue;
      }

      // Check for meta tags
      if (!html.includes("<title>") || !html.includes("<meta name=\"description\"")) {
        console.warn(`⚠ ${route}: Missing some meta tags`);
      }

      console.log(`✓ ${route}: Verified`);
    } catch (error) {
      console.error(`✗ ${route}: Error reading file:`, error);
      allPassed = false;
    }
  }

  console.log("\n" + "=".repeat(50));
  if (allPassed) {
    console.log("✓ All pre-rendered routes verified successfully!");
    process.exit(0);
  } else {
    console.error("✗ Some routes failed verification");
    process.exit(1);
  }
}

verifyPrerender().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

