const FIRESTORE_VALUE_KEYS = [
  "stringValue",
  "integerValue",
  "doubleValue",
  "booleanValue",
  "timestampValue",
];

const readFirestoreValue = (value = {}) => {
  const key = FIRESTORE_VALUE_KEYS.find((candidate) => candidate in value);
  return key ? String(value[key]) : null;
};

const decodeFirestoreValue = (value = {}) => {
  const primitive = readFirestoreValue(value);
  if (primitive !== null) return primitive;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue);
  }
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([key, nestedValue]) => [
        key,
        decodeFirestoreValue(nestedValue),
      ]),
    );
  }
  return null;
};

const decodeDocumentFields = (document) =>
  Object.fromEntries(
    Object.entries(document.fields || {}).map(([key, value]) => [
      key,
      decodeFirestoreValue(value),
    ]),
  );

const formatGameName = (name) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export async function getFirebaseCustomGames(year, month) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.warn("Firebase custom games skipped: Firebase environment variables are missing");
    return { columns: [], rows: [] };
  }

  const endpoint = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/custom_games`,
  );
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("pageSize", "366");

  const response = await fetch(endpoint, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Firebase custom_games request failed: ${response.status}`);
  }

  const payload = await response.json();
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const rows = documents
    .map((document) => {
      const date = document.name?.split("/").pop() || "";
      if (!date.startsWith(monthPrefix)) return null;

      const results = {};
      for (const [name, value] of Object.entries(document.fields || {})) {
        if (name === "updatedAt" || name === "khaiwal") continue;
        const result = readFirestoreValue(value);
        if (result !== null) results[name] = result;
      }

      return {
        date,
        day: Number(date.slice(-2)),
        results,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));

  const preferredOrder = [
    "kohlapur",
    "manipur",
    "up-bazar",
    "palwal-city",
    "mathura-city",
  ];
  const availableNames = new Set(rows.flatMap((row) => Object.keys(row.results)));
  const orderedNames = [
    ...preferredOrder.filter((name) => availableNames.has(name)),
    ...[...availableNames]
      .filter((name) => !preferredOrder.includes(name))
      .sort(),
  ];

  return {
    columns: orderedNames.map((name) => ({ name, label: formatGameName(name) })),
    rows,
  };
}

export async function getFirebaseScrapedCache(year, month) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return { homepageGames: [], chart: null };

  const monthName = new Intl.DateTimeFormat("en", { month: "long" })
    .format(new Date(year, month - 1, 1));
  const chartDocumentId = `chart_${monthName.toLowerCase()}_${year}`;
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/scraped_cache`;

  const getDocument = async (documentId) => {
    const endpoint = new URL(`${baseUrl}/${documentId}`);
    endpoint.searchParams.set("key", apiKey);
    const response = await fetch(endpoint, { next: { revalidate: 60 } });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Firebase ${documentId} request failed: ${response.status}`);
    }
    return decodeDocumentFields(await response.json());
  };

  const [homepage, chartDocument] = await Promise.all([
    getDocument("homepage"),
    getDocument(chartDocumentId),
  ]);

  const homepageGroups = [
    ...(homepage?.rest || []),
    ...(homepage?.live || []),
    ...(homepage?.next || []),
  ];
  const homepageGameMap = new Map();
  for (const game of homepageGroups) {
    const name = String(game?.name || "").trim();
    if (!name || /show your game/i.test(name)) continue;
    homepageGameMap.set(name.toUpperCase(), {
      name,
      time: String(game.time || "--"),
      yesterday: String(game.yesterday || "--"),
      today: ["", "XX"].includes(String(game.today || "").toUpperCase())
        ? "--"
        : String(game.today),
    });
  }

  const chartColumns = [
    { name: "dswr", label: "Desawar" },
    { name: "dlbz", label: "Delhi Bazar" },
    { name: "srgn", label: "Shri Ganesh" },
    { name: "frbd", label: "Faridabad" },
    { name: "gzbd", label: "Ghaziabad" },
    { name: "gali", label: "Gali" },
  ];
  const chartRows = (chartDocument?.results || [])
    .map((row) => ({
      day: Number(row.date),
      results: Object.fromEntries(
        chartColumns.map(({ name }) => [
          name,
          ["", "XX"].includes(String(row[name] || "").toUpperCase())
            ? "--"
            : String(row[name]),
        ]),
      ),
    }))
    .filter((row) => Number.isFinite(row.day))
    .sort((a, b) => a.day - b.day);

  return {
    homepageGames: [...homepageGameMap.values()],
    chart: chartDocument
      ? {
          month: chartDocument.month || monthName,
          year: chartDocument.year || String(year),
          columns: chartColumns,
          rows: chartRows,
        }
      : null,
  };
}
