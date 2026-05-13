import { useGame } from "@/game/store";
import { CANTONS, PIGEON_TYPES } from "@/game/data";
import recruitImg from "@/assets/recruit.png";
import { useState, useRef, useEffect } from "react";

export function CantonMap() {
  const { cantons, selectedCanton, selectCanton, mapMode, toggleMapMode, attack, setup } = useGame();
  const playerColor = setup.playerColor;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [attackFrom, setAttackFrom] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gesture = useRef<{ dist: number; zoom: number; pan: { x: number; y: number }; mid: { x: number; y: number } } | null>(null);
  const dragStart = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dx = pts[0].x - pts[1].x, dy = pts[0].y - pts[1].y;
      gesture.current = {
        dist: Math.hypot(dx, dy),
        zoom,
        pan,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      };
    } else if (pointers.current.size === 1 && !(e.target as HTMLElement).closest("[data-canton]")) {
      dragStart.current = { x: e.clientX, y: e.clientY, pan };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && gesture.current) {
      const pts = [...pointers.current.values()];
      const dx = pts[0].x - pts[1].x, dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const newZoom = Math.max(0.6, Math.min(4, (gesture.current.zoom * dist) / gesture.current.dist));
      setZoom(newZoom);
    } else if (pointers.current.size === 1 && dragStart.current) {
      setPan({ x: dragStart.current.pan.x + e.clientX - dragStart.current.x, y: dragStart.current.pan.y + e.clientY - dragStart.current.y });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.6, Math.min(4, z - e.deltaY * 0.002)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const playerIds = CANTONS.filter((c) => cantons[c.id].owner === "player").map((c) => c.id);
  const puppetIds = CANTONS.filter((c) => cantons[c.id].owner === "puppet-of-player").map((c) => c.id);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden bg-background select-none cursor-grab active:cursor-grabbing map-touch"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(e) => {
        // Click on empty background deselects (canton paths stopPropagation)
        if (!(e.target as HTMLElement).closest("[data-canton]")) {
          if (attackFrom) setAttackFrom(null);
          else selectCanton(null);
        }
      }}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) 8%, transparent), transparent 70%)",
      }}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        <button onClick={toggleMapMode} className="btn-military text-[10px] px-2.5 py-1.5 rounded">
          {mapMode === "3d" ? "🛰 3D" : "🗺 2D"}
        </button>
        <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} className="btn-military text-xs px-2.5 py-1.5 rounded">+</button>
        <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))} className="btn-military text-xs px-2.5 py-1.5 rounded">−</button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="btn-military text-xs px-2.5 py-1.5 rounded">⊙</button>
      </div>

      {attackFrom && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 panel px-3 py-1.5 rounded-md text-[11px] max-w-[90vw] text-center">
          ⚔ Choose target from <span className="text-gold">{CANTONS.find((c) => c.id === attackFrom)?.name}</span>
          <button onClick={() => setAttackFrom(null)} className="ml-2 text-muted-foreground hover:text-foreground">✕</button>
        </div>
      )}

      <div className={`absolute inset-0 flex items-center justify-center map-transition ${mapMode === "3d" ? "map-3d" : "map-2d"}`}>
        <div
          style={{
            transform: `${mapMode === "3d" ? "perspective(1400px) rotateX(38deg)" : ""} translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <svg viewBox="0 0 850 770" className="w-[min(96vw,1100px)] h-auto drop-shadow-2xl">
            <defs>
              <radialGradient id="seaGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="oklch(0.4 0.05 230)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="territoryGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="0" y="0" width="850" height="770" fill="url(#seaGlow)" />

            {/* Territory base */}
            {CANTONS.map((c) => {
              const state = cantons[c.id];
              const isPlayer = state.owner === "player";
              const isPuppet = state.owner === "puppet-of-player";
              const isSelected = selectedCanton === c.id;
              return (
                <path
                  key={c.id}
                  data-canton={c.id}
                  d={c.path}
                  fill={isPlayer ? playerColor : c.color}
                  fillOpacity={isPlayer ? 0.92 : isPuppet ? 0.78 : 0.85}
                  stroke="rgba(0,0,0,0.55)"
                  strokeWidth={0.8}
                  className={`cursor-pointer transition-all hover:brightness-110 ${isSelected ? "glow-selected" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (attackFrom && attackFrom !== c.id && !isPlayer && !isPuppet) {
                      attack(attackFrom as any, c.id);
                      setAttackFrom(null);
                    } else {
                      selectCanton(c.id);
                    }
                  }}
                />
              );
            })}

            {/* Player expansion outline — drawn above fills */}
            <g className="pointer-events-none" filter="url(#territoryGlow)">
              {playerIds.map((id) => {
                const c = CANTONS.find((x) => x.id === id)!;
                return (
                  <path key={`exp-${id}`} d={c.path} fill="none" stroke="var(--gold)" strokeWidth={3}
                    strokeLinejoin="round" className="expansion-outline" opacity={0.95} />
                );
              })}
              {puppetIds.map((id) => {
                const c = CANTONS.find((x) => x.id === id)!;
                return (
                  <path key={`pup-${id}`} d={c.path} fill="none" stroke={playerColor} strokeWidth={2.5}
                    strokeDasharray="6 4" strokeLinejoin="round" opacity={0.9} />
                );
              })}
            </g>

            {/* Selected animated outline */}
            {selectedCanton && (
              <path
                d={CANTONS.find((c) => c.id === selectedCanton)!.path}
                fill="none"
                stroke="var(--gold)"
                strokeWidth={2.5}
                className="marching-ants pointer-events-none"
              />
            )}

            {/* Labels + markers */}
            {CANTONS.map((c) => {
              const state = cantons[c.id];
              const isPlayer = state.owner === "player";
              return (
                <g key={`lbl-${c.id}`} className="pointer-events-none">
                  <text x={c.labelX} y={c.labelY} textAnchor="middle" fontSize="10" fontWeight="700"
                    fill="rgba(0,0,0,0.82)" style={{ letterSpacing: "0.05em", fontFamily: "var(--font-display)" }}>
                    {c.name.toUpperCase()}
                  </text>
                  <text x={c.labelX} y={c.labelY + 11} textAnchor="middle" fontSize="8.5" fill="rgba(0,0,0,0.6)">
                    ⚲ {c.capital}
                  </text>
                  {state.units > 0 && (
                    <g transform={`translate(${c.labelX - 20}, ${c.labelY + 22})`}>
                      <circle r="11" fill="var(--card)" stroke="var(--gold)" strokeWidth="1.4" />
                      <text textAnchor="middle" y="3.5" fontSize="9" fill="var(--gold)" fontWeight="700">
                        {state.units >= 1000 ? `${(state.units / 1000).toFixed(1)}k` : state.units}
                      </text>
                    </g>
                  )}
                  {isPlayer && (
                    <g transform={`translate(${c.labelX + 22}, ${c.labelY - 26})`}>
                      <rect x="-1" y="0" width="1.5" height="18" fill="var(--gold)" />
                      <polygon points="0.5,0 14,3.5 0.5,7" fill="var(--gold)" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend / attack action */}
      <div className="absolute bottom-3 left-3 z-30 panel rounded-md p-2 flex items-center gap-2 text-[11px] max-w-[calc(100%-1.5rem)]">
        <img src={recruitImg} alt="" className="h-7 w-7 rounded object-cover shrink-0" />
        <div className="text-muted-foreground hidden sm:block">Drag · pinch / scroll to zoom</div>
        {selectedCanton && cantons[selectedCanton].owner === "player" && (
          <button onClick={() => setAttackFrom(selectedCanton)} className="btn-military text-[10px] px-2.5 py-1 rounded ml-auto">
            ⚔ Attack
          </button>
        )}
      </div>
    </div>
  );
}

export function pigeonName(id: string) {
  return PIGEON_TYPES.find((p) => p.id === id)?.name ?? id;
}
