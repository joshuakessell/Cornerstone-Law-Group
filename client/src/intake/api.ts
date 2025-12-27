import { apiRequest } from "@/lib/queryClient";
import { normalizeCategory } from "./session";

export type CompletedForm = {
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
  completedForms: CompletedForm[];
};

export async function fetchCompletedForms(sessionId: string, packetId: string): Promise<PacketIndex> {
  const res = await apiRequest(
    "GET",
    `/api/client-intake/sessions/${sessionId}/packets/${packetId}/completed`,
  );
  return res.json();
}

export type IntakePresentationGroup = {
  title: string;
  fields: Array<{ id: string; label: string; value: unknown }>;
};

export type IntakePresentation = {
  title: string;
  groups: IntakePresentationGroup[];
};

export async function completeForm(options: {
  sessionId: string;
  packetId: string;
  formType: string;
  category: string;
  answers: Record<string, unknown>;
  presentation?: IntakePresentation;
}): Promise<CompletedForm> {
  const res = await apiRequest(
    "POST",
    `/api/client-intake/packets/${options.packetId}/forms/${options.formType}/complete`,
    {
      sessionId: options.sessionId,
      category: normalizeCategory(options.category),
      answers: options.answers,
      presentation: options.presentation,
    },
  );

  const json = await res.json();
  return json.completedForm as CompletedForm;
}

export async function submitPacket(sessionId: string, packetId: string) {
  await apiRequest("POST", `/api/client-intake/sessions/${sessionId}/packets/${packetId}/submit`);
}

