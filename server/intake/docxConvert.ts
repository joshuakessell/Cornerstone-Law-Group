import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { spawn } from "child_process";
import { templatesRoot } from "./indexStore";

const documentsDir = path.resolve(process.cwd(), "client", "public", "documents");

type TemplateSource = {
  formType: string;
  sourceFile: string;
};

const sources: TemplateSource[] = [
  { formType: "basic-intake", sourceFile: "Intake Basic Information.docx" },
  { formType: "divorce", sourceFile: "Intake - Divorce.docx" },
  { formType: "modification", sourceFile: "Intake - Modification.docx" },
  { formType: "enforcement", sourceFile: "Intake - Enforcement.docx" },
  { formType: "adoption", sourceFile: "Intake - Adoption.docx" },
  { formType: "mediation", sourceFile: "Intake - Mediation.docx" },
  { formType: "marital-agreement", sourceFile: "Intake - Marital Agreement.docx" },
  { formType: "prenuptial-agreement", sourceFile: "Intake - Prenuptual Agreement.docx" },
  { formType: "wills-trusts-estates", sourceFile: "Intake - Wills Trusts & Estates.docx" },
];

function httpError(message: string, status: number) {
  const err = new Error(message);
  (err as Error & { status?: number }).status = status;
  return err;
}

function runSoffice(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("soffice", args, { stdio: "ignore" });

    proc.on("error", (error) => {
      reject(
        httpError(
          "LibreOffice (soffice) is required to convert DOCX templates. Please install it or make sure it is on PATH.",
          500,
        ),
      );
    });

    proc.on("close", (code) => {
      if (code === 0) return resolve();
      reject(httpError(`soffice exited with code ${code}`, 500));
    });
  });
}

export async function convertDocxTemplates(): Promise<{ converted: string[]; skipped: string[] }> {
  await fsp.mkdir(templatesRoot, { recursive: true });

  const converted: string[] = [];
  const skipped: string[] = [];

  for (const src of sources) {
    const sourcePath = path.join(documentsDir, src.sourceFile);
    if (!fs.existsSync(sourcePath)) {
      skipped.push(src.formType);
      continue;
    }

    await runSoffice(["--headless", "--convert-to", "pdf", "--outdir", templatesRoot, sourcePath]);
    const generatedName = `${path.parse(src.sourceFile).name}.pdf`;
    const generatedPath = path.join(templatesRoot, generatedName);
    const targetPath = path.join(templatesRoot, `${src.formType}.template.pdf`);

    if (fs.existsSync(targetPath)) {
      await fsp.rm(targetPath);
    }

    await fsp.rename(generatedPath, targetPath);
    converted.push(targetPath);
  }

  return { converted, skipped };
}

