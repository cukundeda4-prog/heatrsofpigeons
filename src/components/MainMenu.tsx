import { motion } from "framer-motion";
import { useGame } from "@/game/store";
import recruitImg from "@/assets/recruit.png";
import generalImg from "@/assets/general.png";
import ogImg from "@/assets/og-pigeon.png";

export function MainMenu() {
  const setScreen = useGame((s) => s.setScreen);

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
          <button disabled className="btn-military py-4 rounded-md text-base">
            Multiplayer — Coming Soon
          </button>
          <button
            onClick={() => alert("Settings panel — adjust theme & ideology in-game from the top bar.")}
            className="btn-military py-3 rounded-md text-sm"
          >
            Settings
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
