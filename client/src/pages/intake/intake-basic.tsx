import { IntakeWizard } from "@/intake/engine/IntakeWizard";
import { basicIntake } from "@/intake/definitions/basic";

export default function IntakeBasic() {
  return <IntakeWizard def={basicIntake} />;
}
