// Hearts of Pigeons — core game data
// Canton SVG paths are hand-crafted approximations of real Bosnia & Herzegovina
// administrative regions, intentionally stylized for the game map.

export type CantonId =
  | "unsko-sanski"
  | "posavski"
  | "tuzlanski"
  | "zenicko-dobojski"
  | "bosansko-podrinjski"
  | "srednjobosanski"
  | "hercegovacko-neretvanski"
  | "zapadnohercegovacki"
  | "sarajevo"
  | "kanton-10"
  | "republika-srpska"
  | "brcko";

export interface CantonDef {
  id: CantonId;
  name: string;
  capital: string;
  color: string; // base fill
  path: string;
  labelX: number;
  labelY: number;
}

import cantonGeo from "./cantons.geo.json";

type GeoEntry = { id: string; name: string; path: string; labelX: number; labelY: number };
const GEO = cantonGeo as GeoEntry[];
const geo = (id: string) => GEO.find((g) => g.id === id)!;

const META: Record<CantonId, { name: string; capital: string; color: string }> = {
  "unsko-sanski": { name: "Unsko-Sanski", capital: "Bihać", color: "oklch(0.78 0.10 110)" },
  "posavski": { name: "Posavski", capital: "Orašje", color: "oklch(0.72 0.15 240)" },
  "tuzlanski": { name: "Tuzlanski", capital: "Tuzla", color: "oklch(0.90 0.14 95)" },
  "zenicko-dobojski": { name: "Zeničko-Dobojski", capital: "Zenica", color: "oklch(0.62 0.06 110)" },
  "bosansko-podrinjski": { name: "Bosansko-Podrinjski", capital: "Goražde", color: "oklch(0.86 0.14 30)" },
  "srednjobosanski": { name: "Srednjobosanski", capital: "Travnik", color: "oklch(0.78 0.12 200)" },
  "hercegovacko-neretvanski": { name: "Hercegovačko-Neretvanski", capital: "Mostar", color: "oklch(0.85 0.08 60)" },
  "zapadnohercegovacki": { name: "Zapadnohercegovački", capital: "Široki Brijeg", color: "oklch(0.66 0.10 140)" },
  "sarajevo": { name: "Kanton Sarajevo", capital: "Sarajevo", color: "oklch(0.78 0.16 145)" },
  "kanton-10": { name: "Kanton 10", capital: "Livno", color: "oklch(0.74 0.13 50)" },
  "republika-srpska": { name: "Republika Srpska", capital: "Banja Luka", color: "oklch(0.72 0.13 25)" },
  "brcko": { name: "Brčko District", capital: "Brčko", color: "oklch(0.82 0.12 170)" },
};

export const PRESIDENTS: Record<CantonId, string> = {
  "unsko-sanski": "Coo Hadžić",
  "posavski": "Perica Golubović",
  "tuzlanski": "Maršal Krilo",
  "zenicko-dobojski": "Beg Sivi",
  "bosansko-podrinjski": "Hadži Gugutka",
  "srednjobosanski": "Pero Travničanin",
  "hercegovacko-neretvanski": "Don Bijeli Krilić",
  "zapadnohercegovacki": "Ivan Perjanić",
  "sarajevo": "Predsjednik OG Bijeli",
  "kanton-10": "Vojvoda Livnjak",
  "republika-srpska": "General Sivonja",
  "brcko": "Gospodar Brčkić",
};

export const CANTONS: CantonDef[] = (Object.keys(META) as CantonId[]).map((id) => {
  const g = geo(id);
  return {
    id,
    name: META[id].name,
    capital: META[id].capital,
    color: META[id].color,
    path: g.path,
    labelX: g.labelX,
    labelY: g.labelY,
  };
});

export const OPSTINAS: Record<CantonId, string[]> = {
  "unsko-sanski": ["Bihać", "Cazin", "Sanski Most", "Velika Kladuša"],
  "posavski": ["Orašje", "Odžak", "Domaljevac"],
  "tuzlanski": ["Tuzla", "Lukavac", "Živinice", "Gračanica", "Srebrenik"],
  "zenicko-dobojski": ["Zenica", "Tešanj", "Visoko", "Kakanj"],
  "bosansko-podrinjski": ["Goražde", "Foča-Ustikolina", "Pale-Prača"],
  "srednjobosanski": ["Travnik", "Vitez", "Bugojno", "Jajce"],
  "hercegovacko-neretvanski": ["Mostar", "Konjic", "Jablanica", "Čapljina"],
  "zapadnohercegovacki": ["Široki Brijeg", "Ljubuški", "Posušje", "Grude"],
  "sarajevo": ["Stari Grad", "Centar", "Novo Sarajevo", "Novi Grad", "Ilidža"],
  "kanton-10": ["Livno", "Tomislavgrad", "Kupres", "Glamoč"],
  "republika-srpska": ["Banja Luka", "Bijeljina", "Prijedor", "Doboj", "Trebinje", "Pale"],
  "brcko": ["Brčko", "Brezovo Polje", "Ravne-Brčko"],
};

export const PLAYER_COLORS = [
  { id: "green", name: "Forest", value: "oklch(0.68 0.18 145)" },
  { id: "blue", name: "Royal Blue", value: "oklch(0.62 0.20 255)" },
  { id: "red", name: "Crimson", value: "oklch(0.62 0.22 25)" },
  { id: "purple", name: "Imperial", value: "oklch(0.58 0.20 305)" },
  { id: "gold", name: "Gold", value: "oklch(0.78 0.16 80)" },
  { id: "cyan", name: "Sky", value: "oklch(0.72 0.14 210)" },
];

export const PIGEON_TYPES = [
  { id: "rock", name: "Rock Pigeon", trait: "Balanced", bonus: { military: 5, economy: 5 } },
  { id: "fantail", name: "Fantail", trait: "Charismatic", bonus: { loyalty: 15 } },
  { id: "homing", name: "Homing Pigeon", trait: "Tactical", bonus: { military: 12 } },
  { id: "tumbler", name: "Tumbler", trait: "Acrobatic", bonus: { military: 6, health: 6 } },
  { id: "pouter", name: "Pouter", trait: "Proud", bonus: { loyalty: 10, economy: 4 } },
  { id: "jacobin", name: "Jacobin", trait: "Devout", bonus: { loyalty: 8, health: 8 } },
  { id: "nicobar", name: "Nicobar", trait: "Exotic Trader", bonus: { economy: 18 } },
  { id: "crowned", name: "Crowned Pigeon", trait: "Regal", bonus: { loyalty: 20, military: 4 } },
  { id: "passenger", name: "Passenger", trait: "Swarm Tactics", bonus: { military: 15, population: 10 } },
  { id: "white-og", name: "The OGs (White)", trait: "Sarajevo Native", bonus: { loyalty: 25, military: 8 } },
  { id: "ringneck", name: "Ringneck", trait: "Diplomatic", bonus: { economy: 8, loyalty: 6 } },
  { id: "frillback", name: "Frillback", trait: "Hardy", bonus: { health: 15 } },
];

export const IDEOLOGIES = [
  "Democracy", "Authoritarianism", "Theocracy", "Anarchism",
  "Communism", "Monarchism", "Technocracy", "Pigeon Supremacy",
];

export const RELIGIONS = [
  "Pigeonism", "The Sky Church", "Order of the Crumb", "Coo Coo Mysticism",
  "Atheist Flock", "Old Feathers", "Loft of the Sun",
];

export const DIFFICULTIES = ["Easy", "Normal", "Hard", "Pigeon Chaos"] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const NEWS_TEMPLATES = {
  hantavirus: (c: string) => `🦠 HantaVirus outbreak ravages ${c}! Starving pigeons collapse in the streets.`,
  migration: (c: string, to: string) => `🪶 Great Migration! Disloyal flock in ${c} has been replaced — now ruled by ${to}.`,
  ogIndependence: () => `🕊️ The OGs have declared Općina Novi Grad independent from Kanton Sarajevo!`,
  warWon: (c: string) => `⚔️ Glorious victory! Forces have captured ${c}.`,
  warLost: (c: string) => `💀 Defeat. Your forces were routed attempting to take ${c}.`,
  boom: (c: string) => `📈 Economic boom in ${c}! Treasury swells with coin.`,
  famine: (c: string) => `🍞 Famine looms in ${c}. Hunger reaches critical levels.`,
};
