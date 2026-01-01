import Player from "../models/Player.js";
import { validationResult } from "express-validator";

/*
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
*/


// Jokalari guztiak zerrendatzen dira, orrialde-banaketarekin
// GET /api/players?page=1&limit=10
export const getPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const players = await Player.find()
            .skip(skip)
            .limit(limit);

        const total = await Player.countDocuments();

        res.status(200).json({
            page,
            limit,
            total,
            players
        });
    } catch (error) {
        res.status(500).json({ message: "Zerbitzariaren errorea" });
    }
};

// IDaren arabera, jokalari espezifiko bat lortu
// GET /api/players/:id  (zenbakizko id, ez _id)
export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findOne({ id: req.params.id });

        if (!player) {
            return res.status(404).json({ message: "Baliabidea ez da aurkitu" });
        }

        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: "ID baliogabea" });
    }
};

// Jokalari berri bat sortu. admin rola behar du
// POST /api/players (admin)
export const createPlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const existing = await Player.findOne({ id: req.body.id });
        if (existing) {
            return res.status(400).json({ message: "ID jada existitzen da" });
        }

        const player = await Player.create(req.body);
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ message: "Zerbitzariaren errorea" });
    }
};

// Jokalari batean eremu guztiak eguneratzen ditu. admin rola behar du
// PUT /api/players/:id (admin)
export const updatePlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const player = await Player.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!player) {
            return res.status(404).json({ message: "Baliabidea ez da aurkitu" });
        }

        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: "ID baliogabea" });
    }
};

// Jokalari bat ezabatzen du. admin rola behar du
// DELETE /api/players/:id (admin)
export const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findOneAndDelete({ id: req.params.id });

        if (!player) {
            return res.status(404).json({ message: "Baliabidea ez da aurkitu" });
        }

        res.status(200).json({ message: "Jokalaria ezabatuta" });
    } catch (error) {
        res.status(400).json({ message: "ID baliogabea" });
    }
};
