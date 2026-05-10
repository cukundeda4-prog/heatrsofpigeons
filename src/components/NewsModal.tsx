import { useGame } from "@/game/store";
import { AnimatePresence, motion } from "framer-motion";

export function NewsModal() {
  const { unreadNews, dismissNews } = useGame();
  const item = unreadNews[unreadNews.length - 1];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="panel rounded-lg p-6 max-w-md w-full"
          >
            <div className="text-[10px] tracking-[0.3em] text-gold/70 mb-2">⚐ DISPATCH · TURN {item.turn}</div>
            <h3 className="font-display text-2xl text-foreground mb-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            <div className="mt-5 flex justify-end">
              <button onClick={() => dismissNews(item.id)} className="btn-military text-xs px-5 py-2 rounded">
                Acknowledge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
