import { useGame } from "@/game/store";
import { CantonMap } from "./CantonMap";
import { StatsPanel } from "./StatsPanel";
import { GeneralPanel } from "./GeneralPanel";
import { NewsModal } from "./NewsModal";
import { ElectionModal } from "./ElectionModal";
import { ConquestModal } from "./ConquestModal";
import { InGameMenu } from "./InGameMenu";
import { useMusic } from "@/hooks/useMusic";
import { useEffect, useState } from "react";

export function GameScreen() {
  const { turn, cantons, endTurn, setup, news } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  useMusic();

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("light", setup.theme === "light");
  }, [setup.theme]);

  const playerCantons = Object.values(cantons).filter((c) => c.owner === "player");
  const totalTreasury = playerCantons.reduce((s, c) => s + c.treasury, 0);
  const totalMilitary = playerCantons.reduce((s, c) => s + c.military, 0);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Top bar */}
      <header className="panel rounded-none border-x-0 border-t-0 px-3 md:px-5 py-2 flex items-center gap-3 md:gap-6 text-xs">
        <div className="font-display text-gold tracking-widest text-sm md:text-base shrink-0">🕊 HEARTS OF PIGEONS</div>
        <div className="hidden md:flex gap-4 text-muted-foreground">
          <Stat label="Turn" value={`${turn}`} />
          <Stat label="Year" value={`${Math.floor((turn - 1) / 12) + 1} · Election in ${12 - ((turn - 1) % 12)}t`} />
          <Stat label="Cantons" value={`${playerCantons.length}/12`} />
          <Stat label="Treasury" value={`${totalTreasury.toLocaleString()}¢`} />
          <Stat label="Military" value={totalMilitary.toLocaleString()} />
          <Stat label="Difficulty" value={setup.difficulty} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={endTurn} className="btn-military text-xs px-4 py-2 rounded">
            ⏭ End Turn
          </button>
          <button
            onClick={() => {
              if (confirm("Return to main menu? Progress lost.")) resetGame();
            }}
            className="btn-military text-xs px-3 py-2 rounded"
          >
            ⏏
          </button>
        </div>
      </header>

      {/* Mobile stats strip */}
      <div className="md:hidden panel rounded-none border-x-0 px-3 py-1.5 flex gap-3 text-[10px] overflow-x-auto scrollbar-thin">
        <Stat label="Turn" value={`${turn}`} />
        <Stat label="Treasury" value={`${totalTreasury.toLocaleString()}¢`} />
        <Stat label="Military" value={totalMilitary.toLocaleString()} />
        <Stat label="Cantons" value={`${playerCantons.length}/12`} />
      </div>

      {/* Main */}
      <main className="flex-1 flex relative min-h-0">
        {/* Left panel */}
        <div className="hidden md:block w-80 p-3 overflow-y-auto scrollbar-thin shrink-0">
          <StatsPanel />
          {news.length > 0 && (
            <div className="mt-3 panel rounded-lg p-3">
              <div className="text-[10px] tracking-widest text-gold/70 mb-2">⚐ RECENT DISPATCHES</div>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {news.slice(0, 8).map((n) => (
                  <div key={n.id} className="text-[11px]">
                    <div className="text-foreground">{n.title}</div>
                    <div className="text-muted-foreground">{n.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative min-w-0">
          <CantonMap />
        </div>

        {/* Mobile bottom sheet stats */}
        <div className="md:hidden absolute top-2 left-2 right-2 max-h-[40vh] overflow-y-auto scrollbar-thin pointer-events-auto z-20">
          <StatsPanel />
        </div>
      </main>

      {/* Bottom general bar */}
      <footer className="px-3 pb-3 pt-1 pointer-events-none">
        <GeneralPanel />
      </footer>

      <NewsModal />
      <ElectionModal />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col leading-tight whitespace-nowrap">
      <span className="text-[9px] tracking-widest text-gold/60">{label.toUpperCase()}</span>
      <span className="text-foreground font-mono text-xs">{value}</span>
    </div>
  );
}
