
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAYERS_PATH = path.join(__dirname, "../src/public/json/fullplayers25.json");
const FLAGS_DIR = path.join(__dirname, "../src/public/images/flags");
const BASE_URL = "https://playfootball.games/media/nations";

function getNationalities(players) {
    const set = new Set();
    for (const p of players) {
        if (p?.nationality) set.add(p.nationality.trim());
    }
    return [...set].sort();
}

async function downloadFlag(country, outPath) {
    const encodedCountry = encodeURIComponent(country);
    const url = `${BASE_URL}/${encodedCountry}.svg`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "image/svg+xml"
        }
    });

    if (!res.ok) {
        console.log(`FAIL ${res.status}: ${country}`);
        return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Evitar guardar archivos vacíos
    if (buffer.length < 100) {
        console.log(`EMPTY FILE: ${country}`);
        return;
    }

    await fs.writeFile(outPath, buffer);
    console.log(`OK: ${country}`);
}

async function main() {
    await fs.mkdir(FLAGS_DIR, { recursive: true });

    const raw = await fs.readFile(PLAYERS_PATH, "utf8");
    const players = JSON.parse(raw);

    const countries = getNationalities(players);
    console.log(`Found ${countries.length} unique countries`);

    for (const country of countries) {
        const outPath = path.join(FLAGS_DIR, `${country}.svg`);

        if (fsSync.existsSync(outPath) && fsSync.statSync(outPath).size > 100) {
            continue;
        }

        await downloadFlag(country, outPath);
    }

    console.log("DONE");
}

main();
