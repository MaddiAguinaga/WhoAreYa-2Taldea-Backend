import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import fetch from "node-fetch";

const OUTPUT_DIR = path.join("public", "images", "teams");
const TEAM_IDS_FILE = path.join(__dirname, "../public/json/txt/teamIDs.txt");
const BASE_URL = "https://cdn.sportmonks.com/images/soccer/teams";

async function downloadTeamLogos() {
  try {
    // Helburu karpeta sortu (existitzen ez bada)
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // teamIDs.txt irakurri
    const content = await fs.readFile(TEAM_IDS_FILE, "utf8");
    const teamIds = content.split("\n").filter(Boolean);

    for (const teamId of teamIds) {
      const dir = Number(teamId) % 32;
      const url = `${BASE_URL}/${dir}/${teamId}.png`;
      const outputPath = path.join(OUTPUT_DIR, `${teamId}.png`);

      try {
        const res = await fetch(url);

        if (!res.ok) {
          console.log(`${teamId} -> HTTP ${res.status}`);
          continue;
        }

        const fileStream = fsSync.createWriteStream(outputPath);
        res.body.pipe(fileStream);

        await new Promise((resolve, reject) => {
          fileStream.on("finish", resolve);
          fileStream.on("error", reject);
        });

        console.log(` Deskargatua: ${teamId}.png`);
      } catch (err) {
        console.error(`Errorea ${teamId}-rekin:`, err.message);
      }
    }
  } catch (err) {
    console.error("Errore orokorra:", err);
  }
}

module.exports = { downloadTeamLogos };
