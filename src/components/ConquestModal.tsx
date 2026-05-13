import { useGame } from "@/game/store";
import { CANTONS } from "@/game/data";
import { motion, AnimatePresence } from "framer-motion";

export function ConquestModal() {
  const { pendingConquest, annexCanton, puppetCanton, cantons } = useGame();

  return (
    <AnimatePresence>
      {pendingConquest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="panel rounded-xl p-6 max-w-md w-full space-y-4"
          >
            <div className="text-[10px] tracking-[0.4em] text-gold text-center">⚔ VICTORY</div>
            <h2 className="font-display text-3xl text-foreground text-center">
              {CANTONS.find((c) => c.id === pendingConquest.to)!.name}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              The defending forces have routed. Choose the fate of this canton.
            </p>

            <div className="grid gap-2">
              <button
                onClick={annexCanton}
                className="btn-military py-3 px-4 rounded text-left"
              >
                <div className="font-display text-gold text-sm">⚑ ANNEX — Direct Rule</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Absorb fully. Adopts your faction colour, ideology and pigeon. Loyalty 35%.
                </div>
              </button>
              <button
                onClick={puppetCanton}
                className="btn-military py-3 px-4 rounded text-left"
              >
                <div className="font-display text-gold text-sm">🎀 PUPPET STATE — Vassal</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Keeps its identity. Pays you 35% of its treasury as tribute every turn. Treasury today: {cantons[pendingConquest.to].treasury.toLocaleString()}¢
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
