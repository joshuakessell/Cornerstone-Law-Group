import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";

type AnchorReturnProps = {
  active: boolean;
  onReturn: () => void;
};

export function AnchorReturn({ active, onReturn }: AnchorReturnProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed bottom-24 right-4 z-50 lg:bottom-6"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
        >
          <button
            type="button"
            onClick={onReturn}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur hover:border-primary/40 hover:text-primary"
          >
            <ArrowUpLeft className="h-4 w-4" />
            Back to where you were
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
