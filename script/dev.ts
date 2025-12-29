import { execSync } from "child_process";

const port = parseInt(process.env.PORT || "5000", 10);

console.log(`Killing any process on port ${port}...`);
try {
  execSync(`pnpm exec kill-port ${port}`, { stdio: "pipe" });
  console.log(`Port ${port} is now free.`);
} catch (error) {
  // Port might not be in use, which is fine - continue anyway
  console.log(`No process found on port ${port} (or already free).`);
}

// Now start the server
console.log(`Starting development server on port ${port}...`);
execSync("pnpm exec tsx server/index.ts", { stdio: "inherit" });

