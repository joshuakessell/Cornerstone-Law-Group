import fs from "fs";
import path from "path";
import { templatesRoot } from "./indexStore";
import { fillPdfFromTemplate } from "./pdfFill";
import { generateSummaryPdf, type IntakePresentation } from "./pdfSummary";

export type BuildIntakePdfArgs = {
  formType: string;
  sessionId: string;
  packetId: string;
  category?: string;
  answers: Record<string, unknown>;
  presentation?: IntakePresentation;
};

export async function buildIntakePdf(
  args: BuildIntakePdfArgs,
): Promise<{ pdfBytes: Uint8Array; pageCount: number; mode: "template" | "summary" }> {
  const { formType, category, answers, presentation } = args;

  const mode = (process.env.INTAKE_PDF_MODE || "auto") as "auto" | "template" | "summary";

  if (mode === "template") {
    const templatePath = path.join(templatesRoot, `${formType}.template.pdf`);
    const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);

    if (!fs.existsSync(templatePath)) {
      const err = new Error(
        `Template mode requires ${formType}.template.pdf at ${templatePath}. File not found.`,
      );
      (err as Error & { status?: number }).status = 400;
      throw err;
    }

    if (!fs.existsSync(fieldsPath)) {
      const err = new Error(
        `Template mode requires ${formType}.fields.json at ${fieldsPath}. File not found.`,
      );
      (err as Error & { status?: number }).status = 400;
      throw err;
    }

    // Use template overlay
    const outputPath = path.join(process.cwd(), "server", "temp", `${formType}-${Date.now()}.pdf`);
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    const { pageCount } = await fillPdfFromTemplate({
      templatePath,
      fieldsPath,
      outputPath,
      answers,
    });

    const pdfBytes = await fs.promises.readFile(outputPath);
    await fs.promises.unlink(outputPath).catch(() => {
      // Ignore cleanup errors
    });

    return { pdfBytes, pageCount, mode: "template" };
  }

  if (mode === "summary") {
    // Always use summary
    const { pdfBytes, pageCount } = await generateSummaryPdf({
      formType,
      category,
      sessionId: args.sessionId,
      packetId: args.packetId,
      presentation,
      answers,
    });
    return { pdfBytes, pageCount, mode: "summary" };
  }

  // mode === "auto"
  const templatePath = path.join(templatesRoot, `${formType}.template.pdf`);
  const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);

  if (fs.existsSync(templatePath) && fs.existsSync(fieldsPath)) {
    // Use template overlay
    const outputPath = path.join(process.cwd(), "server", "temp", `${formType}-${Date.now()}.pdf`);
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    const { pageCount } = await fillPdfFromTemplate({
      templatePath,
      fieldsPath,
      outputPath,
      answers,
    });

    const pdfBytes = await fs.promises.readFile(outputPath);
    await fs.promises.unlink(outputPath).catch(() => {
      // Ignore cleanup errors
    });

    return { pdfBytes, pageCount, mode: "template" };
  }

  // Fall back to summary
  const { pdfBytes, pageCount } = await generateSummaryPdf({
    formType,
    category,
    sessionId: args.sessionId,
    packetId: args.packetId,
    presentation,
    answers,
  });
  return { pdfBytes, pageCount, mode: "summary" };
}

