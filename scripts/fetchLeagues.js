import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writepath = path.join(__dirname, "../src/public/images/leagues");
const leaguesFile = path.join(__dirname, "../src/public/txt/leagues.txt");

try {
    await fsPromises.mkdir(writepath, { recursive: true });

    // Read leagues.txt
    const content = await fsPromises.readFile(leaguesFile, "utf8");
    const data = content
        .replace(/^\uFEFF/, "")
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    data.forEach((elem, idx) => {
        const url = `https://playfootball.games/media/competitions/${elem}.png`;

        fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/png"
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const fileStream = fs.createWriteStream(path.join(writepath, `${elem}.png`));
                    res.body.pipe(fileStream);
                    console.log(`Downloaded: ${elem}.png`);
                } else {
                    console.log(`status: ${res.status} line: ${idx} league: ${elem} not found`);
                }
            })
            .catch(err => console.log(`Error downloading ${elem}:`, err.message));
    });
} catch (err) {
    console.error("General error:", err);
}
