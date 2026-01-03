import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

import Player from "../src/models/Player.js";
import Team from "../src/models/Team.js";
import League from "../src/models/League.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB-ra konektatua");

        // Jokalarien json-a irakurri
        const filePath = path.join("src", "public", "json", "fullplayers25.json");
        const raw = await fs.readFile(filePath, "utf8");
        const playersData = JSON.parse(raw);

        // Bildumak garbitu
        await Player.deleteMany();
        await Team.deleteMany();
        await League.deleteMany();

        // Jokalarien bilduma datuekin bete
        playersData.forEach(p => {
            // jokalariaren irudiaren url-a
            p.imageUrl = `/images/players/${p.id}.png`;
            p.flagUrl = `/images/flags/${p.nationality}.svg`;
        });
        await Player.insertMany(playersData);
        console.log(`${playersData.length} jokalari sartu dira.`);

        // Taldeak sortu eta Taldeen bilduma bete
        const teamMap = new Map();
        playersData.forEach(p => {
            if (!teamMap.has(p.teamId)) {
                teamMap.set(p.teamId, {
                    id: p.teamId,
                    name: `Team ${p.teamId}`,
                    leagueId: p.leagueId,
                    logoUrl: `/images/teams/${p.teamId}.png`,
                    country: "",
                    stadium: ""
                });
            }
        });
        const teams = Array.from(teamMap.values());
        await Team.insertMany(teams);
        console.log(`${teams.length} talde sartu dira.`);

        // leagueId → ligari buruzko informazio osoa
        const leagueInfoMap = {
            564: { name: "La Liga", flag: "/images/leagues/es1.png", country: "Spain", code: "ESP" },
            8:   { name: "Premier League", flag: "/images/leagues/en1.png", country: "England", code: "ENG" },
            82:  { name: "Bundesliga", flag: "/images/leagues/de1.png", country: "Germany", code: "GER" },
            384: { name: "Serie A", flag: "/images/leagues/it1.png", country: "Italy", code: "ITA" },
            301: { name: "Ligue 1", flag: "/images/leagues/fr1.png", country: "France", code: "FRA" }
        };

        // Ligak sortu
        const leagueMap = new Map();
        playersData.forEach(p => {
            if (!leagueMap.has(p.leagueId)) {
                const info = leagueInfoMap[p.leagueId] || {
                    name: `League ${p.leagueId}`,
                    image: "/images/leagues/unknown.svg",
                    country: "Unknown",
                    code: "UNK"
                };
                leagueMap.set(p.leagueId, {
                    id: p.leagueId,
                    name: info.name,
                    code: info.code,
                    country: info.country,
                    imageUrl: info.flag
                });
            }
        });

        const leagues = Array.from(leagueMap.values());
        await League.insertMany(leagues);
        console.log(`${leagues.length} liga sartu dira.`);


        await mongoose.connection.close();
        console.log("Bildumak bete dira eta konexioa datu basearekin itxi da.");
        process.exit(0);
    } catch (error) {
        console.error("Errorea bildumak betetzerakoan:", error);
        process.exit(1);
    }
};

seedDatabase();
