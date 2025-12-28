export type Guide = {
  slug: string;
  title: string;
  hero: string;
  intro: string;
  toc: string[];
  body: string[];
  faq: { question: string; answer: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "divorce-in-texas-guide",
    title: "Divorce in Texas Guide",
    hero: "A calm roadmap from filing to final orders—what to expect and how to stay prepared.",
    intro:
      "This guide walks you through the divorce process in Texas with a focus on clarity, confidentiality, and protecting children and assets.",
    toc: ["Stabilizing early", "Property and support basics", "Kids and parenting plans", "When court becomes necessary"],
    body: [
      "We start by stabilizing: temporary orders, safe communication plans, and a clear picture of income and expenses.",
      "Texas is a community property state—valuations and tracing matter. We outline what is considered community and what may be separate property.",
      "Parenting plans should reflect school, work, and the unique needs of your children. We favor flexible frameworks that age with your family.",
      "Litigation is sometimes necessary. When it is, we set expectations for hearings, mediation requirements, and likely timelines.",
    ],
    faq: [
      { question: "How long does a divorce take in Texas?", answer: "The cooling-off period is 60 days, but most cases take longer based on complexity, court calendars, and willingness to negotiate." },
      { question: "Will I have to sell the house?", answer: "Not always. We explore buyouts, offsets, and creative solutions that preserve stability where possible." },
    ],
  },
  {
    slug: "child-custody-in-texas-guide",
    title: "Child Custody in Texas Guide",
    hero: "Child-first decision-making with practical tools for modern co-parenting.",
    intro:
      "Parenting plans are most successful when they reflect your child’s rhythms and guardrails for respectful co-parenting.",
    toc: ["Best-interest factors", "Parenting time options", "Communication tools", "Modifications and enforcement"],
    body: [
      "Judges focus on the best interest of the child. We translate those factors into practical steps for your family.",
      "Standard possession is a starting point, not a rule. We design schedules that fit work, school, and developmental needs.",
      "Clear communication plans (OurFamilyWizard, TalkingParents) reduce conflict and create a record when needed.",
      "When circumstances shift, modifications can recalibrate. For denied possession or unpaid support, enforcement protects stability.",
    ],
    faq: [
      { question: "Can we customize the standard possession order?", answer: "Yes. Courts often approve custom plans when they are safe, specific, and clearly in the child’s best interest." },
      { question: "What if the other parent won’t follow the order?", answer: "Document issues and act early. We can file for enforcement and seek remedies including makeup time or contempt." },
    ],
  },
  {
    slug: "modification-enforcement-guide",
    title: "Modification & Enforcement Guide",
    hero: "When life changes—or orders are ignored—there is a path to regain stability.",
    intro:
      "Orders should fit real life. We help adjust them when circumstances change and enforce them when compliance slips.",
    toc: ["Material change basics", "Evidence that matters", "Enforcement remedies", "Keeping conflict lower"],
    body: [
      "A material and substantial change is required for most modifications. We outline common scenarios that qualify.",
      "Strong evidence wins: calendars, messages, financial proof, and witness statements organized for clarity.",
      "Enforcement tools include contempt, clarifications, and monetary remedies. We choose the right level of pressure.",
      "We try to keep conflict contained—targeted negotiation and mediation can fix issues faster than court when safety allows.",
    ],
    faq: [
      { question: "Can I change custody if I relocate?", answer: "Relocation can justify a modification if it impacts the child’s stability. We assess best-interest factors and propose workable solutions." },
      { question: "How fast can enforcement move?", answer: "We can often file quickly with supporting evidence. Timelines depend on court dockets, but early action protects your position." },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Do you offer virtual consultations?",
    answer: "Yes. We offer secure video consultations and phone options for your convenience.",
  },
  {
    question: "Do you handle collaborative divorce?",
    answer: "Absolutely. We start with low-conflict pathways where appropriate and explain when litigation is the right fit.",
  },
  {
    question: "Will I work directly with an attorney?",
    answer: "Yes. You will have direct access to your attorney, with a dedicated paralegal to keep momentum and communication clear.",
  },
  {
    question: "Do you serve areas outside Dallas?",
    answer: "Yes. We regularly serve clients throughout Dallas–Fort Worth and nearby counties. See our service areas for details.",
  },
];

