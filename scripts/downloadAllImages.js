// Usage : node scripts/downloadAllImages.js
import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";

async function downloadAllImages({ source, outputDir, buildUrl, buildFilename, skipIfExists = true }) {
    try {
        const items = await source();

        await fsp.mkdir(outputDir, { recursive: true });

        for (const item of items) {
            const filename = buildFilename(item);
            const outPath = path.join(outputDir, filename);

            if (skipIfExists && fs.existsSync(outPath)) continue;

            try {
                const res = await fetch(buildUrl(item), {
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "image/png,image/svg+xml"
                    }
                });

                if (!res.ok) {
                    console.log(`HTTP ${res.status} → ${item}`);
                    continue;
                }

                const buffer = Buffer.from(await res.arrayBuffer());
                await fsp.writeFile(outPath, buffer);

                console.log(`OK: ${filename}`);
            } catch (err) {
                console.error(`Error with ${item}:`, err.message);
            }
        }
    } catch (err) {
        console.error("General error:", err);
    }
}

(async () => {

    // FLAGS
    await downloadAllImages({
        source: async () => {
            const raw = await fsp.readFile("src/public/json/fullplayers25.json", "utf8");
            const players = JSON.parse(raw);
            return [...new Set(players.map(p => p?.nationality).filter(Boolean))];
        },
        outputDir: "src/public/images/flags",
        buildUrl: c => `https://playfootball.games/media/nations/${encodeURIComponent(c)}.svg`,
        buildFilename: c => `${c}.svg`
    });

    // LEAGUES
    await downloadAllImages({
        source: async () => {
            const content = await fsp.readFile("src/public/txt/leagues.txt", "utf8");
            return content
                .split("\n")
                .map(l => l.trim())
                .filter(Boolean);
        },
        outputDir: "src/public/images/leagues",
        buildUrl: l => `https://playfootball.games/media/competitions/${l}.png`,
        buildFilename: l => `${l}.png`
    });

    // TEAM LOGOS
    await downloadAllImages({
        source: async () => {
            const content = await fsp.readFile("src/public/txt/teamIDs.txt", "utf8");
            return content
                .replace(/^\uFEFF/, "")
                .split("\n")
                .map(id => id.replace(/[^\d]/g, '').trim())
                .filter(id => id.length > 0);
        },
        outputDir: "src/public/images/teams",
        buildUrl: id => {
            const dir = Number(id) % 32;
            return `https://cdn.sportmonks.com/images/soccer/teams/${dir}/${id}.png`;
        },
        buildFilename: id => `${id}.png`
    });

})();
