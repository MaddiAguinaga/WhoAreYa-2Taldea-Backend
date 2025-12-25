
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAYERS_PATH = path.join(__dirname, "../src/public/json/fullplayers25.json");
const FLAGS_DIR = path.join(__dirname, "../src/public/images/flags");
const BASE_URL = "https://playfootball.games/media/nations";

/**
 * Extracts unique nationalities from players list
 */
function getNationalities(players) {
    const set = new Set();
    for (const p of players) {
        if (p?.nationality) set.add(p.nationality.trim());
    }
    return [...set].sort();
}

/**
 * Downloads a single flag and stores it locally
 */
async function downloadFlag(country, outPath) {
    try {
        const encodedCountry = encodeURIComponent(country);
        const url = `${BASE_URL}/${encodedCountry}.svg`;

        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!res.ok) {
            console.log(`status: ${res.status} country: ${country} not found`);
            return;
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(outPath, buffer);
        console.log(`Downloaded: ${country}`);
    } catch (err) {
        console.error(`Error downloading ${country}:`, err.message);
    }
}

/**
 * Main function to download all flags
 */
async function downloadAllFlags() {
    try {
        // Create folder if it does not exist
        await fs.mkdir(FLAGS_DIR, { recursive: true });

        // Read json
        const raw = await fs.readFile(PLAYERS_PATH, "utf8");
        const players = JSON.parse(raw);

        // Obtener nacionalidades únicas
        const countries = getNationalities(players);
        console.log(`Found ${countries.length} unique countries`);

        // Download flags
        for (const country of countries) {
            const outPath = path.join(FLAGS_DIR, `${country}.svg`);

            // Skip if it exists
            if (fsSync.existsSync(outPath)) continue;

            await downloadFlag(country, outPath);
        }

        console.log("All flags downloaded successfully.");
    } catch (err) {
        console.error("Fatal error:", err);
    }
}

export {downloadAllFlags};
