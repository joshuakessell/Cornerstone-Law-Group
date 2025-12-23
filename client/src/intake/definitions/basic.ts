import { IntakeDef } from "../engine/types";

export const basicIntake: IntakeDef = {
  intakeType: "basic",
  title: "Client Intake: Basic Information",
  description: "Start here. This information helps us route your matter and follow up efficiently.",
  steps: [
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "fullName", label: "Full name", type: "text", required: true, placeholder: "Jane Doe" },
        { id: "email", label: "Email", type: "email", required: true, placeholder: "jane@example.com" },
        { id: "phone", label: "Phone number", type: "tel", required: true, placeholder: "(555) 555-5555" },
        {
          id: "preferredContact",
          label: "Preferred contact method",
          type: "radio",
          required: true,
          options: [
            { label: "Phone", value: "phone" },
            { label: "Email", value: "email" },
          ],
        },
      ],
    },
    {
      id: "address",
      title: "General Information",
      fields: [
        { id: "city", label: "City", type: "text", required: true, placeholder: "Dallas" },
        { id: "county", label: "County", type: "text", placeholder: "Dallas County" },
        { id: "bestTimeToReach", label: "Best time to reach you", type: "text", placeholder: "Weekdays after 5pm" },
      ],
    },
    {
      id: "notes",
      title: "What brings you in",
      fields: [
        {
          id: "summary",
          label: "Brief summary",
          type: "textarea",
          required: true,
          placeholder: "Tell us what's going on and what outcome you're hoping for.",
        },
        {
          id: "urgent",
          label: "Is there anything urgent or time-sensitive?",
          type: "radio",
          required: true,
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          id: "urgentDetails",
          label: "If yes, describe what's urgent",
          type: "textarea",
          showIf: { fieldId: "urgent", equals: "yes" },
          placeholder: "Upcoming court date, safety concern, deadlines, etc.",
        },
      ],
    },
  ],
};
