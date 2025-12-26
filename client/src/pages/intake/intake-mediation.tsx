import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { mediationIntake } from "@/intake/definitions/mediation";

export default function IntakeMediation() {
  return <IntakeWizard def={mediationIntake} />;
}
