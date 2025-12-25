import { ShowIf } from "./types";

export function getValue(obj: Record<string, unknown>, key: string): unknown {
  return obj?.[key];
}

export function evaluateShowIf(
  showIf: ShowIf | undefined,
  answers: Record<string, unknown>
): boolean {
  if (!showIf) return true;

  if ("fieldId" in showIf && "equals" in showIf) {
    return getValue(answers, showIf.fieldId) === showIf.equals;
  }
  if ("fieldId" in showIf && "notEquals" in showIf) {
    return getValue(answers, showIf.fieldId) !== showIf.notEquals;
  }
  if ("all" in showIf) {
    return showIf.all.every((s) => evaluateShowIf(s, answers));
  }
  if ("any" in showIf) {
    return showIf.any.some((s) => evaluateShowIf(s, answers));
  }
  return true;
}


