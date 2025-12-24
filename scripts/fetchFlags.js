

import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";


const PLAYERS_PATH = path.join(
    process.cwd(),
    "src",
    "public",
    "json",
    "fullplayers25.json"
);

const FLAGS_DIR = path.join(
    process.cwd(),
    "src",
    "public",
    "images",
    "flags"
);

/**
 * Extracts unique nationalities from players list
 */
function getNationalities(players) {
    const set = new Set();

    for (const p of players) {
        if (p && p.nationality) {
            set.add(p.nationality.trim());
        }
    }

    return [...set].sort();
}

/**
 * Downloads a single flag and stores it locally
 */
async function downloadFlag(country, outPath) {
    const encodedCountry = encodeURIComponent(country);
    const url = `https://playfootball.games/media/nations/${encodedCountry}.svg`;

    const res = await fetch(url);

    if (res.status !== 200) {
        console.log(`status: ${res.status} country: ${country} not found`);
        return;
    }

    // Node 18+ fetch -> Web Stream
    const buffer = Buffer.from(await res.arrayBuffer());
    await fsp.writeFile(outPath, buffer);

    console.log(`OK: ${country}`);
}

/**
 * Main execution
 */
async function main() {
    try {
        // 1) Create output directory if it does not exist
        await fsp.mkdir(FLAGS_DIR, { recursive: true });

        // 2) Read players JSON
        const raw = await fsp.readFile(PLAYERS_PATH, "utf8");
        const players = JSON.parse(raw);

        // 3) Get unique nationalities
        const countries = getNationalities(players);
        console.log(`Found ${countries.length} unique countries`);

        // 4) Download flags
        for (const country of countries) {
            const outPath = path.join(FLAGS_DIR, `${country}.svg`);

            // Skip if already downloaded
            if (fs.existsSync(outPath)) continue;

            try {
                await downloadFlag(country, outPath);
            } catch (err) {
                console.log(
                    `Error downloading ${country}:`,
                    err?.message ?? err
                );
            }
        }

        console.log("Done.");
    } catch (err) {
        console.error("Fatal error:", err);
    }
}

// Run script
main();
