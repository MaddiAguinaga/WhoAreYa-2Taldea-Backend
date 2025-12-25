import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../src/public/images/leagues");
const LEAGUES_FILE = path.join(__dirname, "../src/public/txt/leagues.txt");
const BASE_URL = "https://playfootball.games/media/competitions";

async function downloadLeagueLogos() {
    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Leer leagues.txt
        const content = await fs.readFile(LEAGUES_FILE, "utf8");
        const leagues = content
            .replace(/^\uFEFF/, "")
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        for (const [idx, league] of leagues.entries()) {
            const url = `${BASE_URL}/${league}.png`;
            const outputPath = path.join(OUTPUT_DIR, `${league}.png`);

            try {
                const res = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "image/png"
                    }
                });

                if (!res.ok) {
                    console.log(`status: ${res.status} line: ${idx} league: ${league} not found`);
                    continue;
                }

                const buffer = Buffer.from(await res.arrayBuffer());
                await fs.writeFile(outputPath, buffer);
                console.log(`Downloaded: ${league}.png`);
            } catch (err) {
                console.error(`Error downloading ${league}:`, err.message);
            }
        }

        console.log("Download of league logos completed.");
    } catch (err) {
        console.error("General error:", err);
    }
}

export {downloadLeagueLogos };
