export type Guide = {
  slug: string;
  title: string;
  hero: string;
  intro: string;
  toc: string[];
  body: string[];
  faq: { question: string; answer: string }[];
  officialResources?: { title: string; description: string; url: string }[];
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
      "We start by stabilizing: temporary orders, safe communication plans, and a clear picture of income and expenses. Temporary orders can address custody, child support, spousal support, and use of property while the divorce is pending. These orders provide structure and protection during what can be an uncertain time.",
      "Texas is a community property state—valuations and tracing matter. We outline what is considered community and what may be separate property. Community property includes assets acquired during the marriage, while separate property includes assets owned before marriage, inheritances, and gifts. Proper valuation and characterization of assets is crucial for a fair division.",
      "Parenting plans should reflect school, work, and the unique needs of your children. We favor flexible frameworks that age with your family. A well-crafted parenting plan addresses physical custody, visitation schedules, decision-making authority, and communication protocols. It should be specific enough to prevent disputes but flexible enough to adapt as children grow.",
      "Litigation is sometimes necessary. When it is, we set expectations for hearings, mediation requirements, and likely timelines. Texas requires mediation in most family law cases before trial. Understanding the process—from discovery to settlement conferences to trial—helps you prepare and make informed decisions at each stage.",
      "Financial considerations extend beyond property division. Spousal maintenance (alimony) may be available in limited circumstances, and child support calculations follow state guidelines. Understanding these obligations and how they're calculated helps you plan for your financial future post-divorce.",
    ],
    faq: [
      { question: "How long does a divorce take in Texas?", answer: "The cooling-off period is 60 days, but most cases take longer based on complexity, court calendars, and willingness to negotiate. Uncontested divorces may finalize shortly after the 60-day period, while contested cases can take 6-18 months or longer depending on the issues involved." },
      { question: "Will I have to sell the house?", answer: "Not always. We explore buyouts, offsets, and creative solutions that preserve stability where possible. Options include one spouse buying out the other's interest, offsetting the home's value against other assets, or maintaining joint ownership temporarily. The best solution depends on your financial situation and family needs." },
      { question: "What is the difference between fault and no-fault divorce?", answer: "Texas allows both fault and no-fault divorces. A no-fault divorce is based on 'insupportability' (irreconcilable differences) and doesn't require proving wrongdoing. Fault grounds include adultery, cruelty, abandonment, or felony conviction. Fault can affect property division and spousal support in some cases." },
      { question: "Do I need to be separated before filing for divorce?", answer: "No, Texas does not require a period of separation before filing for divorce. You can file while still living together, though many couples choose to separate for practical and emotional reasons during the divorce process." },
    ],
    officialResources: [
      {
        title: "Texas Family Code - Divorce",
        description: "Official Texas statutes governing divorce proceedings, property division, and spousal support.",
        url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm",
      },
      {
        title: "Texas Courts - Family Law Forms",
        description: "Official court forms for divorce, including petition, waiver, and final decree templates.",
        url: "https://www.txcourts.gov/self-help/forms/family-law-forms/",
      },
      {
        title: "State Bar of Texas - Family Law Section",
        description: "Resources and information from the State Bar of Texas Family Law Section.",
        url: "https://www.texasbar.com/AM/Template.cfm?Section=Family_Law",
      },
      {
        title: "Texas Attorney General - Child Support",
        description: "Official information about child support calculations, enforcement, and modification in Texas.",
        url: "https://www.texasattorneygeneral.gov/child-support",
      },
    ],
  },
  {
    slug: "child-custody-in-texas-guide",
    title: "Child Custody in Texas Guide",
    hero: "Child-first decision-making with practical tools for modern co-parenting.",
    intro:
      "Parenting plans are most successful when they reflect your child's rhythms and guardrails for respectful co-parenting.",
    toc: ["Best-interest factors", "Parenting time options", "Communication tools", "Modifications and enforcement"],
    body: [
      "Judges focus on the best interest of the child. We translate those factors into practical steps for your family. Texas courts consider factors such as the child's emotional and physical needs, each parent's ability to provide stability, the child's relationships with siblings and extended family, and any history of family violence or substance abuse. Understanding these factors helps you present your case effectively.",
      "Standard possession is a starting point, not a rule. We design schedules that fit work, school, and developmental needs. The Texas Standard Possession Order provides a default schedule, but courts can and do approve custom arrangements. These might include extended summer periods, holiday rotations, or schedules that accommodate shift work, travel, or special needs. The key is demonstrating that your proposed schedule serves the child's best interests.",
      "Clear communication plans (OurFamilyWizard, TalkingParents) reduce conflict and create a record when needed. These tools provide secure messaging, shared calendars, expense tracking, and document storage. They create an unalterable record that can be valuable if disputes arise. Many courts now require or strongly encourage the use of such tools in high-conflict cases.",
      "When circumstances shift, modifications can recalibrate. For denied possession or unpaid support, enforcement protects stability. A material and substantial change in circumstances—such as relocation, job changes, or changes in the child's needs—may justify modifying custody or visitation. Enforcement actions address violations of existing orders and can result in makeup time, monetary sanctions, or in extreme cases, changes to the custody arrangement.",
      "Decision-making authority (conservatorship) is separate from possession. Texas uses the terms 'managing conservator' and 'possessory conservator' rather than 'custody.' Parents can share joint managing conservatorship with different possession schedules, or one parent can be the sole managing conservator. Understanding these distinctions helps you advocate for the arrangement that best serves your child.",
    ],
    faq: [
      { question: "Can we customize the standard possession order?", answer: "Yes. Courts often approve custom plans when they are safe, specific, and clearly in the child's best interest. Custom plans should address pickup and drop-off times, holiday schedules, summer arrangements, and communication protocols. The more detailed and child-focused the plan, the more likely a court is to approve it." },
      { question: "What if the other parent won't follow the order?", answer: "Document issues and act early. We can file for enforcement and seek remedies including makeup time or contempt. Keep detailed records of missed visits, late pickups, or other violations. Enforcement actions should be filed promptly, as delays can weaken your case. Remedies can include makeup time, monetary sanctions, attorney's fees, and in severe cases, changes to the possession schedule." },
      { question: "How is child support calculated in Texas?", answer: "Texas uses a percentage-based formula tied to the obligor's net income and the number of children. The court considers factors like health insurance costs, childcare expenses, and extraordinary expenses. The Texas Attorney General's office provides online calculators, but final amounts are determined by the court based on all relevant factors." },
      { question: "Can grandparents or other relatives get visitation rights?", answer: "Yes, under certain circumstances. Texas law allows grandparents and other relatives to seek visitation if it's in the child's best interest and certain conditions are met, such as when the parents are divorced or one parent has been incarcerated. The court must find that denial of access would significantly impair the child's physical health or emotional well-being." },
    ],
    officialResources: [
      {
        title: "Texas Family Code - Conservatorship",
        description: "Official Texas statutes governing child custody, conservatorship, and possession orders.",
        url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.153.htm",
      },
      {
        title: "Texas Attorney General - Child Support",
        description: "Official child support guidelines, calculators, and enforcement information.",
        url: "https://www.texasattorneygeneral.gov/child-support",
      },
      {
        title: "Texas Courts - Family Law Forms",
        description: "Official court forms for custody modifications, enforcement, and parenting plans.",
        url: "https://www.txcourts.gov/self-help/forms/family-law-forms/",
      },
      {
        title: "Texas Department of Family and Protective Services",
        description: "Resources on child safety, abuse prevention, and family support services.",
        url: "https://www.dfps.texas.gov/",
      },
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
      "A material and substantial change is required for most modifications. We outline common scenarios that qualify. Texas law requires showing a material and substantial change in circumstances since the original order. Common qualifying changes include: significant income changes (increase or decrease), job loss or relocation, changes in the child's needs (health, education, or developmental), changes in the other parent's circumstances, or evidence that the current order is no longer in the child's best interest. The change must be significant enough to warrant modifying the order.",
      "Strong evidence wins: calendars, messages, financial proof, and witness statements organized for clarity. Documentation is crucial for both modifications and enforcement. Keep detailed records of missed visitations, late payments, violations of communication orders, or changes in circumstances. Financial evidence should include pay stubs, tax returns, bank statements, and documentation of expenses. Text messages, emails, and communication app records can provide valuable evidence. Witness statements from teachers, healthcare providers, or others who have observed relevant circumstances can strengthen your case.",
      "Enforcement tools include contempt, clarifications, and monetary remedies. We choose the right level of pressure. Contempt of court can result in fines, jail time, or both. However, courts often prefer less severe remedies first, such as monetary sanctions, makeup time for missed visitations, or clarification orders that make the original order more specific. Attorney's fees can also be awarded to the prevailing party in enforcement actions. The appropriate remedy depends on the severity and pattern of violations.",
      "We try to keep conflict contained—targeted negotiation and mediation can fix issues faster than court when safety allows. Before filing for enforcement or modification, consider whether the issue can be resolved through direct communication or mediation. Many disputes arise from misunderstandings or temporary circumstances that can be addressed without court intervention. However, if the other party is uncooperative or the violations are serious, prompt legal action may be necessary to protect your rights and your child's stability.",
      "Modifications can address custody, visitation, child support, or spousal support. Each type of modification has specific requirements. For example, child support modifications typically require showing a material and substantial change in circumstances or that three years have passed since the last order. Custody modifications require showing that the change is in the child's best interest. Understanding these requirements helps you assess whether modification is appropriate and what evidence you'll need.",
    ],
    faq: [
      { question: "Can I change custody if I relocate?", answer: "Relocation can justify a modification if it impacts the child's stability. We assess best-interest factors and propose workable solutions. If you're planning to move more than 50 miles away (or another significant distance), you may need to notify the other parent and potentially seek court approval. The court will consider factors like the reason for the move, the impact on the child's relationship with the other parent, and whether the move serves the child's best interests. Long-distance parenting plans can be crafted to maintain meaningful relationships with both parents." },
      { question: "How fast can enforcement move?", answer: "We can often file quickly with supporting evidence. Timelines depend on court dockets, but early action protects your position. Enforcement actions can typically be filed as soon as a violation occurs, though some violations may need to be documented over time to show a pattern. Once filed, the court will schedule a hearing, usually within 30-60 days depending on the court's docket. Emergency situations, such as denial of court-ordered visitation or threats to the child's safety, can sometimes be addressed more quickly through emergency motions." },
      { question: "What happens if I can't afford to pay child support?", answer: "If your income has decreased significantly, you may be able to modify your child support obligation. However, you should file for modification promptly rather than simply stopping payments, as unpaid support continues to accrue and can result in enforcement actions including wage garnishment, license suspension, or contempt of court. The court will review your current financial circumstances and may adjust the support amount if appropriate." },
      { question: "Can I modify a final divorce decree?", answer: "Yes, but modifications of property division in a final divorce decree are very limited. Generally, property division cannot be modified after the decree is final unless there was fraud, mistake, or the court retained jurisdiction. However, custody, visitation, and support orders can be modified based on changed circumstances. It's important to understand which aspects of your decree can and cannot be changed." },
    ],
    officialResources: [
      {
        title: "Texas Family Code - Modification",
        description: "Official Texas statutes governing modification of custody, support, and possession orders.",
        url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.156.htm",
      },
      {
        title: "Texas Family Code - Enforcement",
        description: "Official Texas statutes on enforcement of family law orders and contempt proceedings.",
        url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.157.htm",
      },
      {
        title: "Texas Courts - Family Law Forms",
        description: "Official court forms for modifications, enforcement motions, and related filings.",
        url: "https://www.txcourts.gov/self-help/forms/family-law-forms/",
      },
      {
        title: "Texas Attorney General - Child Support Enforcement",
        description: "Information about child support enforcement, including wage garnishment and license suspension.",
        url: "https://www.texasattorneygeneral.gov/child-support/enforcement",
      },
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

