import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const OUTPUT_DIR = path.join(__dirname, "../src/public/images/teams");
const TEAM_IDS_FILE = path.join(__dirname, "../src/public/txt/teamIDs.txt");
const BASE_URL = "https://cdn.sportmonks.com/images/soccer/teams";

async function downloadTeamLogos() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const content = await fs.readFile(TEAM_IDS_FILE, "utf8");
    const teamIds = content
        .replace(/^\uFEFF/, "")
        .split("\n")
        .map(id => id.replace(/[^\d]/g, "").trim())
        .filter(id => id.length > 0);

    for (const teamId of teamIds) {
      const dir = Number(teamId) % 32;
      const url = `${BASE_URL}/${dir}/${teamId}.png`;
      const outputPath = path.join(OUTPUT_DIR, `${teamId}.png`);

      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "image/png"
          }
        });

        if (!res.ok) {
          console.log(`${teamId} -> HTTP ${res.status}`);
          continue;
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(outputPath, buffer);

        console.log(`Downloaded: ${teamId}.png`);
      } catch (err) {
        console.error(`Error with ${teamId}:`, err.message);
      }
    }

    console.log("Download of team logos completed.");
  } catch (err) {
    console.error("General error:", err);
  }
}

export { downloadTeamLogos };
