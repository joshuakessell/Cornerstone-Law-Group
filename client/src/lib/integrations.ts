export type PracticeSlug =
  | "divorce"
  | "child-custody-parenting-plans"
  | "modification-enforcement"
  | "mediation"
  | "collaborative-law"
  | "prenuptial-marital-agreements"
  | "adoption"
  | "wills-trusts-estates"
  | "general";

export type IntegrationsConfig = {
  schedulerUrl: string | null;
  clientPortalUrl: string;
  lawpayUrl: string | null;
  growBaseUrl: string | null;
  growOverrides: Partial<Record<PracticeSlug, string>>;
  demoActive: boolean;
};

const env = import.meta.env;

const readEnv = (viteKey: keyof ImportMetaEnv, nextKey: keyof ImportMetaEnv) =>
  env[viteKey] ?? env[nextKey] ?? null;

const schedulerFromEnv = readEnv("VITE_CLIO_SCHEDULER_URL", "NEXT_PUBLIC_CLIO_SCHEDULER_URL");
const portalFromEnv = readEnv("VITE_CLIO_CLIENT_PORTAL_URL", "NEXT_PUBLIC_CLIO_CLIENT_PORTAL_URL");
const lawpayFromEnv = readEnv("VITE_LAWPAY_URL", "NEXT_PUBLIC_LAWPAY_URL");
const growBaseFromEnv = readEnv("VITE_CLIO_GROW_INTAKE_BASE_URL", "NEXT_PUBLIC_CLIO_GROW_INTAKE_BASE_URL");

const PRACTICE_ENV_KEYS: Record<PracticeSlug, { vite: keyof ImportMetaEnv; next: keyof ImportMetaEnv }> = {
  divorce: { vite: "VITE_CLIO_GROW_INTAKE_DIVORCE_URL", next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_DIVORCE_URL" },
  "child-custody-parenting-plans": {
    vite: "VITE_CLIO_GROW_INTAKE_CHILD_CUSTODY_PARENTING_PLANS_URL",
    next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_CHILD_CUSTODY_PARENTING_PLANS_URL",
  },
  "modification-enforcement": {
    vite: "VITE_CLIO_GROW_INTAKE_MODIFICATION_ENFORCEMENT_URL",
    next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_MODIFICATION_ENFORCEMENT_URL",
  },
  mediation: { vite: "VITE_CLIO_GROW_INTAKE_MEDIATION_URL", next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_MEDIATION_URL" },
  "collaborative-law": {
    vite: "VITE_CLIO_GROW_INTAKE_COLLABORATIVE_LAW_URL",
    next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_COLLABORATIVE_LAW_URL",
  },
  "prenuptial-marital-agreements": {
    vite: "VITE_CLIO_GROW_INTAKE_PRENUPTIAL_MARITAL_AGREEMENTS_URL",
    next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_PRENUPTIAL_MARITAL_AGREEMENTS_URL",
  },
  adoption: { vite: "VITE_CLIO_GROW_INTAKE_ADOPTION_URL", next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_ADOPTION_URL" },
  "wills-trusts-estates": {
    vite: "VITE_CLIO_GROW_INTAKE_WILLS_TRUSTS_ESTATES_URL",
    next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_WILLS_TRUSTS_ESTATES_URL",
  },
  general: { vite: "VITE_CLIO_GROW_INTAKE_GENERAL_URL", next: "NEXT_PUBLIC_CLIO_GROW_INTAKE_GENERAL_URL" },
};

const growOverrides = Object.entries(PRACTICE_ENV_KEYS).reduce<Partial<Record<PracticeSlug, string>>>(
  (acc, [slug, keys]) => {
    const value = readEnv(keys.vite, keys.next);
    if (value) acc[slug as PracticeSlug] = value;
    return acc;
  },
  {},
);

const schedulerUrl = schedulerFromEnv ?? (env.DEV ? "/demo/scheduler" : null);
const lawpayUrl = lawpayFromEnv ?? (env.DEV ? "/demo/pay" : null);
const growBaseUrl = growBaseFromEnv ?? (env.DEV ? "/demo/intake" : null);
const clientPortalUrl = portalFromEnv ?? "https://clients.clio.com/login";

const demoUrls = [
  schedulerUrl,
  lawpayUrl,
  growBaseUrl,
  ...Object.values(growOverrides),
].filter(Boolean) as string[];

const usedDemoFallback =
  (env.DEV && !schedulerFromEnv) || (env.DEV && !lawpayFromEnv) || (env.DEV && !growBaseFromEnv);

const demoActive = demoUrls.some((url) => isDemoUrl(url)) || usedDemoFallback;

export const integrationsConfig: IntegrationsConfig = {
  schedulerUrl,
  clientPortalUrl,
  lawpayUrl,
  growBaseUrl,
  growOverrides,
  demoActive,
};

export const isRelativeUrl = (url?: string | null): url is string =>
  Boolean(url && url.startsWith("/"));

export const isDemoUrl = (url?: string | null): boolean => Boolean(url && url.startsWith("/demo"));

export const resolveUrl = (url?: string | null): string | null => (url ? url : null);

export function getGrowIntakeUrl(practice: PracticeSlug): string | null {
  if (integrationsConfig.growOverrides[practice]) {
    return integrationsConfig.growOverrides[practice] ?? null;
  }
  if (integrationsConfig.growBaseUrl) {
    return integrationsConfig.growBaseUrl;
  }
  return null;
}

