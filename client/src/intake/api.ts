import { apiRequest } from "@/lib/queryClient";
import { normalizeCategory } from "./session";

export type CompletedForm = {
  formType: string;
  category: string;
  completedAt: string;
  pageCount: number;
  files: {
    pdf: string;
    answers: string;
    thumb: string;
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

export async function completeForm(options: {
  sessionId: string;
  packetId: string;
  formType: string;
  category: string;
  answers: Record<string, unknown>;
}): Promise<CompletedForm> {
  const res = await apiRequest(
    "POST",
    `/api/client-intake/packets/${options.packetId}/forms/${options.formType}/complete`,
    {
      sessionId: options.sessionId,
      category: normalizeCategory(options.category),
      answers: options.answers,
    },
  );

  const json = await res.json();
  return json.completedForm as CompletedForm;
}

export async function submitPacket(sessionId: string, packetId: string) {
  await apiRequest("POST", `/api/client-intake/sessions/${sessionId}/packets/${packetId}/submit`);
}

