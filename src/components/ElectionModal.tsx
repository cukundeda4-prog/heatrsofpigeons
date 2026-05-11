import { useGame } from "@/game/store";
import presidentImg from "@/assets/president.jpg";
import { motion, AnimatePresence } from "framer-motion";

export function ElectionModal() {
  const { lastElection, dismissElection, gameOver, resetGame } = useGame();

  return (
    <AnimatePresence>
      {gameOver && (
        <motion.div
          key="gameover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="panel rounded-xl p-6 max-w-md w-full text-center space-y-4"
          >
            <div className="text-[10px] tracking-[0.4em] text-destructive">⚑ DEFEAT ⚑</div>
            <h2 className="font-display text-4xl text-gold">Game Over</h2>
            <img src={presidentImg} alt="" className="h-32 w-32 mx-auto rounded-full grayscale border-2 border-destructive object-cover" />
            <p className="text-sm text-muted-foreground">{gameOver.reason}</p>
            <button onClick={resetGame} className="btn-military py-3 px-8 rounded-md">
              Return to Menu
            </button>
          </motion.div>
        </motion.div>
      )}

      {!gameOver && lastElection && lastElection.won && (
        <motion.div
          key="election"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="panel rounded-xl p-6 max-w-md w-full text-center space-y-4"
          >
            <div className="text-[10px] tracking-[0.4em] text-gold">🗳 ELECTION RESULTS</div>
            <h2 className="font-display text-3xl text-foreground">RE-ELECTED</h2>
            <img src={presidentImg} alt="" className="h-32 w-32 mx-auto rounded-full border-2 border-gold object-cover" />
            <div className="flex justify-around text-sm">
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest">YOU</div>
                <div className="font-mono text-xl text-gold">{lastElection.approval}%</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest">RIVAL</div>
                <div className="font-mono text-xl text-muted-foreground">{lastElection.opponent}%</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              The flock has spoken. Another year of your reign begins.
            </p>
            <button onClick={dismissElection} className="btn-military py-2 px-6 rounded-md">
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
