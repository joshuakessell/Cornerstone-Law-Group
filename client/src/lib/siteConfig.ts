import { getGrowIntakeUrl, integrationsConfig, type PracticeSlug } from "./integrations";

const practiceSlugs: PracticeSlug[] = [
  "divorce",
  "child-custody-parenting-plans",
  "modification-enforcement",
  "mediation",
  "collaborative-law",
  "prenuptial-marital-agreements",
  "adoption",
  "wills-trusts-estates",
  "general",
];

const intakeUrls = practiceSlugs.reduce<Record<PracticeSlug, string | null>>((acc, practice) => {
  acc[practice] = getGrowIntakeUrl(practice);
  return acc;
}, {} as Record<PracticeSlug, string | null>);

export const SITE_CONFIG = {
  schedulerUrl: integrationsConfig.schedulerUrl,
  portalUrl: integrationsConfig.clientPortalUrl,
  lawPayUrl: integrationsConfig.lawpayUrl,
  intakeUrls,
};

export { getGrowIntakeUrl, integrationsConfig };
export type { PracticeSlug };
