import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { spawn } from "child_process";

export async function generateThumbnail(pdfPath: string, outputPath: string): Promise<void> {
  if (!fs.existsSync(pdfPath)) {
    const err = new Error(`Cannot create thumbnail, missing PDF at ${pdfPath}`);
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  await fsp.mkdir(path.dirname(outputPath), { recursive: true });

  const prefix = outputPath.replace(/\.png$/, "");

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("pdftoppm", ["-f", "1", "-l", "1", "-png", pdfPath, prefix], {
      stdio: "ignore",
    });

    proc.on("error", (error) => {
      const err = new Error(
        "pdftoppm (Poppler) is required to create thumbnails. Please install it or add it to PATH.",
      );
      (err as Error & { cause?: unknown; status?: number }).cause = error;
      (err as Error & { status?: number }).status = 500;
      reject(err);
    });

    proc.on("close", (code) => {
      if (code === 0) return resolve();
      const err = new Error(`pdftoppm exited with code ${code}`);
      (err as Error & { status?: number }).status = 500;
      reject(err);
    });
  });

  const generatedPath = `${prefix}-1.png`;
  if (!fs.existsSync(generatedPath)) {
    const err = new Error("Thumbnail generation failed. Expected png not found.");
    (err as Error & { status?: number }).status = 500;
    throw err;
  }

  await fsp.rename(generatedPath, outputPath);
}

