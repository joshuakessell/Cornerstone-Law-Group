const env = import.meta.env;

const schedulerUrl =
  env.VITE_CLIO_SCHEDULER_URL ||
  env.NEXT_PUBLIC_CLIO_SCHEDULER_URL ||
  "TODO_CLIO_SCHEDULER_URL";

const portalUrl =
  env.VITE_CLIO_CLIENT_PORTAL_URL ||
  env.NEXT_PUBLIC_CLIO_CLIENT_PORTAL_URL ||
  "https://clients.clio.com/login";

const lawPayUrl =
  env.VITE_LAWPAY_URL ||
  env.NEXT_PUBLIC_LAWPAY_URL ||
  "TODO_LAWPAY_URL";

const intakeBase =
  env.VITE_CLIO_GROW_INTAKE_BASE_URL ||
  env.NEXT_PUBLIC_CLIO_GROW_INTAKE_BASE_URL ||
  "https://app.goclio.com/public";

export const SITE_CONFIG = {
  schedulerUrl,
  portalUrl,
  lawPayUrl,
  intakeUrls: {
    divorce: `${intakeBase}/divorce`,
    mediation: `${intakeBase}/mediation`,
    "modification-enforcement": `${intakeBase}/modification-enforcement`,
    "prenuptial-marital-agreements": `${intakeBase}/prenuptial-marital-agreements`,
    adoption: `${intakeBase}/adoption`,
    "wills-trusts-estates": `${intakeBase}/wills-trusts-estates`,
    general: `${intakeBase}/potential-client-basic`,
  } as Record<string, string>,
};

