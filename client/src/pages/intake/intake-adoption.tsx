import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { adoptionIntake } from "@/intake/definitions/adoption";

export default function IntakeAdoption() {
  return <IntakeWizard def={adoptionIntake} />;
}
