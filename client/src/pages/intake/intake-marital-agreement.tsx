import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { maritalAgreementIntake } from "@/intake/definitions/marital-agreement";

export default function IntakeMaritalAgreement() {
  return <IntakeWizard def={maritalAgreementIntake} />;
}
