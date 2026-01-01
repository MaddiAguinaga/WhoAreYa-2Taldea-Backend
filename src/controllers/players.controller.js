import Player from "../models/Player.js";
import { validationResult } from "express-validator";

/*
HTTP Codes:
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

        const players = await Player.find().skip(skip).limit(limit);
        const total = await Player.countDocuments();

        res.status(200).json({
            success: true,
            data: { page, limit, total, players },
            message: "Jokalariak arrakastaz lortu dira"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "Zerbitzariaren errorea"
            }
        });
    }
};

// IDaren arabera, jokalari espezifiko bat lortu
// GET /api/players/:id
export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findOne({ id: req.params.id });

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Jokalaria ez da aurkitu"
                }
            });
        }

        res.status(200).json({
            success: true,
            data: player,
            message: "Jokalaria arrakastaz lortu da"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "ID baliogabea"
            }
        });
    }
};

// Jokalari berri bat sortu (admin bakarrik)
// POST /api/players
export const createPlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Datu baliogabeak",
                details: errors.array()
            }
        });
    }

    try {
        const existing = await Player.findOne({ id: req.body.id });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "ID jada existitzen da"
                }
            });
        }

        const player = await Player.create(req.body);
        res.status(201).json({
            success: true,
            data: player,
            message: "Jokalaria arrakastaz sortua"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "Zerbitzariaren errorea"
            }
        });
    }
};

// Jokalari bat eguneratu (admin bakarrik)
// PUT /api/players/:id
export const updatePlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Datu baliogabeak",
                details: errors.array()
            }
        });
    }

    try {
        const player = await Player.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Jokalaria ez da aurkitu"
                }
            });
        }

        res.status(200).json({
            success: true,
            data: player,
            message: "Jokalaria arrakastaz eguneratua"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "ID baliogabea"
            }
        });
    }
};

// Jokalari bat ezabatzen du (admin bakarrik)
// DELETE /api/players/:id
export const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findOneAndDelete({ id: req.params.id });

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Jokalaria ez da aurkitu"
                }
            });
        }

        res.status(200).json({
            success: true,
            data: null,
            message: "Jokalaria arrakastaz ezabatua"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "ID baliogabea"
            }
        });
    }
};
