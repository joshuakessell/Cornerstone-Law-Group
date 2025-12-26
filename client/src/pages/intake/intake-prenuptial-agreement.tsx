import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { prenuptialAgreementIntake } from "@/intake/definitions/prenuptial-agreement";

export default function IntakePrenuptialAgreement() {
  return <IntakeWizard def={prenuptialAgreementIntake} />;
}
