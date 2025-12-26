import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { enforcementIntake } from "@/intake/definitions/enforcement";

export default function IntakeEnforcement() {
  return <IntakeWizard def={enforcementIntake} />;
}
