import * as cheerio from "cheerio";

const TARGET_GAMES = [
    { name: "DELHI BAZAR", pattern: /delhi\s*baz[ao]r/i },
    { name: "SHRI GANESH", pattern: /shr(?:i|ee)?\s*ganesh/i },
    { name: "FARIDABAD", pattern: /faridabad/i },
    { name: "GHAZIABAD", pattern: /ga(?:z|zh|zi)y?iabad/i },
    { name: "GALI", pattern: /^gali$/i },
    { name: "DISAWER", pattern: /d(?:i|e)saw(?:e|a)r/i },
];

const normalizeText = (value) => value.trim().replace(/\s+/g, " ");

const getCanonicalName = (value) => {
    const normalized = normalizeText(value);
    return TARGET_GAMES.find(({ pattern }) => pattern.test(normalized))?.name;
};

const normalizeResult = (value) => {
    const result = normalizeText(value);
    return /^\d{1,3}$/.test(result) ? result : "--";
};

export function parseA7SattaGames(html) {
    const $ = cheerio.load(html);
    const games = [];

    $("table tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 3) return;

        const nameElement = $(cells[0]).find(".gamenameeach").first();
        const sourceName = nameElement.text().trim();
        const name = getCanonicalName(sourceName);
        if (!name) return;

        const firstCellText = normalizeText($(cells[0]).text());
        const time = firstCellText
            .slice(sourceName.length)
            .match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)?.[0];
        if (!time) return;

        games.push({
            name,
            time: normalizeText(time).toUpperCase(),
            yesterdayResult: normalizeResult($(cells[1]).text()),
            todayResult: normalizeResult($(cells[2]).text()),
        });
    });

    // Disawer is rendered in a separate highlighted card, not in the table.
    $(".sattadividerr").each((_, section) => {
        const sourceName = $(section).find("h4").first().text();
        const name = getCanonicalName(sourceName);
        if (name !== "DISAWER") return;

        const time = $(section)
            .find("p")
            .first()
            .text()
            .match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)?.[0];
        const resultParts = $(section)
            .find("strong")
            .first()
            .contents()
            .filter((_, node) => node.type === "text")
            .map((_, node) => normalizeResult($(node).text()))
            .get()
            .filter((result) => result !== "--");

        if (time) {
            games.push({
                name,
                time: normalizeText(time).toUpperCase(),
                yesterdayResult: resultParts[0] ?? "--",
                todayResult: resultParts[1] ?? "--",
            });
        }
    });

    return [...new Map(games.map((game) => [game.name, game])).values()];
}
