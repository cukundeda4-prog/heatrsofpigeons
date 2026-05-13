import { motion } from "framer-motion";
import { useGame } from "@/game/store";
import { useMusic } from "@/hooks/useMusic";
import { useState } from "react";
import recruitImg from "@/assets/recruit.png";
import generalImg from "@/assets/general.png";
import ogImg from "@/assets/og-pigeon.png";

export function MainMenu() {
  const { setScreen, listSaves, loadGame, deleteSave, setup, setSetup } = useGame();
  const [showLoad, setShowLoad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  useMusic();
  const saves = listSaves();

  return (
    <div className="relative min-h-screen overflow-hidden grain">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--gold) 25%, transparent), transparent 50%), radial-gradient(circle at 70% 80%, color-mix(in oklab, var(--blood) 30%, transparent), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating pigeon portraits */}
      <motion.img
        src={generalImg}
        alt=""
        aria-hidden
        className="hidden md:block absolute right-[-4%] top-[8%] w-[42%] max-w-[640px] opacity-90 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))" }}
      />
      <motion.img
        src={ogImg}
        alt=""
        aria-hidden
        className="hidden lg:block absolute left-[2%] bottom-[-4%] w-[28%] max-w-[380px] opacity-70 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-start justify-center px-6 md:px-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] text-gold/80 mb-3"
        >
          A TURN-BASED GRAND STRATEGY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-6xl md:text-8xl leading-[0.95] text-gold"
          style={{ textShadow: "0 0 30px color-mix(in oklab, var(--gold) 45%, transparent)" }}
        >
          Hearts of
          <br />
          <span className="italic">Pigeons</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 max-w-md text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          Rule a canton. Recruit your flock. Outwit the warlords of modern-day Bosnia
          in a turn-based saga of feathers, fervor, and steel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col gap-3 w-full max-w-sm"
        >
          <button onClick={() => setScreen("setup")} className="btn-military py-4 rounded-md text-base">
            ▶ Play (Single Player)
          </button>
          <button onClick={() => setShowLoad(true)} className="btn-military py-3 rounded-md text-sm">
            📂 Load Game {saves.length > 0 && <span className="text-gold/70">({saves.length})</span>}
          </button>
          <button disabled className="btn-military py-4 rounded-md text-base">
            Multiplayer — Coming Soon
          </button>
          <button onClick={() => setShowSettings(true)} className="btn-military py-3 rounded-md text-sm">
            ⚙ Settings
          </button>
          <button
            onClick={() => {
              if (confirm("Abandon the flock?")) window.close();
            }}
            className="btn-military py-3 rounded-md text-sm"
          >
            Exit
          </button>
        </motion.div>

        {showLoad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4" onClick={() => setShowLoad(false)}>
            <div onClick={(e) => e.stopPropagation()} className="panel rounded-xl p-5 max-w-md w-full space-y-3 max-h-[85vh] overflow-y-auto scrollbar-thin">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl text-gold">📂 Load Game</h2>
                <button onClick={() => setShowLoad(false)} className="text-muted-foreground">✕</button>
              </div>
              {saves.length === 0 && <p className="text-xs text-muted-foreground">No saved campaigns yet.</p>}
              {saves.map((s) => (
                <div key={s.slot} className="panel rounded p-2 flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <div className="text-foreground font-display">SLOT {s.slot} — {s.name}</div>
                    <div className="text-muted-foreground text-[10px]">Turn {s.turn} · {s.cantons} cantons · {new Date(s.savedAt).toLocaleString()}</div>
                  </div>
                  <button onClick={() => { loadGame(s.slot); setShowLoad(false); }} className="btn-military text-[10px] px-2 py-1 rounded">Load</button>
                  <button onClick={() => { if (confirm(`Delete save slot ${s.slot}?`)) { deleteSave(s.slot); setShowLoad(false); } }} className="text-destructive">🗑</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4" onClick={() => setShowSettings(false)}>
            <div onClick={(e) => e.stopPropagation()} className="panel rounded-xl p-5 max-w-md w-full space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl text-gold">⚙ Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-muted-foreground">✕</button>
              </div>
              <div className="panel rounded p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">🎵 Background Music</span>
                  <button
                    onClick={() => setSetup({ musicEnabled: !setup.musicEnabled })}
                    className={`px-3 py-1 rounded-full border text-[11px] ${setup.musicEnabled ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"}`}
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
                    type="range" min={0} max={1} step={0.05} value={setup.musicVolume}
                    onChange={(e) => setSetup({ musicVolume: Number(e.target.value) })}
                    className="w-full accent-[var(--gold)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center gap-3 text-xs text-muted-foreground">
          <img src={recruitImg} alt="" className="h-10 w-10 rounded-full object-cover border border-gold/40" />
          <div>
            <div className="text-gold/90 font-display tracking-widest">RECRUIT THE FLOCK</div>
            <div>500 recruits — 5,000 coins</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] tracking-widest text-muted-foreground/70">
        v0.1 — PIGEON CHAOS BUILD
      </div>
    </div>
  );
}
