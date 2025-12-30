import { useLocation } from "wouter";
import { PreIntakeForm } from "@/components/intake/PreIntakeForm";
import NotFound from "@/pages/not-found";

const serviceLabels: Record<string, string> = {
  divorce: "Divorce",
  modification: "Modification",
  enforcement: "Enforcement",
  adoption: "Adoption",
  mediation: "Mediation",
  "marital-agreement": "Marital Agreement",
  "prenuptial-agreement": "Prenuptial Agreement",
  "wills-trusts-estates": "Wills/Trusts/Estates",
};

const validServiceTypes = new Set(Object.keys(serviceLabels));

export default function PreIntakePage() {
  const [location] = useLocation();
  const serviceType = location.split("/").pop() || "";

  if (!validServiceTypes.has(serviceType)) {
    return <NotFound />;
  }

  const serviceLabel = serviceLabels[serviceType] || serviceType;

  return <PreIntakeForm serviceType={serviceType as any} serviceLabel={serviceLabel} />;
}

