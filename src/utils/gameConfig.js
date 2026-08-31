
export const GAMES = [
  {
    key: "disawer",
    name: "DISAWER",
    time: "05:20 AM",
    order: 10,
  },
  {
    key: "shirdi-dham",
    name: "SHIRDI DHAM",
    time: "01:00 PM",
    order: 1,
  },
  {
    key: "kaliyar",
    name: "KALIYAR",
    time: "02:00 PM",
    order: 2,
  },
  {
    key: "delhi-bazar",
    name: "DELHI BAZAR",
    time: "03:00 PM",
    order: 3,
  },
  {
    key: "shri-ganesh",
    name: "SHRI GANESH",
    time: "04:40 PM",
    order: 4,
  },
  {
    key: "faridabad",
    name: "FARIDABAD",
    time: "06:00 PM",
    order: 5,
  },
  {
    key: "shakti-peeth",
    name: "SHAKTI PEETH",
    time: "07:30 PM",
    order: 6,
  },
  {
    key: "gaziyabad",
    name: "GAZIYABAD",
    time: "09:30 PM",
    order: 7,
  },
  {
    key: "mathura",
    name: "MATHURA",
    time: "10:05 PM",
    order: 8,
  },
  {
    key: "gali",
    name: "GALI",
    time: "11:30 PM",
    order: 9,
  },
];

// Get game by key
export const getGameByKey = (key) => {
  return GAMES.find(game => game.key === key);
};

// Get game by name
export const getGameByName = (name) => {
  return GAMES.find(game => game.name === name);
};

// Get all game keys for queries
export const GAME_KEYS = GAMES.map(game => game.key);

// Get all game names for display
export const GAME_NAMES = GAMES.map(game => game.name);

// Older imports and external sources have used both "Disawar" and
// "Desawar". Keep one canonical database key while still displaying those
// existing records.
export const normalizeGameKey = (value = "") => {
  const key = String(value).toLowerCase().trim().replace(/[\s_]+/g, "-");
  return ["disawar", "desawar", "desawer"].includes(key) ? "disawer" : key;
};

export const getCompatibleGameKeys = (value) => {
  const key = normalizeGameKey(value);
  return key === "disawer"
    ? ["disawer", "disawar", "desawar", "desawer"]
    : [key];
};

// Create options for Sanity schema
export const GAME_OPTIONS = GAMES.map(game => ({
  title: game.name,
  value: game.key
}));

// Game mapping for backward compatibility
export const GAME_MAPPING = GAMES.reduce((acc, game) => {
  acc[game.key] = {
    displayName: game.name,
    time: game.time
  };
  return acc;
}, {});
