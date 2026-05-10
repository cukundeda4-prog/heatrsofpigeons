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

// viewBox: 0 0 850 770 (matches reference map proportions)
export const CANTONS: CantonDef[] = [
  {
    id: "unsko-sanski",
    name: "Unsko-Sanski",
    capital: "Bihać",
    color: "oklch(0.78 0.10 110)",
    path: "M40,260 L60,180 L120,130 L180,160 L210,220 L260,290 L240,360 L200,420 L160,440 L100,420 L60,360 Z",
    labelX: 140, labelY: 290,
  },
  {
    id: "republika-srpska",
    name: "Republika Srpska",
    capital: "Banja Luka",
    color: "oklch(0.82 0.08 25)",
    // Northern arc + eastern wing (drawn as two layered shapes via single path)
    path: "M180,160 L260,90 L380,70 L500,90 L560,130 L560,170 L520,200 L470,210 L420,200 L380,210 L340,220 L300,230 L260,250 L210,220 Z M560,170 L620,200 L680,260 L740,340 L780,440 L800,540 L770,620 L720,700 L660,720 L620,700 L600,640 L580,560 L560,480 L540,400 L520,320 L520,260 L540,210 Z",
    labelX: 380, labelY: 130,
  },
  {
    id: "posavski",
    name: "Posavski",
    capital: "Orašje",
    color: "oklch(0.72 0.15 240)",
    path: "M470,80 L560,70 L600,90 L590,120 L540,130 L490,120 Z",
    labelX: 530, labelY: 100,
  },
  {
    id: "brcko",
    name: "Brčko District",
    capital: "Brčko",
    color: "oklch(0.88 0.10 150)",
    path: "M600,90 L640,80 L660,110 L640,140 L605,130 Z",
    labelX: 630, labelY: 110,
  },
  {
    id: "tuzlanski",
    name: "Tuzlanski",
    capital: "Tuzla",
    color: "oklch(0.90 0.14 95)",
    path: "M470,210 L560,200 L620,230 L640,290 L620,340 L560,360 L500,350 L460,310 L450,260 Z",
    labelX: 540, labelY: 290,
  },
  {
    id: "zenicko-dobojski",
    name: "Zeničko-Dobojski",
    capital: "Zenica",
    color: "oklch(0.62 0.04 110)",
    path: "M340,220 L420,210 L460,260 L470,310 L460,370 L420,420 L380,440 L340,430 L310,400 L300,350 L310,290 Z",
    labelX: 390, labelY: 320,
  },
  {
    id: "srednjobosanski",
    name: "Srednjobosanski",
    capital: "Travnik",
    color: "oklch(0.78 0.12 200)",
    path: "M240,360 L310,350 L340,410 L380,450 L370,500 L320,510 L270,490 L240,440 Z",
    labelX: 305, labelY: 430,
  },
  {
    id: "sarajevo",
    name: "Kanton Sarajevo",
    capital: "Sarajevo",
    color: "oklch(0.78 0.16 140)",
    path: "M420,440 L470,440 L490,480 L470,520 L430,520 L405,490 Z",
    labelX: 450, labelY: 485,
  },
  {
    id: "bosansko-podrinjski",
    name: "Bosansko-Podrinjski",
    capital: "Goražde",
    color: "oklch(0.86 0.14 95)",
    path: "M540,460 L585,455 L600,495 L585,535 L545,535 L530,500 Z",
    labelX: 565, labelY: 495,
  },
  {
    id: "kanton-10",
    name: "Kanton 10",
    capital: "Livno",
    color: "oklch(0.74 0.13 50)",
    path: "M100,420 L200,420 L240,440 L270,490 L240,560 L190,610 L130,620 L80,580 L60,500 Z",
    labelX: 160, labelY: 510,
  },
  {
    id: "zapadnohercegovacki",
    name: "Zapadnohercegovački",
    capital: "Široki Brijeg",
    color: "oklch(0.55 0.05 110)",
    path: "M130,620 L240,610 L290,650 L280,700 L220,720 L160,705 L120,670 Z",
    labelX: 210, labelY: 670,
  },
  {
    id: "hercegovacko-neretvanski",
    name: "Hercegovačko-Neretvanski",
    capital: "Mostar",
    color: "oklch(0.85 0.06 110)",
    path: "M270,490 L320,510 L370,500 L410,530 L430,580 L420,640 L380,690 L320,710 L290,690 L280,640 L290,580 Z",
    labelX: 350, labelY: 610,
  },
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
