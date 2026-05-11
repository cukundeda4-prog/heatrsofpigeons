import { useGame } from "@/game/store";
import { CANTONS } from "@/game/data";
import { pigeonName } from "./CantonMap";

export function StatsPanel() {
  const { selectedCanton, cantons, recruit, buyTanks, buyPlanes, buyArtillery, buyNuke, buyMedicine, buyFood, setOpstinaMilitary } = useGame();
  if (!selectedCanton) {
    return (
      <aside className="panel rounded-lg p-4 text-sm text-muted-foreground">
        Click any canton to inspect its flock.
      </aside>
    );
  }
  const def = CANTONS.find((c) => c.id === selectedCanton)!;
  const s = cantons[selectedCanton];
  const isPlayer = s.owner === "player";

  return (
    <aside className="panel rounded-lg p-4 space-y-3 text-sm overflow-y-auto scrollbar-thin">
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] tracking-widest text-gold/70">CANTON</div>
          <h3 className="font-display text-xl text-foreground leading-tight">{def.name}</h3>
          <div className="text-xs text-muted-foreground">⚲ {def.capital}</div>
        </div>
        <div
          className="h-6 w-6 rounded-sm border border-gold/60"
          style={{ background: def.color }}
          title="Faction colour"
        />
      </header>

      <div className="flex flex-wrap gap-1.5 text-[10px]">
        <Tag>{pigeonName(s.pigeonType)}</Tag>
        <Tag>{s.ideology}</Tag>
        <Tag>{s.religion}</Tag>
        <Tag tone={isPlayer ? "gold" : "muted"}>{isPlayer ? "YOUR REALM" : "RIVAL"}</Tag>
      </div>

      <Bar label="Population" value={Math.min(100, s.population / 5000)} display={s.population.toLocaleString()} />
      <Bar label="Hunger" value={s.hunger} tone={s.hunger < 30 ? "red" : undefined} />
      <Bar label="Health" value={s.health} />
      <Bar label="Loyalty" value={s.loyalty} tone={s.loyalty < 30 ? "red" : undefined} />
      <Stat label="Military" value={s.military.toLocaleString()} />
      <Stat label="Treasury" value={`${s.treasury.toLocaleString()} ¢`} />
      <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
        <Mini label="Tanks" v={s.tanks} />
        <Mini label="Planes" v={s.planes} />
        <Mini label="Artillery" v={s.artillery} />
        <Mini label="Nukes" v={s.nukes} />
      </div>

      {isPlayer && (
        <div className="pt-2 border-t border-border space-y-2">
          <div className="text-[10px] tracking-widest text-gold/70">RECRUIT & ARM</div>
          <div className="grid grid-cols-2 gap-1.5">
            <ActionBtn onClick={() => recruit(s.id, 500)}>+500 Recruits · 5k¢</ActionBtn>
            <ActionBtn onClick={() => recruit(s.id, 2000)}>+2000 · 20k¢</ActionBtn>
            <ActionBtn onClick={() => buyTanks(s.id, 1)}>🛡 Tank · 4k¢</ActionBtn>
            <ActionBtn onClick={() => buyArtillery(s.id, 1)}>💥 Artillery · 3k¢</ActionBtn>
            <ActionBtn onClick={() => buyPlanes(s.id, 1)}>✈ Plane · 8k¢</ActionBtn>
            <ActionBtn onClick={() => buyNuke(s.id)}>☢ Nuke · 50k¢</ActionBtn>
          </div>
        </div>
      )}
    </aside>
  );
}

function Bar({
  label,
  value,
  display,
  tone,
}: {
  label: string;
  value: number;
  display?: string;
  tone?: "red";
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="text-foreground">{display ?? `${Math.round(v)}%`}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${v}%`,
            background: tone === "red" ? "var(--destructive)" : "linear-gradient(90deg, var(--gold), oklch(0.85 0.18 80))",
          }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

function Mini({ label, v }: { label: string; v: number }) {
  return (
    <div className="panel rounded p-1.5">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-mono text-gold">{v}</div>
    </div>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone?: "gold" | "muted" }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded border ${
        tone === "gold" ? "border-gold/60 text-gold bg-gold/10" : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function ActionBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="btn-military text-[10px] py-1.5 px-2 rounded">
      {children}
    </button>
  );
}
