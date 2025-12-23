import { IntakeDef } from "../engine/types";

export const divorceIntake: IntakeDef = {
  intakeType: "divorce",
  title: "Client Intake: Divorce",
  description: "A few questions to help us understand your divorce situation.",
  steps: [
    {
      id: "status",
      title: "Case Status",
      fields: [
        {
          id: "activeCase",
          label: "Do you already have an active case filed?",
          type: "radio",
          required: true,
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          id: "causeNumber",
          label: "Cause number (optional)",
          type: "text",
          showIf: { fieldId: "activeCase", equals: "yes" },
          placeholder: "If you have one",
        },
        {
          id: "children",
          label: "Are children involved?",
          type: "radio",
          required: true,
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
    },
    {
      id: "childrenDetails",
      title: "Children",
      fields: [
        {
          id: "childrenCount",
          label: "How many children?",
          type: "text",
          showIf: { fieldId: "children", equals: "yes" },
          placeholder: "e.g., 2",
        },
        {
          id: "custodyConcerns",
          label: "Any custody or visitation concerns?",
          type: "textarea",
          showIf: { fieldId: "children", equals: "yes" },
          placeholder: "Briefly describe concerns or goals.",
        },
      ],
    },
    {
      id: "collaborative",
      title: "Approach",
      fields: [
        {
          id: "collaborativeInterest",
          label: "Are you interested in a collaborative approach?",
          type: "radio",
          required: true,
          options: [
            { label: "Not sure", value: "unsure" },
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          id: "goals",
          label: "What outcomes matter most to you?",
          type: "textarea",
          required: true,
          placeholder: "Stability for children, fair property division, respectful process, etc.",
        },
      ],
    },
  ],
};
