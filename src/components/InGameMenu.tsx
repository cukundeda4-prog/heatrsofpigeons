import { useGame } from "@/game/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InGameMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setup, setSetup, saveGame, loadGame, listSaves, deleteSave, resetGame } = useGame();
  const [tab, setTab] = useState<"main" | "save" | "load" | "settings">("main");
  const saves = listSaves();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="panel rounded-xl p-5 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-gold">⚙ Menu</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
            </div>

            <div className="flex gap-1 text-[11px]">
              {(["main", "save", "load", "settings"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 rounded border ${tab === t ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {tab === "main" && (
              <div className="space-y-2">
                <Btn onClick={() => setTab("save")}>💾 Save Game</Btn>
                <Btn onClick={() => setTab("load")}>📂 Load Game</Btn>
                <Btn onClick={() => setTab("settings")}>⚙ Settings</Btn>
                <Btn
                  onClick={() => {
                    if (confirm("Quit to main menu? Unsaved progress will be lost.")) {
                      resetGame();
                      onClose();
                    }
                  }}
                >
                  ⏏ Quit to Main Menu
                </Btn>
              </div>
            )}

            {tab === "save" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Save your campaign to a slot (overwrites).</p>
                {[1, 2, 3, 4, 5].map((slot) => {
                  const existing = saves.find((s) => s.slot === slot);
                  return (
                    <div key={slot} className="panel rounded p-2 flex items-center gap-2 text-xs">
                      <div className="flex-1">
                        <div className="text-foreground font-display">SLOT {slot}</div>
                        <div className="text-muted-foreground text-[10px]">
                          {existing
                            ? `Turn ${existing.turn} · ${existing.cantons} cantons · ${new Date(existing.savedAt).toLocaleString()}`
                            : "— empty —"}
                        </div>
                      </div>
                      <button onClick={() => saveGame(slot)} className="btn-military text-[10px] px-2 py-1 rounded">
                        Save
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "load" && (
              <div className="space-y-2">
                {saves.length === 0 && <p className="text-xs text-muted-foreground">No saved campaigns yet.</p>}
                {saves.map((s) => (
                  <div key={s.slot} className="panel rounded p-2 flex items-center gap-2 text-xs">
                    <div className="flex-1">
                      <div className="text-foreground font-display">SLOT {s.slot} — {s.name}</div>
                      <div className="text-muted-foreground text-[10px]">
                        Turn {s.turn} · {s.cantons} cantons · {new Date(s.savedAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        loadGame(s.slot);
                        onClose();
                      }}
                      className="btn-military text-[10px] px-2 py-1 rounded"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete save slot ${s.slot}?`)) deleteSave(s.slot);
                      }}
                      className="text-destructive text-xs px-1"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-3 text-xs">
                <div className="panel rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">🎵 Background Music</span>
                    <button
                      onClick={() => setSetup({ musicEnabled: !setup.musicEnabled })}
                      className={`px-3 py-1 rounded-full border text-[11px] ${
                        setup.musicEnabled ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"
                      }`}
                    >
                      {setup.musicEnabled ? "ON" : "OFF"}
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Volume</span>
                      <span>{Math.round(setup.musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={setup.musicVolume}
                      onChange={(e) => setSetup({ musicVolume: Number(e.target.value) })}
                      className="w-full accent-[var(--gold)]"
                    />
                  </div>
                </div>

                <div className="panel rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">🌓 Theme</span>
                    <div className="flex gap-1">
                      {(["dark", "light"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSetup({ theme: t })}
                          className={`px-3 py-1 rounded-full border text-[11px] ${
                            setup.theme === t ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"
                          }`}
                        >
                          {t === "dark" ? "🌙 Dark" : "☀ Light"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="btn-military w-full py-3 rounded-md text-sm">
      {children}
    </button>
  );
}
