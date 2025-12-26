// Usage : node scripts/downloadAllImages.js
import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import pLimit from "p-limit";

const PLACEHOLDER_URL = "https://t4.ftcdn.net/jpg/17/05/36/57/360_F_1705365711_OCNEQZZ7C7W9DchkllvJpZ7dcPGMTPeZ.jpg";

async function downloadAllImages({ source, outputDir, buildUrl, buildFilename, skipIfExists = true, usePlaceholder = false }) {
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
                    if (usePlaceholder) {
                        const placeholderRes = await fetch(PLACEHOLDER_URL);
                        const buffer = Buffer.from(await placeholderRes.arrayBuffer());
                        await fsp.writeFile(outPath, buffer);
                        console.log(`Placeholder saved: ${filename}`);
                    }
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

async function downloadAllImagesThrottled({ source, outputDir, buildUrl, buildFilename, skipIfExists = true, concurrency = 10, usePlaceholder = false }) {
    try {
        const items = await source();
        await fsp.mkdir(outputDir, { recursive: true });

        const limit = pLimit(concurrency);

        const tasks = items.map(item =>
            limit(async () => {
                const filename = buildFilename(item);
                const outPath = path.join(outputDir, filename);

                if (skipIfExists && fs.existsSync(outPath)) return;

                try {
                    const res = await fetch(buildUrl(item), {
                        headers: {
                            "User-Agent": "Mozilla/5.0",
                            "Accept": "image/png,image/svg+xml"
                        }
                    });

                    if (!res.ok) {
                        console.log(`HTTP ${res.status} → ${item}`);
                        if (usePlaceholder) {
                            const placeholderRes = await fetch(PLACEHOLDER_URL);
                            const buffer = Buffer.from(await placeholderRes.arrayBuffer());
                            await fsp.writeFile(outPath, buffer);
                            console.log(`Placeholder saved: ${filename}`);
                        }
                        return;
                    }

                    const buffer = Buffer.from(await res.arrayBuffer());
                    await fsp.writeFile(outPath, buffer);

                    console.log(`OK: ${filename}`);
                } catch (err) {
                    console.error(`Error with ${item}:`, err.message);
                }
            })
        );

        await Promise.all(tasks);
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
        buildFilename: c => `${c}.svg`,
        usePlaceholder: true
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
        buildFilename: l => `${l}.png`,
        usePlaceholder: true
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
        buildFilename: id => `${id}.png`,
        usePlaceholder: true
    });

    // PLAYERS (with throttling)
    await downloadAllImagesThrottled({
        source: async () => {
            const raw = await fsp.readFile("src/public/json/fullplayers25.json", "utf8");
            const players = JSON.parse(raw);
            return players.map(p => p.id).filter(Boolean);
        },
        outputDir: "src/public/images/players",
        buildUrl: id => {
            const dir = Number(id) % 32;
            return `https://playfootball.games/media/players/${dir}/${id}.png`;
        },
        buildFilename: id => `${id}.png`,
        concurrency: 10,
        usePlaceholder: true
    });

})();