import { useGame } from "@/game/store";
import { CANTONS, PIGEON_TYPES } from "@/game/data";
import recruitImg from "@/assets/recruit.png";
import { useState, useRef, useEffect } from "react";

export function CantonMap() {
  const { cantons, selectedCanton, selectCanton, mapMode, toggleMapMode, attack } = useGame();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [attackFrom, setAttackFrom] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-canton]")) return;
    setDragging(true);
    setStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const onPointerUp = () => setDragging(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.6, Math.min(3, z - e.deltaY * 0.002)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden bg-background select-none cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) 5%, transparent), transparent 70%)",
      }}
    >
      {/* Map mode + zoom controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={toggleMapMode}
          className="btn-military text-xs px-3 py-2 rounded-md"
          title="Toggle 2D/3D"
        >
          {mapMode === "3d" ? "🛰 3D" : "🗺 2D"}
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          className="btn-military text-xs px-3 py-2 rounded-md"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
          className="btn-military text-xs px-3 py-2 rounded-md"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="btn-military text-xs px-3 py-2 rounded-md"
        >
          ⊙
        </button>
      </div>

      {attackFrom && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 panel px-4 py-2 rounded-md text-xs">
          ⚔ Choose an enemy canton to attack from{" "}
          <span className="text-gold">{CANTONS.find((c) => c.id === attackFrom)?.name}</span>
          <button onClick={() => setAttackFrom(null)} className="ml-3 text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center map-transition ${
          mapMode === "3d" ? "map-3d" : "map-2d"
        }`}
        style={{ transform: undefined }}
      >
        <div
          style={{
            transform: `${mapMode === "3d" ? "perspective(1400px) rotateX(38deg)" : ""} translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.4s ease",
            transformOrigin: "center center",
          }}
        >
          <svg viewBox="0 0 850 770" className="w-[min(95vw,1100px)] h-auto drop-shadow-2xl">
            <defs>
              <filter id="terrain">
                <feTurbulence baseFrequency="0.6" numOctaves="2" />
                <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
              </filter>
              <radialGradient id="seaGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="oklch(0.3 0.04 230)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="850" height="770" fill="url(#seaGlow)" />

            {CANTONS.map((c) => {
              const state = cantons[c.id];
              const isSelected = selectedCanton === c.id;
              const isPlayer = state.owner === "player";
              return (
                <g key={c.id} data-canton={c.id}>
                  <path
                    d={c.path}
                    fill={c.color}
                    stroke={isPlayer ? "var(--gold)" : "rgba(0,0,0,0.55)"}
                    strokeWidth={isPlayer ? 3 : 1.2}
                    className={`cursor-pointer transition-all ${isSelected ? "glow-selected" : ""}`}
                    style={{ filter: "url(#terrain)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (attackFrom && attackFrom !== c.id && !isPlayer) {
                        attack(attackFrom as any, c.id);
                        setAttackFrom(null);
                      } else {
                        selectCanton(c.id);
                        if (isPlayer && c.id !== attackFrom) {
                          // long-press / right-click could trigger attack; provide button
                        }
                      }
                    }}
                  />
                  {isSelected && (
                    <path
                      d={c.path}
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth={2.5}
                      className="marching-ants pointer-events-none"
                    />
                  )}
                  <text
                    x={c.labelX}
                    y={c.labelY}
                    textAnchor="middle"
                    className="pointer-events-none font-display"
                    fontSize="11"
                    fill="rgba(0,0,0,0.75)"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {c.name.toUpperCase()}
                  </text>
                  <text
                    x={c.labelX}
                    y={c.labelY + 12}
                    textAnchor="middle"
                    className="pointer-events-none"
                    fontSize="9"
                    fill="rgba(0,0,0,0.6)"
                  >
                    ⚲ {c.capital}
                  </text>

                  {/* Recruit deployment marker */}
                  {state.units > 0 && (
                    <g transform={`translate(${c.labelX - 18}, ${c.labelY + 18})`} className="pointer-events-none">
                      <circle r="14" fill="var(--card)" stroke="var(--gold)" strokeWidth="1.5" />
                      <text textAnchor="middle" y="4" fontSize="10" fill="var(--gold)" fontWeight="700">
                        {state.units >= 1000 ? `${(state.units / 1000).toFixed(1)}k` : state.units}
                      </text>
                    </g>
                  )}

                  {/* Player flag */}
                  {isPlayer && (
                    <g transform={`translate(${c.labelX + 26}, ${c.labelY - 30})`} className="pointer-events-none">
                      <rect x="-1" y="0" width="2" height="22" fill="var(--gold)" />
                      <polygon points="1,0 18,4 1,8" fill="var(--gold)" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Player canton recruit-image legend */}
      <div className="absolute bottom-4 left-4 z-30 panel rounded-md p-2 flex items-center gap-2 text-xs">
        <img src={recruitImg} alt="" className="h-8 w-8 rounded object-cover" />
        <div className="text-muted-foreground">Drag map · Scroll to zoom</div>
        {selectedCanton && cantons[selectedCanton].owner === "player" && (
          <button
            onClick={() => setAttackFrom(selectedCanton)}
            className="ml-3 btn-military text-[11px] px-3 py-1.5 rounded"
          >
            ⚔ Attack from here
          </button>
        )}
      </div>
    </div>
  );
}

export function pigeonName(id: string) {
  return PIGEON_TYPES.find((p) => p.id === id)?.name ?? id;
}
