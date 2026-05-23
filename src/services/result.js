import { GAMES } from "@/utils/gameConfig";

// API Base URL
const API_BASE = (() => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  }

  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
})();

// ==================== SETTINGS ====================
export async function getSettings() {
  try {
    const response = await fetch(`${API_BASE}/api/settings`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const settings = await response.json();
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

function getISTDate(daysOffset = 0) {
  const date = new Date();
  // Add IST offset (5.5 hours)
  date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));
  // Add/subtract days if needed
  if (daysOffset !== 0) {
    date.setDate(date.getDate() + daysOffset);
  }
  // Format as YYYY-MM-DD
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function updateSettings(settings) {
  try {
    const response = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to update settings");
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// ==================== RESULTS QUERIES ====================
export async function getTodayResult() {
  const today = getISTDate(); // Use IST date
  console.log('Fetching results for:', today); // Debug log

  try {
    const response = await fetch(`${API_BASE}/api/results?type=today`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching today's results:", error);
    return [];
  }
}

export async function getYesterdayResults() {
  const yDate = getISTDate(-1); // Yesterday in IST
  console.log('Fetching yesterday results for:', yDate);

  try {
    const response = await fetch(`${API_BASE}/api/results?type=yesterday`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching yesterday's results:", error);
    return [];
  }
}

export async function getLastResult() {
  try {
    const response = await fetch(`${API_BASE}/api/results?type=last`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching last result:", error);
    return null;
  }
}

export async function getDisawarData() {
  try {
    const response = await fetch(`${API_BASE}/api/results?type=disawar`, {
      cache: 'no-store'
    });
    if (!response.ok) return { today: null, yesterday: null };
    return await response.json();
  } catch (error) {
    console.error("Error fetching Disawar data:", error);
    return { today: null, yesterday: null };
  }
}

export async function getMonthlyResults(month, year) {
  try {
    const response = await fetch(
      `${API_BASE}/api/results?month=${month}&year=${year}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching monthly results:", error);
    return [];
  }
}

export async function getYearlyResults(gameKey, year) {
  try {
    const response = await fetch(
      `${API_BASE}/api/results?game=${gameKey}&year=${year}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching yearly results:", error);
    return [];
  }
}

// ==================== ADMIN FUNCTIONS ====================
export async function getAllResultsWithMeta() {
  try {
    const response = await fetch(`${API_BASE}/api/results`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching all results with metadata:", error);
    return [];
  }
}

export async function createResult(data) {
  try {
    const response = await fetch(`${API_BASE}/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0] || 'Failed to create result');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating result:', error);
    throw error;
  }
}

export async function updateResult(id, data) {
  try {
    const response = await fetch(`${API_BASE}/api/results/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update result');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating result:', error);
    throw error;
  }
}

export async function deleteResult(id) {
  try {
    const response = await fetch(`${API_BASE}/api/results/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete result');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting result:', error);
    throw error;
  }
}

export async function getVisitorCount() {
  try {
    const trackerUrl = process.env.NEXT_PUBLIC_TRACKING_API_URL;
    if (!trackerUrl) return null;

    const response = await fetch(trackerUrl, {
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.count === 'number' ? data.count : null;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return null;
  }
}

export function validateResultData(data, options = {}) {
  const errors = [];
  const requireWaitingGame = options.requireWaitingGame ?? true;

  if (!data.game) {
    errors.push('Game is required');
  }

  if (!data.resultNumber) {
    errors.push('Result number is required');
  }

  if (requireWaitingGame && !data.waitingGame) {
    errors.push('Waiting game is required');
  }

  if (data.waitingGame && data.game === data.waitingGame) {
    errors.push('Waiting game must be different from the selected game');
  }

  if (!data.date) {
    errors.push('Date is required');
  }

  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }

  if (data.resultNumber && !/^\d+$/.test(data.resultNumber)) {
    errors.push('Result number should contain only numbers');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ==================== CHART MAPPINGS ====================
// Dynamic game slug mapping using GAMES config
const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export const gameSlugMapping = {};
GAMES.forEach(game => {
  years.forEach(year => {
    gameSlugMapping[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = game.key;
  });
});

// Dynamic parse slug data function
export function parseSlugData(slug) {
  const gameDisplayNames = {};

  GAMES.forEach(game => {
    years.forEach(year => {
      gameDisplayNames[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = {
        name: game.name,
        year: String(year)
      };
    });
  });

  return gameDisplayNames[slug] || null;
}

// ==================== TRANSFORM FUNCTIONS ====================
export function transformYearlyData(results) {
  const months = {
    JAN: {}, FEB: {}, MAR: {}, APR: {}, MAY: {}, JUN: {},
    JUL: {}, AUG: {}, SEP: {}, OCT: {}, NOV: {}, DEC: {}
  };

  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  results.forEach(result => {
    const date = new Date(result.date);
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    if (months[month]) {
      months[month][day] = result.resultNumber;
    }
  });
  return months;
}