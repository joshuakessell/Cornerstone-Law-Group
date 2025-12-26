export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "date";

export type ShowIf =
  | { fieldId: string; equals: string | boolean | number }
  | { fieldId: string; notEquals: string | boolean | number }
  | { all: ShowIf[] }
  | { any: ShowIf[] };

export type FieldOption = { label: string; value: string };

export type FieldDef = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: FieldOption[];
  showIf?: ShowIf;
};

export type StepDef = {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
};

export type IntakeDef = {
  intakeType: string;
  title: string;
  description?: string;
  steps: StepDef[];
};




