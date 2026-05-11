import { create } from "zustand";
import { CANTONS, CantonId, Difficulty, PIGEON_TYPES, NEWS_TEMPLATES, OPSTINAS } from "./data";

export interface Opstina {
  name: string;
  military: number;
}


export interface CantonState {
  id: CantonId;
  owner: string; // player id or "ai-<n>" or "independent"
  pigeonType: string;
  ideology: string;
  religion: string;
  population: number;
  hunger: number; // 0-100 (higher = better fed)
  health: number; // 0-100
  loyalty: number; // 0-100
  military: number; // troop count
  treasury: number;
  units: number; // deployed recruits visible on map
  tanks: number;
  planes: number;
  artillery: number;
  nukes: number;
  general?: string;
  opstinas: Opstina[];
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
}

export type Screen = "menu" | "setup" | "game";

interface GameStore {
  screen: Screen;
  setScreen: (s: Screen) => void;

  setup: PlayerSetup;
  setSetup: (patch: Partial<PlayerSetup>) => void;

  turn: number;
  cantons: Record<CantonId, CantonState>;
  selectedCanton: CantonId | null;
  selectCanton: (id: CantonId | null) => void;

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
  setOpstinaMilitary: (cantonId: CantonId, index: number, value: number) => void;
  assignGeneral: (cantonId: CantonId, name: string) => void;

  attack: (from: CantonId, to: CantonId) => void;

  endTurn: () => void;
  startGame: () => void;
  resetGame: () => void;
}

const PIGEON_IDS = PIGEON_TYPES.map((p) => p.id);
const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function buildInitialCantons(setup: PlayerSetup): Record<CantonId, CantonState> {
  const result = {} as Record<CantonId, CantonState>;
  for (const c of CANTONS) {
    const isPlayer = c.id === setup.startingCanton;
    const isSarajevo = c.id === "sarajevo";
    result[c.id] = {
      id: c.id,
      owner: isPlayer ? "player" : `ai-${c.id}`,
      pigeonType: isPlayer
        ? setup.pigeonType
        : isSarajevo
          ? "white-og"
          : pick(PIGEON_IDS),
      ideology: isPlayer ? setup.ideology : pick(["Democracy", "Authoritarianism", "Theocracy", "Anarchism"]),
      religion: isPlayer ? setup.religion : pick(["Pigeonism", "The Sky Church", "Old Feathers"]),
      population: rand(80, 400) * 1000,
      hunger: rand(45, 85),
      health: rand(50, 90),
      loyalty: isPlayer ? 80 : rand(40, 75),
      military: rand(200, 1200),
      treasury: isPlayer ? 12000 : rand(2000, 9000),
      units: 0,
      tanks: 0,
      planes: 0,
      artillery: 0,
      nukes: 0,
      opstinas: (OPSTINAS[c.id] ?? []).map((name) => ({ name, military: 0 })),
    };
    // Distribute military across opstinas
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
};

export const useGame = create<GameStore>((set, get) => ({
  screen: "menu",
  setScreen: (s) => set({ screen: s }),

  setup: initialSetup,
  setSetup: (patch) => set((st) => ({ setup: { ...st.setup, ...patch } })),

  turn: 1,
  cantons: buildInitialCantons(initialSetup),
  selectedCanton: null,
  selectCanton: (id) => set({ selectedCanton: id }),

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
      return {
        cantons: {
          ...st.cantons,
          [cantonId]: { ...c, treasury: c.treasury - cost, military: c.military + amount, units: c.units + amount },
        },
      };
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
      return {
        cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, artillery: c.artillery + count } },
      };
    }),
  buyNuke: (cantonId) =>
    set((st) => {
      const c = st.cantons[cantonId];
      const cost = 50000;
      if (c.treasury < cost) return st;
      return { cantons: { ...st.cantons, [cantonId]: { ...c, treasury: c.treasury - cost, nukes: c.nukes + 1 } } };
    }),
  assignGeneral: (cantonId, name) =>
    set((st) => ({ cantons: { ...st.cantons, [cantonId]: { ...st.cantons[cantonId], general: name } } })),

  attack: (from, to) => {
    const st = get();
    const a = st.cantons[from];
    const d = st.cantons[to];
    if (a.owner !== "player" || d.owner === "player") return;
    const aPower =
      a.military + a.tanks * 50 + a.planes * 120 + a.artillery * 40 + (a.general ? 200 : 0) + a.nukes * 5000;
    const dPower = d.military + d.tanks * 50 + d.planes * 120 + d.artillery * 40;
    const win = aPower * (0.8 + Math.random() * 0.4) > dPower;
    if (win) {
      set({
        cantons: {
          ...st.cantons,
          [to]: { ...d, owner: "player", loyalty: 35, military: Math.max(100, Math.floor(d.military * 0.3)) },
          [from]: { ...a, military: Math.max(50, Math.floor(a.military * 0.7)), units: Math.max(0, a.units - 200) },
        },
      });
      get().pushNews("Victory!", NEWS_TEMPLATES.warWon(d.id));
    } else {
      set({
        cantons: {
          ...st.cantons,
          [from]: { ...a, military: Math.max(50, Math.floor(a.military * 0.5)), units: Math.max(0, a.units - 400) },
        },
      });
      get().pushNews("Defeat", NEWS_TEMPLATES.warLost(d.id));
    }
  },

  endTurn: () => {
    const st = get();
    const next: Record<CantonId, CantonState> = { ...st.cantons };
    const newsBatch: { title: string; body: string }[] = [];

    // Income & stat drift
    const sorted = Object.values(st.cantons).sort((a, b) => b.population - a.population);
    sorted.forEach((c, idx) => {
      const incomeBase = idx < 3 ? 4000 : idx < 7 ? 2200 : 1100;
      const economyMod = (c.health + c.loyalty) / 200;
      const income = Math.floor(incomeBase * (0.6 + economyMod));
      const popDelta = c.loyalty > 65 ? rand(500, 2500) : c.loyalty < 35 ? -rand(500, 3000) : rand(-300, 800);
      const updated: CantonState = {
        ...c,
        treasury: c.treasury + income,
        population: Math.max(1000, c.population + popDelta),
        hunger: Math.max(0, Math.min(100, c.hunger + rand(-6, 4))),
        health: Math.max(0, Math.min(100, c.health + rand(-3, 3))),
        loyalty: Math.max(0, Math.min(100, c.loyalty + rand(-4, 4))),
      };
      next[c.id] = updated;
    });

    // HantaVirus on lowest hunger
    const weakest = Object.values(next).sort((a, b) => a.hunger - b.hunger)[0];
    if (weakest && weakest.hunger < 30 && Math.random() < 0.5) {
      next[weakest.id] = {
        ...weakest,
        health: Math.max(5, weakest.health - 25),
        population: Math.max(500, Math.floor(weakest.population * 0.85)),
      };
      const cantonName = CANTONS.find((x) => x.id === weakest.id)!.name;
      newsBatch.push({ title: "HantaVirus Outbreak", body: NEWS_TEMPLATES.hantavirus(cantonName) });
    }

    // Great Migration
    for (const c of Object.values(next)) {
      if (c.loyalty < 20 && Math.random() < 0.35 && c.owner !== "player") {
        const newType = pick(PIGEON_IDS.filter((p) => p !== c.pigeonType));
        next[c.id] = { ...c, pigeonType: newType, loyalty: 55 };
        const cantonName = CANTONS.find((x) => x.id === c.id)!.name;
        const newName = PIGEON_TYPES.find((p) => p.id === newType)!.name;
        newsBatch.push({ title: "Great Migration", body: NEWS_TEMPLATES.migration(cantonName, newName) });
      }
    }

    // OG Independence
    const sj = next.sarajevo;
    if (sj && sj.pigeonType === "white-og" && sj.owner === "player" && Math.random() < 0.12) {
      newsBatch.push({ title: "Independence Declared", body: NEWS_TEMPLATES.ogIndependence() });
      next.sarajevo = { ...sj, loyalty: Math.max(20, sj.loyalty - 30) };
    }

    // Random famine
    if (Math.random() < 0.25) {
      const c = pick(Object.values(next));
      if (c.hunger < 50) {
        newsBatch.push({ title: "Famine Warning", body: NEWS_TEMPLATES.famine(CANTONS.find((x) => x.id === c.id)!.name) });
      }
    }

    set({ cantons: next, turn: st.turn + 1 });
    newsBatch.forEach((n) => get().pushNews(n.title, n.body));
  },

  startGame: () =>
    set((st) => ({
      screen: "game",
      turn: 1,
      cantons: buildInitialCantons(st.setup),
      selectedCanton: st.setup.startingCanton,
      news: [],
      unreadNews: [],
    })),

  resetGame: () =>
    set({
      screen: "menu",
      turn: 1,
      setup: initialSetup,
      cantons: buildInitialCantons(initialSetup),
      selectedCanton: null,
      news: [],
      unreadNews: [],
    }),
}));
