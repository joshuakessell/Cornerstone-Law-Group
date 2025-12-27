import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { spawn } from "child_process";
import { PDFDocument } from "pdf-lib";
import { templatesRoot } from "./indexStore";
import { convertDocxTemplates } from "./docxConvert";
import type { IntakeDef, FieldDef } from "../../client/src/intake/engine/types";
import { basicIntake } from "../../client/src/intake/definitions/basic";
import { divorceIntake } from "../../client/src/intake/definitions/divorce";
import { modificationIntake } from "../../client/src/intake/definitions/modification";
import { enforcementIntake } from "../../client/src/intake/definitions/enforcement";
import { adoptionIntake } from "../../client/src/intake/definitions/adoption";
import { mediationIntake } from "../../client/src/intake/definitions/mediation";
import { maritalAgreementIntake } from "../../client/src/intake/definitions/marital-agreement";
import { prenuptialAgreementIntake } from "../../client/src/intake/definitions/prenuptial-agreement";
import { willsTrustsEstatesIntake } from "../../client/src/intake/definitions/wills-trusts-estates";

export const allowedFormTypes = [
  "basic-intake",
  "divorce",
  "modification",
  "enforcement",
  "adoption",
  "mediation",
  "marital-agreement",
  "prenuptial-agreement",
  "wills-trusts-estates",
  "unsure",
] as const;

export type FormType = (typeof allowedFormTypes)[number];

export function getIntakeDefForFormType(formType: FormType): IntakeDef | null {
  const map: Record<string, IntakeDef> = {
    "basic-intake": basicIntake,
    divorce: divorceIntake,
    modification: modificationIntake,
    enforcement: enforcementIntake,
    adoption: adoptionIntake,
    mediation: mediationIntake,
    "marital-agreement": maritalAgreementIntake,
    "prenuptial-agreement": prenuptialAgreementIntake,
    "wills-trusts-estates": willsTrustsEstatesIntake,
  };

  if (formType === "unsure") {
    return null;
  }

  return map[formType] ?? null;
}

export function listFields(def: IntakeDef): Array<{ key: string; label: string }> {
  const fields: Array<{ key: string; label: string }> = [];

  for (const step of def.steps) {
    for (const field of step.fields) {
      fields.push({
        key: field.id,
        label: field.label,
      });
    }
  }

  return fields;
}

export async function ensureTemplatesExist(): Promise<{ converted: string[]; skipped: string[] }> {
  return await convertDocxTemplates();
}

type FieldPlacement = {
  key: string;
  label: string;
  page: number;
  x: number;
  y: number;
  size: number;
};

export async function ensureFieldMapsExist(): Promise<{ created: string[]; existing: string[] }> {
  const created: string[] = [];
  const existing: string[] = [];

  await fsp.mkdir(templatesRoot, { recursive: true });

  for (const formType of allowedFormTypes) {
    const def = getIntakeDefForFormType(formType);
    if (!def) continue; // Skip "unsure" and any without definitions

    const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);

    if (fs.existsSync(fieldsPath)) {
      existing.push(formType);
      continue;
    }

    const fields = listFields(def);
    const placements: FieldPlacement[] = fields.map((f) => ({
      key: f.key,
      label: f.label,
      page: 1,
      x: 0,
      y: 0,
      size: 10,
    }));

    await fsp.writeFile(fieldsPath, JSON.stringify({ fields: placements }, null, 2), "utf-8");
    created.push(formType);
  }

  return { created, existing };
}

export type TemplateMeta = {
  pageCount: number;
  pages: Array<{ width: number; height: number }>;
};

export async function getTemplateMeta(formType: FormType): Promise<TemplateMeta> {
  const templatePath = path.join(templatesRoot, `${formType}.template.pdf`);

  if (!fs.existsSync(templatePath)) {
    const err = new Error(`Template PDF missing at ${templatePath}`);
    (err as Error & { status?: number }).status = 404;
    throw err;
  }

  const bytes = await fsp.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const pageCount = pdfDoc.getPageCount();

  const pages: Array<{ width: number; height: number }> = [];
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    pages.push({ width, height });
  }

  return { pageCount, pages };
}

export async function ensurePreviewPng(formType: FormType, page: number): Promise<string> {
  const templatePath = path.join(templatesRoot, `${formType}.template.pdf`);
  const previewsDir = path.join(templatesRoot, "_previews");
  const previewPath = path.join(previewsDir, `${formType}-p${page}.png`);

  if (fs.existsSync(previewPath)) {
    return previewPath;
  }

  if (!fs.existsSync(templatePath)) {
    const err = new Error(`Template PDF missing at ${templatePath}`);
    (err as Error & { status?: number }).status = 404;
    throw err;
  }

  await fsp.mkdir(previewsDir, { recursive: true });

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      "pdftoppm",
      ["-f", String(page), "-l", String(page), "-png", "-scale-to-x", "1200", "-scale-to-y", "1200", templatePath, path.join(previewsDir, `${formType}-p${page}`)],
      {
        stdio: "ignore",
      },
    );

    proc.on("error", (error) => {
      const err = new Error("pdftoppm (Poppler) is required to create previews. Please install it or add it to PATH.");
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

  // pdftoppm generates files with -1, -2 suffixes, we want the first one
  const generatedPath = path.join(previewsDir, `${formType}-p${page}-1.png`);
  if (!fs.existsSync(generatedPath)) {
    const err = new Error("Preview generation failed. Expected png not found.");
    (err as Error & { status?: number }).status = 500;
    throw err;
  }

  await fsp.rename(generatedPath, previewPath);
  return previewPath;
}

