import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { readPacketIndex, uploadsRoot } from "./indexStore";

type Attachment = {
  filename: string;
  path: string;
};

const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"] as const;

function httpError(message: string, status: number) {
  const err = new Error(message);
  (err as Error & { status?: number }).status = status;
  return err;
}

function formatCategory(category: string) {
  if (!category) return "Unknown";
  const label = category.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function requireEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw httpError(
      `Missing SMTP configuration: ${missing.join(", ")}. Please set env vars and retry.`,
      400,
    );
  }

  return {
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
    from: process.env.SMTP_FROM as string,
  };
}

function assertFileExists(target: string) {
  if (!fs.existsSync(target)) {
    throw httpError(`Attachment missing on disk: ${target}`, 400);
  }
}

function attachmentFor(sessionId: string, packetId: string, formType: string, file: string): Attachment {
  const target = path.join(uploadsRoot, sessionId, packetId, formType, file);
  assertFileExists(target);
  return {
    filename: `${formType}-${file}`,
    path: target,
  };
}

export async function sendPacketEmail(options: {
  sessionId: string;
  packetId: string;
}): Promise<void> {
  const { sessionId, packetId } = options;
  const env = requireEnv();

  const index = await readPacketIndex(sessionId, packetId);
  if (!index) {
    throw httpError("No completed forms for this packet.", 400);
  }

  const basic = index.completedForms.find((f) => f.formType === "basic-intake");
  const categoryForm =
    index.completedForms.find((f) => f.formType !== "basic-intake" && f.formType === index.category) ||
    index.completedForms.find((f) => f.formType !== "basic-intake");

  if (!basic || !categoryForm) {
    throw httpError("Both Basic Intake and the category intake must be completed before submitting.", 400);
  }

  const transporter = nodemailer.createTransport({
    host: env.host,
    port: env.port,
    secure: env.port === 465,
    auth: {
      user: env.user,
      pass: env.pass,
    },
  });

  const attachments: Attachment[] = [
    attachmentFor(sessionId, packetId, "basic-intake", "filled.pdf"),
    attachmentFor(sessionId, packetId, categoryForm.formType, "filled.pdf"),
    attachmentFor(sessionId, packetId, "basic-intake", "answers.json"),
    attachmentFor(sessionId, packetId, categoryForm.formType, "answers.json"),
  ];

  await transporter.sendMail({
    from: env.from,
    to: "jckessell@gmail.com",
    subject: `TEST FORM - ${formatCategory(index.category)}`,
    text: `Attached are the completed forms for ${formatCategory(index.category)}.`,
    attachments,
  });
}

