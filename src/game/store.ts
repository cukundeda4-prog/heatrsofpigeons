import { create } from "zustand";
import { CANTONS, CantonId, Difficulty, PIGEON_TYPES, NEWS_TEMPLATES, OPSTINAS, NEIGHBORS, DIFFICULTY_MULT } from "./data";

export interface Opstina {
  name: string;
  military: number;
}

export interface CantonState {
  id: CantonId;
  owner: string; // "player" | "ai-<id>" | "puppet-of-player"
  pigeonType: string;
  ideology: string;
  religion: string;
  population: number;
  hunger: number;
  health: number;
  loyalty: number;
  military: number;
  treasury: number;
  units: number;
  tanks: number;
  planes: number;
  artillery: number;
  nukes: number;
  general?: string;
  opstinas: Opstina[];
  puppet?: boolean; // tribute-paying state
}

export interface NewsItem {
  id: string;
  turn: number;
  title: string;
  body: string;
}

export interface PlayerSetup {
  pigeonType: string;
  startingCanton: CantonId;
  difficulty: Difficulty;
  ideology: string;
  religion: string;
  theme: "dark" | "light";
  leaderName: string;
  playerColor: string;
  musicEnabled: boolean;
  musicVolume: number;
}

export type Screen = "menu" | "setup" | "game";

export interface SaveSlot {
  slot: number;
  name: string;
  turn: number;
  cantons: number;
  savedAt: number;
}

interface GameStore {
  screen: Screen;
  setScreen: (s: Screen) => void;

  setup: PlayerSetup;
  setSetup: (patch: Partial<PlayerSetup>) => void;

  turn: number;
  cantons: Record<CantonId, CantonState>;
  selectedCanton: CantonId | null;
  selectCanton: (id: CantonId | null) => void;

  gameOver: null | { won: boolean; reason: string; approval?: number };
  lastElection: null | { turn: number; approval: number; opponent: number; won: boolean };
  dismissElection: () => void;
  dismissGameOver: () => void;

  pendingConquest: null | { from: CantonId; to: CantonId };
  annexCanton: () => void;
  puppetCanton: () => void;
  cancelConquest: () => void;

  news: NewsItem[];
  unreadNews: NewsItem[];
  pushNews: (title: string, body: string) => void;
  dismissNews: (id: string) => void;
  clearUnread: () => void;

  mapMode: "2d" | "3d";
  toggleMapMode: () => void;

  recruit: (cantonId: CantonId, amount: number) => void;
  buyTanks: (cantonId: CantonId, count: number) => void;
  buyPlanes: (cantonId: CantonId, count: number) => void;
  buyArtillery: (cantonId: CantonId, count: number) => void;
  buyNuke: (cantonId: CantonId) => void;
  buyMedicine: (cantonId: CantonId) => void;
  buyFood: (cantonId: CantonId) => void;
  assignGeneral: (cantonId: CantonId, name: string) => void;

  attack: (from: CantonId, to: CantonId) => void;

  endTurn: () => void;
  startGame: () => void;
  resetGame: () => void;

  saveGame: (slot: number) => void;
  loadGame: (slot: number) => void;
  listSaves: () => SaveSlot[];
  deleteSave: (slot: number) => void;
}

const PIGEON_IDS = PIGEON_TYPES.map((p) => p.id);
const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function buildInitialCantons(setup: PlayerSetup): Record<CantonId, CantonState> {
  const result = {} as Record<CantonId, CantonState>;
  const mult = DIFFICULTY_MULT[setup.difficulty];
  for (const c of CANTONS) {
    const isPlayer = c.id === setup.startingCanton;
    const isSarajevo = c.id === "sarajevo";
    const baseMil = rand(200, 1200);
    result[c.id] = {
      id: c.id,
      owner: isPlayer ? "player" : `ai-${c.id}`,
      pigeonType: isPlayer ? setup.pigeonType : isSarajevo ? "white-og" : pick(PIGEON_IDS),
      ideology: isPlayer ? setup.ideology : pick(["Democracy", "Authoritarianism", "Theocracy", "Anarchism"]),
      religion: isPlayer ? setup.religion : pick(["Pigeonism", "The Sky Church", "Old Feathers"]),
      population: rand(80, 400) * 1000,
      hunger: rand(45, 85),
      health: rand(50, 90),
      loyalty: isPlayer ? 80 : rand(40, 75),
      military: isPlayer ? baseMil : Math.floor(baseMil * mult.aiPower),
      treasury: isPlayer ? 12000 : rand(2000, 9000),
      units: 0,
      tanks: 0,
      planes: 0,
      artillery: isPlayer ? 0 : Math.random() < mult.aiAggression ? rand(0, 3) : 0,
      nukes: 0,
      opstinas: (OPSTINAS[c.id] ?? []).map((name) => ({ name, military: 0 })),
    };
    const op = result[c.id].opstinas;
    if (op.length) {
      const per = Math.floor(result[c.id].military / op.length);
      op.forEach((o) => (o.military = per));
    }
  }
  return result;
}

const initialSetup: PlayerSetup = {
  pigeonType: "rock",
  startingCanton: "sarajevo",
  difficulty: "Normal",
  ideology: "Democracy",
  religion: "Pigeonism",
  theme: "dark",
  leaderName: "Generalisimo Pero",
  playerColor: "oklch(0.68 0.18 145)",
  musicEnabled: true,
  musicVolume: 0.35,
};

const SAVE_PREFIX = "hop-save-";
const SAVE_INDEX_KEY = "hop-save-index";

function powerOf(c: CantonState) {
  return c.military + c.tanks * 50 + c.planes * 120 + c.artillery * 40 + (c.general ? 200 : 0) + c.nukes * 5000;
}
function isPlayerSide(owner: string) {
  return owner === "player" || owner === "puppet-of-player";
}

function distributeMil(c: CantonState, total: number): CantonState {
  const newMil = Math.max(50, Math.floor(total));
  const opCount = c.opstinas.length || 1;
  const per = Math.floor(newMil / opCount);
  return { ...c, military: newMil, opstinas: c.opstinas.map((o) => ({ ...o, military: per })) };
}

export const useGame = create<GameStore>((set, get) => ({
  screen: "menu",
  setScreen: (s) => set({ screen: s }),

  setup: initialSetup,
  setSetup: (patch) => set((st) => ({ setup: { ...st.setup, ...patch } })),

  turn: 1,
  cantons: buildInitialCantons(initialSetup),
  selectedCanton: null,
  selectCanton: (id) => set({ selectedCanton: id }),

  gameOver: null,
  lastElection: null,
  dismissElection: () => set({ lastElection: null }),
  dismissGameOver: () => set({ gameOver: null }),

  pendingConquest: null,
  cancelConquest: () => set({ pendingConquest: null }),
  annexCanton: () => {
    const st = get();
    if (!st.pendingConquest) return;
    const { to } = st.pendingConquest;
    const d = st.cantons[to];
    const updated: CantonState = {
      ...distributeMil(d, Math.max(100, Math.floor(d.military * 0.3))),
      owner: "player",
      puppet: false,
      loyalty: 35,
      pigeonType: st.setup.pigeonType,
      ideology: st.setup.ideology,
      religion: st.setup.religion,
    };
    set({
      cantons: { ...st.cantons, [to]: updated },
      pendingConquest: null,
    });
    get().pushNews("⚑ Annexed", `${CANTONS.find((x) => x.id === to)!.name} has been annexed into your realm.`);
    const all = Object.values(get().cantons);
    if (all.every((c) => isPlayerSide(c.owner))) {
      set({ gameOver: { won: true, reason: "All of Bosnia flies your banner. Total dominion achieved." } });
    }
  },
  puppetCanton: () => {
    const st = get();
    if (!st.pendingConquest) return;
    const { to } = st.pendingConquest;
    const d = st.cantons[to];
    const updated: CantonState = {
      ...d,
      owner: "puppet-of-player",
      puppet: true,
      loyalty: 50,
    };
    set({
      cantons: { ...st.cantons, [to]: updated },
      pendingConquest: null,
    });
    get().pushNews("🎀 Puppet State", `${CANTONS.find((x) => x.id === to)!.name} bows as a puppet — tribute begins next turn.`);
    const all = Object.values(get().cantons);
    if (all.every((c) => isPlayerSide(c.owner))) {
      set({ gameOver: { won: true, reason: "All of Bosnia flies your banner — direct or vassalized. Total dominion achieved." } });
    }
  },

  news: [],
  unreadNews: [],
  pushNews: (title, body) =>
    set((st) => {
      const item: NewsItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        turn: st.turn,
        title,
        body,
      };
      return { news: [item, ...st.news].slice(0, 50), unreadNews: [item, ...st.unreadNews] };
    }),
  dismissNews: (id) => set((st) => ({ unreadNews: st.unreadNews.filter((n) => n.id !== id) })),
  clearUnread: () => set({ unreadNews: [] }),

  mapMode: "3d",
  toggleMapMode: () => set((st) => ({ mapMode: st.mapMode === "3d" ? "2d" : "3d" })),

  recruit: (cantonId, amount) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = (amount / 500) * 5000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, military: c.military + amount, units: c.units + amount } } };
    }),
  buyTanks: (cantonId, count) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = count * 4000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, tanks: c.tanks + count } } };
    }),
  buyPlanes: (cantonId, count) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = count * 8000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, planes: c.planes + count } } };
    }),
  buyArtillery: (cantonId, count) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = count * 3000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, artillery: c.artillery + count } } };
    }),
  buyNuke: (cantonId) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = 50000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, nukes: c.nukes + 1 } } };
    }),
  buyMedicine: (cantonId) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = 3000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, health: Math.min(100, c.health + 15) } } };
    }),
  buyFood: (cantonId) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = 2500;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, hunger: Math.min(100, c.hunger + 20), loyalty: Math.min(100, c.loyalty + 3) } } };
    }),
  assignGeneral: (cantonId, name) =>
    set((st) => ({ cantons: { ...st.cantons, [cantonId]: { ...st.cantons[cantonId], general: name } } })),

  attack: (from, to) => {
    const st = get();
    const a = st.cantons[from];
    const d = st.cantons[to];
    if (a.owner !== "player" || isPlayerSide(d.owner)) return;
    const aPower = powerOf(a);
    const dPower = powerOf(d);
    const win = aPower * (0.8 + Math.random() * 0.4) > dPower;
    if (win) {
      set({
        cantons: {
          ...st.cantons,
          [from]: distributeMil(a, Math.floor(a.military * 0.7)),
        },
        pendingConquest: { from, to },
      });
      get().pushNews("Victory!", `⚔️ Glorious victory at ${CANTONS.find((x) => x.id === to)!.name}! Choose its fate.`);
    } else {
      set({
        cantons: { ...st.cantons, [from]: distributeMil(a, Math.floor(a.military * 0.5)) },
      });
      get().pushNews("Defeat", NEWS_TEMPLATES.warLost(d.id));
    }
  },

  endTurn: () => {
    const st = get();
    const next: Record<CantonId, CantonState> = { ...st.cantons };
    const newsBatch: { title: string; body: string }[] = [];
    const mult = DIFFICULTY_MULT[st.setup.difficulty];

    // Income & stat drift
    const sorted = Object.values(st.cantons).sort((a, b) => b.population - a.population);
    sorted.forEach((c, idx) => {
      const incomeBase = idx < 3 ? 4000 : idx < 7 ? 2200 : 1100;
      const economyMod = (c.health + c.loyalty) / 200;
      const ownerMult = c.owner === "player" ? mult.income : c.puppet ? 0.6 : 1;
      const income = Math.floor(incomeBase * (0.6 + economyMod) * ownerMult);
      const popDelta = c.loyalty > 65 ? rand(500, 2500) : c.loyalty < 35 ? -rand(500, 3000) : rand(-300, 800);
      next[c.id] = {
        ...c,
        treasury: c.treasury + income,
        population: Math.max(1000, c.population + popDelta),
        hunger: Math.max(0, Math.min(100, c.hunger + rand(-6, 4))),
        health: Math.max(0, Math.min(100, c.health + rand(-3, 3))),
        loyalty: Math.max(0, Math.min(100, c.loyalty + rand(-4, 4))),
      };
    });

    // Puppet tribute → player capital
    const playerOwned = Object.values(next).filter((c) => c.owner === "player");
    const capital = playerOwned[0];
    if (capital) {
      let totalTribute = 0;
      for (const c of Object.values(next)) {
        if (c.puppet) {
          const tribute = Math.floor(c.treasury * 0.35);
          totalTribute += tribute;
          next[c.id] = { ...next[c.id], treasury: Math.max(0, next[c.id].treasury - tribute) };
        }
      }
      if (totalTribute > 0) {
        next[capital.id] = { ...next[capital.id], treasury: next[capital.id].treasury + totalTribute };
        newsBatch.push({ title: "👑 Tribute Collected", body: `Puppets paid ${totalTribute.toLocaleString()}¢ into your treasury.` });
      }
    }

    // AI-vs-AI and AI-vs-player wars
    const aiCantons = Object.values(next).filter((c) => c.owner.startsWith("ai-"));
    for (const att of aiCantons) {
      if (Math.random() > mult.aiAggression) continue;
      const neighbors = NEIGHBORS[att.id].map((nid) => next[nid]).filter((n) => n.owner !== att.owner);
      if (!neighbors.length) continue;
      // Prefer player side targets when difficulty high, weak targets otherwise
      const wantPlayer = Math.random() < 0.4 + mult.aiAggression * 0.4;
      const candidates = wantPlayer ? neighbors.filter((n) => isPlayerSide(n.owner)) : neighbors;
      const target = (candidates.length ? candidates : neighbors).sort((a, b) => powerOf(a) - powerOf(b))[0];
      if (!target) continue;
      const aPow = powerOf(att) * mult.aiPower;
      const dPow = powerOf(target);
      const wins = aPow * (0.7 + Math.random() * 0.5) > dPow;
      if (wins) {
        const targetName = CANTONS.find((x) => x.id === target.id)!.name;
        const attName = CANTONS.find((x) => x.id === att.id)!.name;
        if (isPlayerSide(target.owner)) {
          // AI conquers player canton
          next[target.id] = {
            ...distributeMil(target, Math.floor(target.military * 0.4)),
            owner: att.owner,
            puppet: false,
            loyalty: 30,
          };
          newsBatch.push({ title: "💀 Province Lost!", body: `${attName} has stormed and seized ${targetName}!` });
        } else {
          // AI absorbs other AI
          next[target.id] = {
            ...distributeMil(target, Math.floor(target.military * 0.4)),
            owner: att.owner,
            loyalty: 40,
          };
          newsBatch.push({ title: "🗞 Border War", body: `${attName} conquered ${targetName}.` });
        }
        next[att.id] = distributeMil(next[att.id], Math.floor(att.military * 0.75));
      } else {
        next[att.id] = distributeMil(next[att.id], Math.floor(att.military * 0.6));
      }
    }

    // Outbreaks
    const weakest = Object.values(next).sort((a, b) => a.hunger - b.hunger)[0];
    if (weakest && weakest.hunger < 30 && Math.random() < 0.5) {
      next[weakest.id] = { ...weakest, health: Math.max(5, weakest.health - 25), population: Math.max(500, Math.floor(weakest.population * 0.85)) };
      newsBatch.push({ title: "HantaVirus Outbreak", body: NEWS_TEMPLATES.hantavirus(CANTONS.find((x) => x.id === weakest.id)!.name) });
    }

    // Migration
    for (const c of Object.values(next)) {
      if (c.loyalty < 20 && Math.random() < 0.35 && c.owner !== "player") {
        const newType = pick(PIGEON_IDS.filter((p) => p !== c.pigeonType));
        next[c.id] = { ...c, pigeonType: newType, loyalty: 55 };
        newsBatch.push({
          title: "Great Migration",
          body: NEWS_TEMPLATES.migration(CANTONS.find((x) => x.id === c.id)!.name, PIGEON_TYPES.find((p) => p.id === newType)!.name),
        });
      }
    }

    if (Math.random() < 0.25) {
      const c = pick(Object.values(next));
      if (c.hunger < 50) newsBatch.push({ title: "Famine Warning", body: NEWS_TEMPLATES.famine(CANTONS.find((x) => x.id === c.id)!.name) });
    }

    const nextTurn = st.turn + 1;
    set({ cantons: next, turn: nextTurn });
    newsBatch.forEach((n) => get().pushNews(n.title, n.body));

    // Victory check
    const allCantons = Object.values(next);
    if (allCantons.every((c) => isPlayerSide(c.owner))) {
      set({ gameOver: { won: true, reason: "All of Bosnia flies your banner. Total dominion achieved." } });
      return;
    }

    // Election every 12 turns
    if (nextTurn % 12 === 1 && nextTurn > 1) {
      const playerCantons = Object.values(next).filter((c) => c.owner === "player");
      if (playerCantons.length === 0) {
        set({ gameOver: { won: false, reason: "Your realm has fallen. No territories remain." } });
        return;
      }
      const avg = (key: "loyalty" | "hunger" | "health") => playerCantons.reduce((s, c) => s + c[key], 0) / playerCantons.length;
      const expansionBonus = Math.min(20, (playerCantons.length - 1) * 3);
      const approval = Math.round(avg("loyalty") * 0.5 + avg("hunger") * 0.25 + avg("health") * 0.25 + expansionBonus);
      const opponent = rand(40, 70) + Math.round(mult.aiPower * 5);
      const won = approval >= opponent;
      set({ lastElection: { turn: nextTurn, approval, opponent, won } });
      if (won) {
        get().pushNews("🗳 RE-ELECTED!", `Year ${Math.floor(nextTurn / 12)} — you won ${approval}% vs ${opponent}%.`);
      } else {
        get().pushNews("🗳 ELECTION LOST", `Approval ${approval}% vs opponent ${opponent}%.`);
        set({
          gameOver: {
            won: false,
            reason: `You lost the year-${Math.floor(nextTurn / 12)} elections — ${approval}% vs ${opponent}%.`,
            approval,
          },
        });
      }
    }
  },

  startGame: () =>
    set((st) => ({
      screen: "game",
      turn: 1,
      cantons: buildInitialCantons(st.setup),
      selectedCanton: st.setup.startingCanton,
      news: [],
      unreadNews: [],
      gameOver: null,
      lastElection: null,
      pendingConquest: null,
    })),

  resetGame: () =>
    set((st) => ({
      screen: "menu",
      turn: 1,
      setup: { ...initialSetup, musicEnabled: st.setup.musicEnabled, musicVolume: st.setup.musicVolume },
      cantons: buildInitialCantons(initialSetup),
      selectedCanton: null,
      news: [],
      unreadNews: [],
      gameOver: null,
      lastElection: null,
      pendingConquest: null,
    })),

  saveGame: (slot) => {
    const st = get();
    const payload = {
      v: 1,
      turn: st.turn,
      cantons: st.cantons,
      setup: st.setup,
      news: st.news,
      gameOver: st.gameOver,
      lastElection: st.lastElection,
      selectedCanton: st.selectedCanton,
      savedAt: Date.now(),
      name: st.setup.leaderName || `Save ${slot}`,
    };
    try {
      localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(payload));
      const idx = JSON.parse(localStorage.getItem(SAVE_INDEX_KEY) || "[]");
      if (!idx.includes(slot)) {
        idx.push(slot);
        localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(idx));
      }
      get().pushNews("💾 Saved", `Campaign saved to slot ${slot}.`);
    } catch (e) {
      console.error("save failed", e);
    }
  },
  loadGame: (slot) => {
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      if (!raw) return;
      const p = JSON.parse(raw);
      set({
        screen: "game",
        turn: p.turn,
        cantons: p.cantons,
        setup: p.setup,
        news: p.news ?? [],
        unreadNews: [],
        gameOver: p.gameOver ?? null,
        lastElection: p.lastElection ?? null,
        selectedCanton: p.selectedCanton ?? null,
        pendingConquest: null,
      });
    } catch (e) {
      console.error("load failed", e);
    }
  },
  listSaves: () => {
    try {
      const idx: number[] = JSON.parse(localStorage.getItem(SAVE_INDEX_KEY) || "[]");
      return idx
        .map((slot) => {
          const raw = localStorage.getItem(SAVE_PREFIX + slot);
          if (!raw) return null;
          const p = JSON.parse(raw);
          const owned = Object.values(p.cantons as Record<string, CantonState>).filter((c) => isPlayerSide(c.owner)).length;
          return { slot, name: p.name || `Save ${slot}`, turn: p.turn, cantons: owned, savedAt: p.savedAt };
        })
        .filter(Boolean) as SaveSlot[];
    } catch {
      return [];
    }
  },
  deleteSave: (slot) => {
    try {
      localStorage.removeItem(SAVE_PREFIX + slot);
      const idx: number[] = JSON.parse(localStorage.getItem(SAVE_INDEX_KEY) || "[]");
      localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(idx.filter((s) => s !== slot)));
    } catch {}
  },
}));
