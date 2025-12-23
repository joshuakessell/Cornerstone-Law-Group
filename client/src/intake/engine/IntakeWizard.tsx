import { useMemo, useState } from "react";
import { IntakeDef, FieldDef } from "./types";
import { evaluateShowIf } from "./logic";
import { useIntakeDraft } from "./useIntakeDraft";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function formatValue(v: any) {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function visibleFields(stepFields: FieldDef[], answers: Record<string, any>) {
  return stepFields.filter((f) => evaluateShowIf(f.showIf, answers));
}

function validateStep(stepFields: FieldDef[], answers: Record<string, any>) {
  const errors: Record<string, string> = {};
  const fields = visibleFields(stepFields, answers);

  for (const f of fields) {
    if (!f.required) continue;
    const v = answers[f.id];
    const empty =
      v === undefined || v === null || v === "" || (f.type === "checkbox" && v !== true);
    if (empty) errors[f.id] = "Required";
  }
  return errors;
}

export function IntakeWizard({ def }: { def: IntakeDef }) {
  const [, setLocation] = useLocation();
  const { answers, setAnswers, clearDraft, saveSubmission } = useIntakeDraft(def.intakeType);

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const steps = def.steps;
  const isReview = stepIndex === steps.length;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  const allVisibleForReview = useMemo(() => {
    const rows: { label: string; value: any }[] = [];
    for (const s of steps) {
      for (const f of visibleFields(s.fields, answers)) {
        rows.push({ label: f.label, value: answers[f.id] });
      }
    }
    return rows;
  }, [answers, steps]);

  const setField = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const onNext = () => {
    if (isReview) return;
    const e = validateStep(currentStep.fields, answers);
    setErrors(e);
    if (Object.keys(e).length === 0) setStepIndex((i) => i + 1);
  };

  const onBack = () => {
    if (submitted) return;
    setErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const onSubmit = () => {
    const payload = {
      intakeType: def.intakeType,
      title: def.title,
      submittedAt: new Date().toISOString(),
      answers,
    };

    console.log("INTAKE_SUBMISSION_POC:", payload);
    saveSubmission(payload);
    clearDraft();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Thank you. We received your information.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Proof-of-concept mode: your submission was saved locally in this browser and logged to the console.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setStepIndex(0);
                  setSubmitted(false);
                  setLocation("/client-intake");
                }}
              >
                Start over
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{def.title}</h1>
        {def.description && <p className="mt-2 text-muted-foreground">{def.description}</p>}
      </div>

      {/* Stepper */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const done = i < stepIndex;
              return (
                <div
                  key={s.id}
                  className={[
                    "rounded-full px-3 py-1 text-sm",
                    active ? "bg-primary text-primary-foreground" : done ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground",
                  ].join(" ")}
                >
                  {i + 1}. {s.title}
                </div>
              );
            })}
            <div
              className={[
                "rounded-full px-3 py-1 text-sm",
                isReview ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground",
              ].join(" ")}
            >
              Review
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {!isReview ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">{currentStep.title}</h2>
                {currentStep.description && <p className="mt-1 text-muted-foreground">{currentStep.description}</p>}
              </div>

              <div className="grid gap-5">
                {visibleFields(currentStep.fields, answers).map((f) => {
                  const err = errors[f.id];
                  const value = answers[f.id];

                  const commonLabel = (
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor={f.id}>
                        {f.label}{f.required ? " *" : ""}
                      </Label>
                      {err && <span className="text-xs text-destructive">{err}</span>}
                    </div>
                  );

                  if (f.type === "textarea") {
                    return (
                      <div key={f.id} className="grid gap-2">
                        {commonLabel}
                        <textarea
                          id={f.id}
                          className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder={f.placeholder}
                          value={value ?? ""}
                          onChange={(e) => setField(f.id, e.target.value)}
                        />
                        {f.helperText && <p className="text-xs text-muted-foreground">{f.helperText}</p>}
                      </div>
                    );
                  }

                  if (f.type === "radio" && f.options) {
                    return (
                      <div key={f.id} className="grid gap-2">
                        {commonLabel}
                        <div className="flex flex-col gap-2">
                          {f.options.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                              <input
                                type="radio"
                                name={f.id}
                                checked={value === opt.value}
                                onChange={() => setField(f.id, opt.value)}
                                className="cursor-pointer"
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                        {f.helperText && <p className="text-xs text-muted-foreground">{f.helperText}</p>}
                      </div>
                    );
                  }

                  if (f.type === "checkbox") {
                    return (
                      <div key={f.id} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor={f.id} className="font-medium cursor-pointer">
                            {f.label}{f.required ? " *" : ""}
                          </Label>
                          <input
                            id={f.id}
                            type="checkbox"
                            checked={value === true}
                            onChange={(e) => setField(f.id, e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                        {err && <span className="text-xs text-destructive">{err}</span>}
                        {f.helperText && <p className="text-xs text-muted-foreground">{f.helperText}</p>}
                      </div>
                    );
                  }

                  if (f.type === "select" && f.options) {
                    return (
                      <div key={f.id} className="grid gap-2">
                        {commonLabel}
                        <select
                          id={f.id}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={value ?? ""}
                          onChange={(e) => setField(f.id, e.target.value)}
                        >
                          <option value="">Select…</option>
                          {f.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {f.helperText && <p className="text-xs text-muted-foreground">{f.helperText}</p>}
                      </div>
                    );
                  }

                  // default input
                  const inputType =
                    f.type === "email" ? "email" :
                    f.type === "tel" ? "tel" :
                    f.type === "date" ? "date" :
                    "text";

                  return (
                    <div key={f.id} className="grid gap-2">
                      {commonLabel}
                      <Input
                        id={f.id}
                        type={inputType}
                        placeholder={f.placeholder}
                        value={value ?? ""}
                        onChange={(e) => setField(f.id, e.target.value)}
                      />
                      {f.helperText && <p className="text-xs text-muted-foreground">{f.helperText}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={stepIndex === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={onNext}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Review</h2>
                <p className="mt-1 text-muted-foreground">Confirm your details before submitting.</p>
              </div>

              <div className="grid gap-3">
                {allVisibleForReview.map((row, idx) => (
                  <div key={idx} className="rounded-lg border bg-muted/50 p-3">
                    <div className="text-xs font-medium text-muted-foreground">{row.label}</div>
                    <div className="mt-1 text-sm text-foreground">{formatValue(row.value)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStepIndex(steps.length - 1)}
                >
                  Back
                </Button>
                <Button
                  onClick={onSubmit}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-xs text-muted-foreground">
        Autosaved locally in this browser.
      </div>
    </div>
  );
}
