import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IntakeDef, FieldDef } from "./types";
import { evaluateShowIf } from "./logic";
import { useIntakeDraft } from "./useIntakeDraft";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { RadioField } from "./fields/RadioField";
import { CheckboxField } from "./fields/CheckboxField";
import { SelectField } from "./fields/SelectField";
import { DateField } from "./fields/DateField";
import { useToast } from "@/hooks/use-toast";
import { completeForm, type IntakePresentation } from "../api";
import { ensurePacketForCategory, getActivePacket, normalizeCategory } from "../session";

function formatValue(v: unknown): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function visibleFields(stepFields: FieldDef[], answers: Record<string, unknown>): FieldDef[] {
  return stepFields.filter((f) => evaluateShowIf(f.showIf, answers));
}

function validateStep(stepFields: FieldDef[], answers: Record<string, unknown>): Record<string, string> {
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formType = def.intakeType === "basic" ? "basic-intake" : def.intakeType;
  const normalizedCategory = normalizeCategory(
    def.intakeType === "basic" ? getActivePacket()?.category ?? "unsure" : def.intakeType,
  );
  const [packet] = useState(() => {
    const active = getActivePacket();
    if (def.intakeType === "basic") {
      return active ?? ensurePacketForCategory(normalizedCategory);
    }
    if (active && active.category === normalizedCategory) {
      return active;
    }
    return ensurePacketForCategory(normalizedCategory);
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const completeMutation = useMutation({
    mutationFn: (payload: {
      sessionId: string;
      packetId: string;
      formType: string;
      category: string;
      answers: Record<string, unknown>;
      presentation?: IntakePresentation;
    }) => completeForm(payload),
  });

  const steps = def.steps;
  const isReview = stepIndex === steps.length;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isCompleting = completeMutation.isPending;

  const allVisibleForReview = useMemo(() => {
    const rows: { label: string; value: unknown }[] = [];
    for (const s of steps) {
      for (const f of visibleFields(s.fields, answers)) {
        rows.push({ label: f.label, value: answers[f.id] });
      }
    }
    return rows;
  }, [answers, steps]);

  const setField = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const getFieldValue = (value: unknown, fieldType: string): string | boolean => {
    if (fieldType === "checkbox") {
      return value === true;
    }
    return typeof value === "string" ? value : "";
  };

  const renderTextField = (field: FieldDef, value: unknown, commonProps: { id: string; label: string; required?: boolean; error?: string }) => {
    const fieldType = field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text";
    return (
      <TextField
        {...commonProps}
        type={fieldType}
        value={getFieldValue(value, "text") as string}
        onChange={(v) => setField(field.id, v)}
        placeholder={field.placeholder}
      />
    );
  };

  const renderField = (field: FieldDef) => {
    const error = errors[field.id];
    const value = answers[field.id];

    const commonProps = {
      id: field.id,
      label: field.label,
      required: field.required,
      error,
    };

    switch (field.type) {
      case "textarea":
        return (
          <TextAreaField
            {...commonProps}
            value={getFieldValue(value, "text") as string}
            onChange={(v) => setField(field.id, v)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case "radio":
        if (!field.options) return null;
        return (
          <RadioField
            {...commonProps}
            value={getFieldValue(value, "text") as string}
            onChange={(v) => setField(field.id, v)}
            options={field.options}
          />
        );

      case "checkbox":
        return (
          <CheckboxField
            {...commonProps}
            value={getFieldValue(value, "checkbox") as boolean}
            onChange={(v) => setField(field.id, v)}
            description={field.helperText}
          />
        );

      case "select":
        if (!field.options) return null;
        return (
          <SelectField
            {...commonProps}
            value={getFieldValue(value, "text") as string}
            onChange={(v) => setField(field.id, v)}
            options={field.options}
            placeholder={field.placeholder || "Select…"}
          />
        );

      case "date":
        return (
          <DateField
            {...commonProps}
            value={getFieldValue(value, "text") as string}
            onChange={(v) => setField(field.id, v)}
          />
        );

      case "email":
      case "tel":
      case "text":
      default:
        return renderTextField(field, value, commonProps);
    }
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

  const onSubmit = async () => {
    setSubmitError(null);
    const packetContext = packet ?? ensurePacketForCategory(normalizedCategory);

    const payload = {
      intakeType: def.intakeType,
      title: def.title,
      submittedAt: new Date().toISOString(),
      answers,
      packetId: packetContext.packetId,
      sessionId: packetContext.sessionId,
    };

    // Build presentation from intake definition
    const presentation: IntakePresentation = {
      title: def.title,
      groups: def.steps.map((step) => ({
        title: step.title,
        fields: visibleFields(step.fields, answers).map((field) => ({
          id: field.id,
          label: field.label,
          value: answers[field.id],
        })),
      })),
    };

    try {
      await completeMutation.mutateAsync({
        sessionId: packetContext.sessionId,
        packetId: packetContext.packetId,
        formType,
        category: normalizedCategory,
        answers,
        presentation,
      });

      saveSubmission(payload);
      clearDraft();
      setSubmitted(true);
      queryClient.invalidateQueries({
        queryKey: ["client-intake", "completed", packetContext.sessionId, packetContext.packetId],
      });
      toast({
        title: "Form completed",
        description: "Your completed PDF is now available in Completed Forms.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save the completed form.";
      setSubmitError(message);
      toast({
        title: "Unable to complete form",
        description: message,
        variant: "destructive",
      });
    }
  };

  const getDocxName = () => {
    const docMap: Record<string, string> = {
      basic: "Intake Basic Information.docx",
      divorce: "Intake - Divorce.docx",
      adoption: "Intake - Adoption.docx",
      enforcement: "Intake - Enforcement.docx",
      mediation: "Intake - Mediation.docx",
      modification: "Intake - Modification.docx",
      "marital-agreement": "Intake - Marital Agreement.docx",
      "prenuptial-agreement": "Intake - Prenuptual Agreement.docx",
      "wills-trusts-estates": "Intake - Wills Trusts & Estates.docx",
    };

    return docMap[def.intakeType];
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
              We've saved your completed intake for this packet. You can review and download it from the Completed Forms card.
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
              const className = active
                ? "bg-primary text-primary-foreground"
                : done
                  ? "bg-muted text-foreground"
                  : "bg-muted/50 text-muted-foreground";
              return (
                <div
                  key={s.id}
                  className={`rounded-full px-3 py-1 text-sm ${className}`}
                >
                  {i + 1}. {s.title}
                </div>
              );
            })}
            <div
              className={`rounded-full px-3 py-1 text-sm ${
                isReview ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
              }`}
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
                {visibleFields(currentStep.fields, answers).map((field) => (
                  <div key={field.id}>
                    {renderField(field)}
                    {field.helperText && field.type !== "checkbox" && (
                      <p className="text-xs text-muted-foreground mt-1">{field.helperText}</p>
                    )}
                  </div>
                ))}
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

              {/* PDF Download Section */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Prefer pen and paper?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Click here to download and fill out our classic PDF form to bring with you after you schedule your consultation.
                    </p>
                    {getDocxName() && (
                      <a
                        href={`/documents/${getDocxName()}`}
                        download
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF Form
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Need to speak with someone directly?
                </p>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              {submitError && (
                <div className="mt-4 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStepIndex(steps.length - 1)}
                  disabled={isCompleting}
                >
                  Back
                </Button>
                <Button
                  onClick={onSubmit}
                  disabled={isCompleting}
                >
                  {isCompleting ? "Saving..." : "Submit"}
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
