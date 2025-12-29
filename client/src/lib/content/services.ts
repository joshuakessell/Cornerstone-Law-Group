export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  heroCopy: string;
  howWeHelp: string[];
  whatToExpect: { title: string; description: string }[];
  bullets: string[];
  faq: { question: string; answer: string }[];
  intakeKey:
    | "divorce"
    | "mediation"
    | "modification-enforcement"
    | "prenuptial-marital-agreements"
    | "adoption"
    | "wills-trusts-estates"
    | "general";
  seo: {
    title: string;
    description: string;
  };
};

export const SERVICES: Service[] = [
  {
    slug: "divorce",
    title: "Divorce",
    shortDescription:
      "Strategic, compassionate guidance through every phase of divorce—negotiation, collaborative, or litigation.",
    heroCopy:
      "Divorce changes everything. We protect your future with calm strategy, financial clarity, and child-centered solutions.",
    howWeHelp: [
      "High-asset and business-owner divorces with forensic clarity",
      "Temporary orders, possession schedules, and support strategy",
      "Collaborative divorce and mediation-first pathways",
      "Trial-ready litigation when settlement is not enough",
    ],
    whatToExpect: [
      { title: "Clarity Session", description: "We map goals, timelines, and immediate protections." },
      { title: "Stabilize", description: "Temporary orders, parenting schedules, and financial guardrails." },
      { title: "Resolution Path", description: "Collaborative, mediation, or courtroom strategy tailored to you." },
      { title: "Forward Plan", description: "Finalize orders and plan for enforcement and post-judgment needs." },
    ],
    bullets: [
      "Board Certified family law leadership with 15+ years of experience",
      "Transparent communication and predictable next steps",
      "Respectful advocacy that prioritizes dignity and stability",
    ],
    faq: [
      {
        question: "Do I have to go to court?",
        answer:
          "Not always. Many divorces resolve through collaborative law or mediation. We prepare for litigation while pursuing the least disruptive path first.",
      },
      {
        question: "How are complex assets handled?",
        answer:
          "We coordinate with valuation experts, CPAs, and financial advisors to map community versus separate property and design settlements that work long term.",
      },
    ],
    intakeKey: "divorce",
    seo: {
      title: "Divorce Attorney in Dallas | Cornerstone Law Group",
      description:
        "Dallas divorce attorneys providing strategic, child-focused representation. Collaborative options, mediation, and courtroom advocacy.",
    },
  },
  {
    slug: "child-custody-parenting-plans",
    title: "Child Custody & Parenting Plans",
    shortDescription:
      "Protecting your children with predictable schedules, safe boundaries, and plans that adapt as they grow.",
    heroCopy:
      "Children deserve stability. We build parenting plans that reduce conflict, honor safety, and keep kids at the center.",
    howWeHelp: [
      "Custom parenting plans and possession schedules",
      "Temporary orders to stabilize quickly",
      "Modifications when life changes",
      "Enforcement when orders are ignored",
    ],
    whatToExpect: [
      { title: "Listen & Assess", description: "We understand your children’s needs and co-parent dynamics." },
      { title: "Stabilize Safety", description: "Interim protections, communication guidelines, and boundaries." },
      { title: "Design the Plan", description: "Tailored parenting time, decision-making, and conflict tools." },
      { title: "Refine & Enforce", description: "Adjust through mediation or court; enforce when necessary." },
    ],
    bullets: [
      "Child-first philosophy backed by decades in family law",
      "Practical guidance on exchanges, travel, and communication tools",
      "Focus on reducing conflict while protecting safety",
    ],
    faq: [
      {
        question: "What if we disagree on schedules?",
        answer:
          "We start with negotiation and mediation, but we are prepared to advocate in court to secure a schedule that works for the children.",
      },
      {
        question: "Can orders change as kids grow?",
        answer:
          "Yes. When circumstances materially change, we can seek modifications to reflect children’s evolving needs.",
      },
    ],
    intakeKey: "general",
    seo: {
      title: "Dallas Child Custody Lawyer | Cornerstone Law Group",
      description:
        "Child-centered custody and parenting plans in Dallas. Clear schedules, conflict reduction, and enforcement when needed.",
    },
  },
  {
    slug: "modification-enforcement",
    title: "Modification & Enforcement",
    shortDescription:
      "When life shifts or orders are ignored, we move quickly to modify or enforce custody and support orders.",
    heroCopy:
      "Orders must fit real life. We secure modifications for changing needs and enforce orders when compliance breaks down.",
    howWeHelp: [
      "Support and custody modifications after material change",
      "Enforcement of possession, support, and property division",
      "Contempt and clarification actions when orders are vague",
      "Negotiated adjustments to avoid avoidable conflict",
    ],
    whatToExpect: [
      { title: "Assess Change", description: "We document the change in circumstances and urgency." },
      { title: "Choose Path", description: "Targeted negotiation, mediation, or swift enforcement filings." },
      { title: "Court-Ready", description: "Evidence, affidavits, and clear requests to the judge." },
      { title: "Stabilize", description: "Updated orders and guidance to keep compliance on track." },
    ],
    bullets: [
      "Fast action for missed support or denied possession",
      "Clear timelines and candid expectations",
      "Balanced approach: solve quickly, litigate when required",
    ],
    faq: [
      {
        question: "What counts as a material change?",
        answer:
          "Common examples include relocation, job loss, income changes, children’s evolving needs, or consistent denial of visitation.",
      },
      {
        question: "Can we avoid court?",
        answer:
          "Often. We attempt negotiated adjustments or mediation first, but we are ready to enforce through the court when necessary.",
      },
    ],
    intakeKey: "modification-enforcement",
    seo: {
      title: "Modify or Enforce Family Court Orders | Dallas",
      description:
        "Dallas family law team handling modifications and enforcement of custody and support. Fast action with pragmatic solutions.",
    },
  },
  {
    slug: "mediation",
    title: "Mediation",
    shortDescription:
      "Private, solution-focused mediation that keeps decisions with your family—not the courtroom.",
    heroCopy:
      "Mediation creates space to solve family issues with privacy and control. We facilitate balanced, future-ready agreements.",
    howWeHelp: [
      "Neutral or advocate roles based on your needs",
      "Pre-mediation coaching and goal setting",
      "Efficient document prep for enforceable agreements",
      "Child-focused frameworks to reduce tension",
    ],
    whatToExpect: [
      { title: "Preparation", description: "We align on priorities, deal breakers, and safety considerations." },
      { title: "Guided Sessions", description: "Structured negotiation that keeps momentum and respect." },
      { title: "Resolution Drafts", description: "Memorandum of understanding or mediated settlement agreements." },
      { title: "Finalize", description: "Court-ready documents and a plan for follow-through." },
    ],
    bullets: [
      "Confidential environment to solve quickly",
      "Lower conflict and lower cost than litigation",
      "Trauma-informed facilitation",
    ],
    faq: [
      {
        question: "Is mediation binding?",
        answer:
          "When you sign a mediated settlement agreement in Texas, it is usually binding. We ensure you understand every term before signing.",
      },
      {
        question: "What if mediation fails?",
        answer:
          "We pivot to the right forum—collaborative sessions, arbitration, or court—while preserving progress made.",
      },
    ],
    intakeKey: "mediation",
    seo: {
      title: "Family Law Mediation in Dallas | Cornerstone",
      description:
        "Private family law mediation that protects privacy and control. Structured sessions, clear agreements, and child-first outcomes.",
    },
  },
  {
    slug: "collaborative-law",
    title: "Collaborative Law",
    shortDescription:
      "A dignified, private path that keeps families out of court and focused on constructive outcomes.",
    heroCopy:
      "Collaborative law replaces court battles with team-based problem solving. We guide you through a calm, structured process.",
    howWeHelp: [
      "Assemble the right collaborative team (financial neutral, coach)",
      "Agenda-driven meetings with clear milestones",
      "Transparency frameworks that build trust",
      "Court filing only after final agreement",
    ],
    whatToExpect: [
      { title: "Participation Agreement", description: "All parties commit to resolve without courtroom litigation." },
      { title: "Team Alignment", description: "Select neutrals and set cadence for meetings." },
      { title: "Working Sessions", description: "Issue-by-issue resolution with real-time problem solving." },
      { title: "Finalize & File", description: "Draft final orders and file an uncontested case." },
    ],
    bullets: [
      "Privacy and control over timing",
      "Respects co-parenting relationships",
      "Cost predictability compared to contested litigation",
    ],
    faq: [
      {
        question: "What if collaboration breaks down?",
        answer:
          "If the process ends, both parties must retain new litigation counsel. We only recommend this path when it fits the family.",
      },
      {
        question: "Is it faster than court?",
        answer:
          "Often, yes. Meetings are scheduled based on your availability, avoiding crowded dockets and continuances.",
      },
    ],
    intakeKey: "mediation",
    seo: {
      title: "Collaborative Divorce Lawyers in Dallas",
      description:
        "Collaborative law for Texas families who want privacy, control, and lower conflict. Guided meetings and respectful advocacy.",
    },
  },
  {
    slug: "prenuptial-marital-agreements",
    title: "Prenuptial & Marital Agreements",
    shortDescription:
      "Transparent agreements that protect both partners and reduce future conflict before or during marriage.",
    heroCopy:
      "Clear agreements are an act of care. We craft prenups and postnups that protect assets, businesses, and expectations.",
    howWeHelp: [
      "Asset and business protection structures",
      "Spousal support frameworks and expectations",
      "Separate vs. community property mapping",
      "Plain-language drafting and review",
    ],
    whatToExpect: [
      { title: "Goals First", description: "We align on what each partner needs to feel secure." },
      { title: "Transparent Drafts", description: "Plain-language terms and balanced protections." },
      { title: "Review & Negotiate", description: "Collaborative edits to reach mutual agreement." },
      { title: "Finalize Properly", description: "Execution with required disclosures and timing." },
    ],
    bullets: [
      "Business-owner and blended-family experience",
      "Balanced, respectful tone that strengthens trust",
      "Future-focused planning for clarity and protection",
    ],
    faq: [
      {
        question: "When should we start?",
        answer:
          "Start early—well before the wedding—to allow thoughtful discussion and required disclosures without pressure.",
      },
      {
        question: "Are prenups enforceable?",
        answer:
          "With proper disclosures, fair terms, and correct execution, prenups are generally enforceable in Texas. We ensure the process is solid.",
      },
    ],
    intakeKey: "prenuptial-marital-agreements",
    seo: {
      title: "Dallas Prenuptial & Postnuptial Agreements",
      description:
        "Prenups and marital agreements crafted with balance and clarity. Protect assets, businesses, and expectations respectfully.",
    },
  },
  {
    slug: "adoption",
    title: "Adoption",
    shortDescription:
      "Stepparent, private, and agency adoptions handled with care, speed, and attention to detail.",
    heroCopy:
      "Growing your family should feel hopeful. We manage the legal steps so you can focus on the moments that matter.",
    howWeHelp: [
      "Stepparent and relative adoptions",
      "Termination and consent guidance",
      "Agency coordination and court filings",
      "Post-placement support and documentation",
    ],
    whatToExpect: [
      { title: "Path Mapping", description: "We outline your adoption type, timeline, and requirements." },
      { title: "Paperwork Simplified", description: "Consents, terminations, home study coordination when needed." },
      { title: "Court Day Prep", description: "Clear expectations and celebratory, low-stress hearing prep." },
      { title: "Aftercare", description: "Certified copies and guidance for records and future needs." },
    ],
    bullets: [
      "Warm, detail-oriented guidance for growing families",
      "Clear checklists to reduce stress",
      "Coordination with agencies and social workers",
    ],
    faq: [
      {
        question: "How long does adoption take?",
        answer:
          "Timelines vary by type. We will give you a realistic schedule upfront and keep you updated at every milestone.",
      },
      {
        question: "Do both biological parents have to consent?",
        answer:
          "Consent or termination is usually required. We assess your specific circumstances and handle the required filings.",
      },
    ],
    intakeKey: "adoption",
    seo: {
      title: "Adoption Attorney in Dallas | Stepparent & Private",
      description:
        "Compassionate adoption counsel in Dallas. Stepparent, private, and agency adoptions handled with care and speed.",
    },
  },
  {
    slug: "wills-trusts-estates",
    title: "Wills, Trusts & Estates",
    shortDescription:
      "Foundational estate plans that protect your family, clarify wishes, and coordinate with your financial team.",
    heroCopy:
      "Protect what you’ve built. We create straightforward wills and plans that reduce stress for the people you love.",
    howWeHelp: [
      "Core estate documents (wills, powers of attorney, directives)",
      "Guardianship planning for minor children",
      "Coordination with financial advisors and CPAs",
      "Updates aligned with life changes and family transitions",
    ],
    whatToExpect: [
      { title: "Discovery", description: "We inventory goals, assets, guardianship needs, and concerns." },
      { title: "Draft & Review", description: "Plain-language documents with clear instructions." },
      { title: "Execute Properly", description: "Signing ceremonies that meet Texas formalities." },
      { title: "Future Updates", description: "Checklists for when to revisit your plan." },
    ],
    bullets: [
      "Practical, plain-English documents",
      "Integrates with family law planning during divorce or adoption",
      "Options for expedited signings when needed",
    ],
    faq: [
      {
        question: "Do I need a trust?",
        answer:
          "Not everyone does. We recommend trusts when they provide real value for your situation—otherwise a well-drafted will may suffice.",
      },
      {
        question: "How often should I update my plan?",
        answer:
          "Major life changes—marriage, divorce, birth, relocation, or new assets—are good triggers to update your plan.",
      },
    ],
    intakeKey: "wills-trusts-estates",
    seo: {
      title: "Dallas Wills & Estate Planning | Cornerstone",
      description:
        "Estate planning for Dallas families. Wills, powers of attorney, and guardianship planning with clear guidance.",
    },
  },
];







