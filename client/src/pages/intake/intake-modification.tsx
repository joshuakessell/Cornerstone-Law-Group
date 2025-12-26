import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { modificationIntake } from "@/intake/definitions/modification";

export default function IntakeModification() {
  return <IntakeWizard def={modificationIntake} />;
}
