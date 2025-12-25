import { useEffect, useMemo, useState } from "react";

const draftKey = (intakeType: string) => `cs_intake_draft_${intakeType}_v1`;
const submitsKey = () => `cs_intake_submissions_v1`;

export function useIntakeDraft(intakeType: string) {
  const key = useMemo(() => draftKey(intakeType), [intakeType]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
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
    } catch (error) {
      console.error("Error loading draft:", error);
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      const payload = { answers, lastSavedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      setLastSavedAt(payload.lastSavedAt);
      setHasDraft(true);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, [answers, key, loaded]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
    setHasDraft(false);
    setLastSavedAt(null);
    setAnswers({});
  };

  const saveSubmission = (submission: unknown) => {
    try {
      const raw = localStorage.getItem(submitsKey());
      const existing = raw ? JSON.parse(raw) : [];
      const next = [submission, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(submitsKey(), JSON.stringify(next));
    } catch (error) {
      console.error("Error saving submission:", error);
    }
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
