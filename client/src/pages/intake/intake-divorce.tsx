import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { divorceIntake } from "@/intake/definitions/divorce";

export default function IntakeDivorce() {
  return <IntakeWizard def={divorceIntake} />;
}
