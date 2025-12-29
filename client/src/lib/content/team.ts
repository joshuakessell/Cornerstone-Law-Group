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
    title: "Managing Partner and Founder",
    photo: "/media/clintheadshot.jpg",
    shortBio:
      "15+ years guiding Dallas families through complex, high-stakes family law matters with optimism and strategic calm.",
    longBio:
      "Clint is Cornerstone Law Group, P.C.'s managing partner and founder of the firm. For over 15 years, Clint has been entrusted by clients from all walks of life to guide them through complex, highly emotional family disputes. Whether helping parents reach a fair outcome in a divorce and custody battle or aggressively protecting a Fortune 500 executive with global assets, Clint brings the same energy and compassion to each area of practice. Clint recognizes that family law clients are often facing some of the most difficult times of their lives. He has earned a secure reputation for being an optimistic advocate who truly understands how traumatic family disputes can be and that legal action only solves part of the problem. Clint strives to be a strong support, while minimizing conflict in every way possible. Clint prioritizes putting children's needs first, fostering cooperation between parents, and rebuilding the emotional and financial security of his clients so that they can move forward in the most advantageous way possible.",
    credentials: [
      "Best Lawyers in America© \"Lawyer of the Year\" in family law for Dallas/Fort Worth (2019 – 2021)",
      "Honoree, Texas Super Lawyers (2010 – 2021)",
      "Up-and-Coming 100: 2017 Texas Rising Stars",
      "Board Certified, Family Law by Texas Board of Legal Specialization",
    ],
    memberships: [
      "State Bar of Texas, Family Law Section and Collaborative Law Sections",
      "Texas Academy of Family Law Specialists – Member",
      "College of the State Bar of Texas – Member",
      "Annette Stewart Inn of Court – Emeritus Member",
      "Curt B. Henderson Inn of Court – Member, Former Committee Chair",
      "International Academy of Collaborative Professionals – Member",
      "Collaborative Law Institute of Texas – Member",
      "Collaborative Professionals of Dallas – Founding Member, Former Director",
      "Texas Board of Legal Specialization Taskforce – Appointed Member",
      "American Bar Association, Family Law Section",
      "Dallas Bar Association, Family Law Section",
      "Collin County Bar Association, Family Law Section",
      "Denton Bar Association, Family Law Section",
      "Rockwall County Bar Association, Family Law Section",
    ],
    education: [
      "Edwin L. Cox School of Business, Southern Methodist University, B.B.A., magna cum laude",
      "Dedman College of Econometric Studies, Southern Methodist University B.S., summa cum laude",
    ],
    admissions: ["State Bar of Texas"],
    focusAreas: [
      "Complex divorce & property division",
      "Child custody and parenting plans",
      "Collaborative law & mediation",
      "Modifications and enforcement",
      "Paternity suits",
      "Adoptions",
      "Grandparent interventions",
      "Premarital and marital agreements",
    ],
    testimonials: [
      "“Because of Clint, I am at peace.”",
      "“Out-of-the-box thinker… gifted with compassion and tenacity.”",
    ],
  },
  {
    slug: "sasha-a-brown",
    name: "Sasha A. Brown",
    title: "Litigation Support",
    photo: "/media/SashaABrown-Headshot-scaled.jpg",
    shortBio:
      "Lead litigation support specialist with over 18 years of experience in education, licensed specialist in school psychology (LSSP), and certified teacher.",
    longBio:
      "Sasha is Cornerstone Law Group, P.C.'s lead litigation support specialist. Ms. Brown has over 18 years of experience working in education, is a licensed specialist in school psychology (\"LSSP\"), and is also a certified teacher. Sasha earned her Bachelor of Arts in Psychology and teacher's certification from Southern Methodist University in 1998. After working as an elementary school teacher, Sasha attended graduate school at Texas Woman's University where she earned her degree as an LSSP in 2010. Ms. Brown's extensive experience working with children also includes those with special needs. Between 2007 and 2009, Ms. Brown helped to develop assessment and monitoring tools in collaboration with Texas Scottish Rite Hospital Research Department. The protocols and tools Ms. Brown worked to develop are published, known resources for assessing children with various learning differences. Sasha understands and values the importance of caring for clients and their families.",
    credentials: ["Licensed Specialist in School Psychology (LSSP)", "Certified Teacher"],
    memberships: [],
    education: [
      "Bachelor of Arts in Psychology, Southern Methodist University, 1998",
      "Teacher's Certification, Southern Methodist University, 1998",
      "LSSP, Texas Woman's University, 2010",
    ],
    admissions: [],
    focusAreas: [
      "Litigation support",
      "Child assessment and monitoring",
      "Special needs children",
      "Educational advocacy",
    ],
    testimonials: [],
  },
  {
    slug: "lesley-wilson",
    name: "Lesley Wilson",
    title: "PhD, Consultant",
    photo: "/media/LesleyWilsonPhD-Headshot-scaled.jpg",
    shortBio:
      "Consultant with extensive history of supporting those in stressful life situations, specializing in managing stress for parents and children in challenging circumstances.",
    longBio:
      "Lesley Wilson has an extensive history of supporting those who are in stressful life situations. Her research focus has been managing stress for parents and children in the most challenging circumstances. Now retired from an active practice serving parents and children, Lesley is a consultant for Cornerstone Family Law and its clients. Clients find Lesley to be accepting, caring, and of great help in managing their stress as they navigate life challenges. Whether legal services are required before a major life change such as adoption or marriage, or during even more challenging times such as family disputes, stress is inherent in all major changes. Managing that stress is essential so that children and adults can open the door to a changing life with strength and hope.",
    credentials: ["PhD"],
    memberships: [],
    education: [],
    admissions: [],
    focusAreas: [
      "Stress management for parents and children",
      "Family transition support",
      "Adoption support",
      "Marriage preparation",
    ],
    testimonials: [],
  },
  {
    slug: "tyra-miller",
    name: "Tyra Miller",
    title: "Board Certified Family Law Paralegal",
    photo: "/media/Tyra-Miller-Photographed-by-Cameron-Spooner-2-scaled.jpg",
    shortBio:
      "20+ years of family law experience with a calm, detail-forward approach that keeps clients grounded.",
    longBio:
      "Tyra has over 20 years of experience as a paralegal and is Board Certified in Family Law by the Texas Board of Legal Specialization. She earned her bachelor's degree from The University of North Texas in 1997. Tyra lives in Frisco with her husband and daughter and their two Pugs. Tyra loves assisting individuals and families. Including teaching and empowering children to become the best they can be. Guiding each person through what is, most likely, the most challenging time in their lives by arming them with the tools they need for success once their legal case is over. Change is difficult and when clients emerge from the valley they were in at the time our services were initiated, it's important for them to know that life continues, and that we have ensured that they feel confident navigating the new terrain they now face with optimism.",
    credentials: ["Board Certified Family Law Paralegal — Texas Board of Legal Specialization"],
    memberships: ["Texas Bar Paralegal Division"],
    education: ["Bachelor's degree, University of North Texas, 1997"],
    focusAreas: [
      "Client intake & onboarding",
      "Discovery and deadlines",
      "Hearing and mediation preparation",
      "Client empowerment and support",
    ],
    testimonials: ["“Tyra kept me steady and prepared at every step.”"],
  },
];






