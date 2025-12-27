import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";

export const uploadsRoot = path.resolve(process.cwd(), "server", "uploads");
export const templatesRoot = path.resolve(process.cwd(), "server", "templates");

export type CompletedFormEntry = {
  formType: string;
  category: string;
  completedAt: string;
  pageCount: number;
  pdfMode?: "template" | "summary";
  files: {
    pdf: string;
    answers: string;
    thumb: string | null;
  };
};

export type PacketIndex = {
  sessionId: string;
  packetId: string;
  category: string;
  createdAt: string;
  completedForms: CompletedFormEntry[];
};

const indexFileName = "index.json";

function packetDir(sessionId: string, packetId: string): string {
  return path.join(uploadsRoot, sessionId, packetId);
}

function indexPath(sessionId: string, packetId: string): string {
  return path.join(packetDir(sessionId, packetId), indexFileName);
}

export function fileUrls(sessionId: string, packetId: string, formType: string) {
  const base = `/uploads/${sessionId}/${packetId}/${formType}`;
  return {
    pdf: `${base}/filled.pdf`,
    answers: `${base}/answers.json`,
    thumb: `${base}/thumb.png` as string | null,
  };
}

export async function ensureUploadsRoot() {
  await fsp.mkdir(uploadsRoot, { recursive: true });
}

export async function readPacketIndex(sessionId: string, packetId: string): Promise<PacketIndex | null> {
  const target = indexPath(sessionId, packetId);
  if (!fs.existsSync(target)) return null;

  const raw = await fsp.readFile(target, "utf-8");
  return JSON.parse(raw) as PacketIndex;
}

export async function writePacketIndex(index: PacketIndex): Promise<void> {
  const targetDir = packetDir(index.sessionId, index.packetId);
  await fsp.mkdir(targetDir, { recursive: true });
  await fsp.writeFile(indexPath(index.sessionId, index.packetId), JSON.stringify(index, null, 2), "utf-8");
}

export async function upsertCompletedForm(options: {
  sessionId: string;
  packetId: string;
  category: string;
  formType: string;
  pageCount: number;
  pdfMode?: "template" | "summary";
  thumbUrl?: string | null;
}): Promise<PacketIndex> {
  const { sessionId, packetId, category, formType, pageCount, pdfMode, thumbUrl } = options;
  const now = new Date().toISOString();

  const existing = (await readPacketIndex(sessionId, packetId)) ?? {
    sessionId,
    packetId,
    category,
    createdAt: now,
    completedForms: [],
  };

  existing.category = category || existing.category;

  const urls = fileUrls(sessionId, packetId, formType);
  const entry = {
    formType,
    category: existing.category,
    completedAt: now,
    pageCount,
    pdfMode,
    files: {
      ...urls,
      thumb: thumbUrl !== undefined ? thumbUrl : urls.thumb,
    },
  };

  const idx = existing.completedForms.findIndex((f) => f.formType === formType);
  if (idx >= 0) {
    existing.completedForms[idx] = entry;
  } else {
    existing.completedForms.push(entry);
  }

  await writePacketIndex(existing);
  return existing;
}

