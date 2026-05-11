import { useGame } from "@/game/store";
import { CANTONS, DIFFICULTIES, IDEOLOGIES, PIGEON_TYPES, RELIGIONS, PLAYER_COLORS } from "@/game/data";
import { motion } from "framer-motion";

export function SetupScreen() {
  const { setup, setSetup, startGame, setScreen } = useGame();

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 grain relative">
      <button
        onClick={() => setScreen("menu")}
        className="text-xs tracking-widest text-muted-foreground hover:text-gold mb-6"
      >
        ← BACK
      </button>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl text-gold mb-2"
      >
        Forge Your Flock
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-8">Configure the campaign before the first feather falls.</p>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
        {/* Leader Name */}
        <Field label="Leader Name">
          <input
            value={setup.leaderName}
            onChange={(e) => setSetup({ leaderName: e.target.value })}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:border-gold outline-none"
          />
        </Field>

        {/* Difficulty */}
        <Field label="Difficulty">
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <Chip key={d} active={setup.difficulty === d} onClick={() => setSetup({ difficulty: d })}>
                {d}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Pigeon Type */}
        <Field label="Pigeon Type">
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto scrollbar-thin pr-1">
            {PIGEON_TYPES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSetup({ pigeonType: p.id })}
                className={`text-left p-2 rounded-md border transition ${
                  setup.pigeonType === p.id
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/60 bg-card/50"
                }`}
              >
                <div className="font-display text-sm text-foreground">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.trait}</div>
              </button>
            ))}
          </div>
        </Field>

        {/* Starting Canton */}
        <Field label="Starting Canton">
          <select
            value={setup.startingCanton}
            onChange={(e) => setSetup({ startingCanton: e.target.value as any })}
            className="w-full bg-input border border-border rounded-md px-3 py-2 focus:border-gold outline-none"
          >
            {CANTONS.filter((c) => c.id !== "republika-srpska").map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.capital}
              </option>
            ))}
          </select>
        </Field>

        {/* Ideology */}
        <Field label="Ideology">
          <div className="flex gap-2 flex-wrap">
            {IDEOLOGIES.map((i) => (
              <Chip key={i} active={setup.ideology === i} onClick={() => setSetup({ ideology: i })}>
                {i}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Religion */}
        <Field label="Religion">
          <div className="flex gap-2 flex-wrap">
            {RELIGIONS.map((r) => (
              <Chip key={r} active={setup.religion === r} onClick={() => setSetup({ religion: r })}>
                {r}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Faction Color */}
        <Field label="Faction Color">
          <div className="flex gap-2 flex-wrap">
            {PLAYER_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSetup({ playerColor: c.value })}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition ${
                  setup.playerColor === c.value
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-gold/60"
                }`}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: c.value }} />
                {c.name}
              </button>
            ))}
          </div>
        </Field>

        {/* Theme */}
        <Field label="Theme">
          <div className="flex gap-2">
            <Chip active={setup.theme === "dark"} onClick={() => setSetup({ theme: "dark" })}>
              🌙 Dark
            </Chip>
            <Chip active={setup.theme === "light"} onClick={() => setSetup({ theme: "light" })}>
              ☀ Light
            </Chip>
          </div>
        </Field>
      </div>

      <div className="mt-10 max-w-5xl flex justify-end">
        <button onClick={startGame} className="btn-military py-4 px-10 rounded-md">
          ⚔ Begin Campaign
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="panel rounded-lg p-4">
      <div className="text-[11px] tracking-[0.25em] text-gold/80 mb-2 font-display">{label.toUpperCase()}</div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-border text-muted-foreground hover:border-gold/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
