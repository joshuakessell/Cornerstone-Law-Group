export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  photo: string;
  shortBio: string;
  longBio: string;
  credentials: string[];
  memberships: string[];
  education: string[];
  admissions?: string[];
  focusAreas: string[];
  testimonials: string[];
};

export const TEAM: TeamMember[] = [
  {
    slug: "clint-c-brown",
    name: "Clint C. Brown",
    title: "Managing Partner / Founder",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "15+ years guiding Dallas families through complex, high-stakes family law matters with optimism and strategic calm.",
    longBio:
      "Clint leads Cornerstone Law Group, P.C. with a philosophy of constructive advocacy. He blends courtroom readiness with collaborative and mediation-first tactics to protect children, preserve resources, and keep clients informed at every step.",
    credentials: [
      "Board Certified, Family Law — Texas Board of Legal Specialization",
      "Best Lawyers in America© — Family Law (Dallas/Fort Worth)",
      "Texas Super Lawyers®",
    ],
    memberships: [
      "State Bar of Texas, Family Law Section",
      "Dallas Bar Association",
      "Collaborative Law Institute of Texas",
    ],
    education: [
      "B.B.A., Southern Methodist University, magna cum laude",
      "B.S., Econometrics, Southern Methodist University, summa cum laude",
    ],
    admissions: ["Texas"],
    focusAreas: [
      "Complex divorce & property division",
      "Child custody and parenting plans",
      "Collaborative law & mediation",
      "Modifications and enforcement",
    ],
    testimonials: [
      "“Because of Clint, I am at peace.”",
      "“Out-of-the-box thinker… gifted with compassion and tenacity.”",
    ],
  },
  {
    slug: "tyra-miller",
    name: "Tyra Miller",
    title: "Board Certified Family Law Paralegal",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80&sat=-100",
    shortBio:
      "20+ years of family law experience with a calm, detail-forward approach that keeps clients grounded.",
    longBio:
      "Tyra pairs deep procedural knowledge with a supportive client experience. She translates complex steps into clear checklists and ensures filings, deadlines, and communications stay on track.",
    credentials: ["Board Certified, Family Law Paralegal — TBLS"],
    memberships: ["Texas Bar Paralegal Division"],
    education: ["B.A., University of North Texas"],
    focusAreas: ["Client intake & onboarding", "Discovery and deadlines", "Hearing and mediation preparation"],
    testimonials: ["“Tyra kept me steady and prepared at every step.”"],
  },
];






