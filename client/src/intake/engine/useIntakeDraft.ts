import { useEffect, useMemo, useState } from "react";

const draftKey = (intakeType: string) => `cs_intake_draft_${intakeType}_v1`;
const submitsKey = () => `cs_intake_submissions_v1`;

export function useIntakeDraft(intakeType: string) {
  const key = useMemo(() => draftKey(intakeType), [intakeType]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnswers(parsed?.answers ?? {});
        setLastSavedAt(parsed?.lastSavedAt ?? null);
        setHasDraft(true);
      }
    } catch {}
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      const payload = { answers, lastSavedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      setLastSavedAt(payload.lastSavedAt);
      setHasDraft(true);
    } catch {}
  }, [answers, key, loaded]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setHasDraft(false);
    setLastSavedAt(null);
    setAnswers({});
  };

  const saveSubmission = (submission: any) => {
    try {
      const raw = localStorage.getItem(submitsKey());
      const existing = raw ? JSON.parse(raw) : [];
      const next = [submission, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(submitsKey(), JSON.stringify(next));
    } catch {}
  };

  return {
    answers,
    setAnswers,
    loaded,
    hasDraft,
    lastSavedAt,
    clearDraft,
    saveSubmission,
  };
}
