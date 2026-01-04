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

// GET /api/players
// query params gabe --> Auto-osaketarako, jokalari guztiak bueltatu [6.5]
// GET /api/players?page=1&limit=10
// query params-en page eta limit badaude --> Orrialde-banaketa [6.1]
// Jokalari guztiak zerrendatzen dira, orrialde-banaketarekin
export const getPlayers = async (req, res) => {
    try {

        const { page, limit } = req.query;

        // Auto-osaketarako [6.5]
        if (!page && !limit) {
            const players = await Player.find();

            return res.status(200).json({
                success: true,
                data: players,
                message: "Jokalari guztiak lortu dira (jokorako)"
            });
        }

        // orrialde-banaketa [6.1]
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const players = await Player.find().skip(skip).limit(limitNum);
        const total = await Player.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                page: pageNum,
                limit: limitNum,
                total,
                players
            },
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
        const playerData = { ...req.body };

        playerData.id = Number(playerData.id);
        playerData.teamId = Number(playerData.teamId);
        playerData.leagueId = Number(playerData.leagueId);

        if (playerData.number) {
            playerData.number = Number(playerData.number);
        }


        if (req.file) {
            playerData.imageUrl = `/images/players/${req.file.filename}`;
        }

        playerData.flagUrl = `/images/flags/${playerData.nationality}.svg`;

        const player = await Player.create(playerData);

        res.status(201).json({
            success: true,
            data: player,
            message: "Jokalaria arrakastaz sortua"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Errorea jokalaria sortzean"
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
        // Datuak testutik hartzen ditugu
        const updateData = { ...req.body };

        // Irudia bidali bada, imageUrl eguneratu
        if (req.file) {
            updateData.imageUrl = `/images/players/${req.file.filename}`;
        }

        const player = await Player.findOneAndUpdate(
            { id: req.params.id },
            updateData,
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


// GET /api/solution/:gameNumber
export const getDailySolution = async (req, res) => {
    try {
        const gameNumber = parseInt(req.params.gameNumber);

        if (isNaN(gameNumber)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_GAME_NUMBER",
                    message: "Game number baliogabea"
                }
            });
        }

        const players = await Player.find();

        if (players.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "NO_PLAYERS",
                    message: "Ez dago jokalaririk datu-basean"
                }
            });
        }

        const index = gameNumber % players.length;
        const solution = players[index];

        res.status(200).json({
            success: true,
            data: solution,
            message: "Eguneko jokalaria lortu da"
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
