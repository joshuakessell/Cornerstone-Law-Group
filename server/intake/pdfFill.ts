import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type FieldPlacement = {
  key: string;
  page: number; // 1-indexed for readability
  x: number;
  y: number;
  size?: number;
  color?: { r: number; g: number; b: number };
  lineHeight?: number;
};

function parsePlacements(raw: unknown): FieldPlacement[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw as FieldPlacement[];
  if ("fields" in raw && Array.isArray((raw as Record<string, unknown>).fields)) {
    return (raw as { fields: FieldPlacement[] }).fields;
  }
  return [];
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(", ");
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

async function ensureDir(target: string) {
  await fsp.mkdir(target, { recursive: true });
}

export async function fillPdfFromTemplate(options: {
  templatePath: string;
  fieldsPath: string;
  outputPath: string;
  answers: Record<string, unknown>;
}): Promise<{ pageCount: number }> {
  const { templatePath, fieldsPath, outputPath, answers } = options;

  if (!fs.existsSync(templatePath)) {
    const err = new Error(`Template PDF missing at ${templatePath}`);
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  if (!fs.existsSync(fieldsPath)) {
    const err = new Error(`Field map missing at ${fieldsPath}`);
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  const templateBytes = await fsp.readFile(templatePath);
  const placementsRaw = JSON.parse(await fsp.readFile(fieldsPath, "utf-8"));
  const placements = parsePlacements(placementsRaw);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const placement of placements) {
    const pageIndex = Math.max(0, (placement.page ?? 1) - 1);
    const page = pages[pageIndex];
    if (!page) continue;

    const text = toText(answers[placement.key]);
    if (!text) continue;

    const size = placement.size ?? 10;
    const lineHeight = placement.lineHeight ?? size + 2;
    const color = placement.color
      ? rgb(
          placement.color.r > 1 ? placement.color.r / 255 : placement.color.r,
          placement.color.g > 1 ? placement.color.g / 255 : placement.color.g,
          placement.color.b > 1 ? placement.color.b / 255 : placement.color.b,
        )
      : rgb(0, 0, 0);

    const lines = text.split("\n");
    lines.forEach((line, idx) => {
      page.drawText(line, {
        x: placement.x,
        y: placement.y - idx * lineHeight,
        size,
        font,
        color,
      });
    });
  }

  await ensureDir(path.dirname(outputPath));
  const pdfBytes = await pdfDoc.save();
  await fsp.writeFile(outputPath, pdfBytes);

  return { pageCount: pdfDoc.getPageCount() };
}

export async function getPdfPageCount(pdfPath: string): Promise<number> {
  const bytes = await fsp.readFile(pdfPath);
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

