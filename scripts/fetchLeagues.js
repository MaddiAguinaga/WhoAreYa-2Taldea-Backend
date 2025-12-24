const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const fetch = require("node-fetch");


(async () => {

    // datuak src/public/images/leagues karpetan gorde
    const writepath = path.join(__dirname, "..", "public", "images", "leagues");

    try {
        //  create directory
        await fs.mkdir(writepath, { recursive: true });

        // "leagues.txt" irakurri
        const leaguesFile = path.join(__dirname, "..", "leagues.txt");
        const content = await fs.readFile(leaguesFile, "utf8");
        const data = content.split("\n");

        data.forEach( (elem, idx) => {
            const url = `https://playfootball.games/media/competitions/${elem}.png`
            fetch(url)
            .then(res => {
                // check status
                if (res.status === 200) {
                    res.body.pipe(fsSync.createWriteStream(path.join(writepath, `${elem}.png`)));
                    } else {
                    console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`)
                    }
                })
            .catch(err => console.log(err))
            })
        } catch (err) {
        console.error(err);
        }

})();
