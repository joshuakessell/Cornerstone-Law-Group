import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { willsTrustsEstatesIntake } from "@/intake/definitions/wills-trusts-estates";

export default function IntakeWillsTrustsEstates() {
  return <IntakeWizard def={willsTrustsEstatesIntake} />;
}
