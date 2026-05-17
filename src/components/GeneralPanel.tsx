import { useGame } from "@/game/store";
import { CANTONS } from "@/game/data";
import generalImg from "@/assets/general.png";
import { useState } from "react";

const GENERAL_POOL = [
  "Gen. Pero Golubović",
  "Maršal Krilo",
  "Adm. Sivko",
  "Gen. Branka Perić",
  "Brig. Tihomir Kljun",
  "Pukovnik Zrno",
];

export function GeneralPanel() {
  const { cantons, selectedCanton, assignGeneral } = useGame();
  const [open, setOpen] = useState(false);
  const selectable = selectedCanton && cantons[selectedCanton]?.owner === "player";
  const current = selectable ? cantons[selectedCanton!]?.general : null;

  return (
    <div className="relative panel rounded-lg p-2 flex items-center gap-3 max-w-2xl mx-auto pointer-events-auto">
      <img
        src={generalImg}
        alt="General"
        className="h-14 w-14 rounded-md object-cover border border-gold/50 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-widest text-gold/70">HIGH COMMAND</div>
        <div className="font-display text-sm truncate">
          {current ?? (selectable ? "No general assigned" : "Select your own canton")}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {selectable
            ? `${CANTONS.find((c) => c.id === selectedCanton)!.name} · +200 combat power`
            : "Generals boost combat & morale"}
        </div>
      </div>
      <button
        disabled={!selectable}
        onClick={() => setOpen((o) => !o)}
        className="btn-military text-xs px-3 py-2 rounded"
      >
        {open ? "Close" : "Assign"}
      </button>

      {open && selectable && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 panel rounded-md p-2 w-72 grid gap-1 z-40">
          {GENERAL_POOL.map((g) => (
            <button
              key={g}
              onClick={() => {
                assignGeneral(selectedCanton!, g);
                setOpen(false);
              }}
              className="text-left text-xs px-2 py-1.5 rounded hover:bg-gold/10 hover:text-gold"
            >
              ★ {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
