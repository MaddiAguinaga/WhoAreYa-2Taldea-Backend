import express from "express";
import { body } from "express-validator";
import {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getDailySolution
} from "../../controllers/players.controller.js";

import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../../middlewares/role.middleware.js";
import upload from "../../config/multer.js";


const router = express.Router();

/* ========= READ (PUBLIC, LOGIN GABE) ========= */

// GET /api/players/solution/:gameNumber
router.get("/solution/:gameNumber", getDailySolution);

// GET /api/players
//router.get("/", getPlayers);
// GET /players
router.get("/", getPlayers);

// GET /api/players/:id
//router.get("/:id", getPlayerById);
// GET players/:id
router.get("/:id", getPlayerById);

/* ========= WRITE (ADMIN) ========= */

const playerValidation = [
    body("id").isInt(),
    body("name").isLength({ min: 2 }),
    body("birthdate").isISO8601(),
    body("nationality").isLength({ min: 2 }),
    body("teamId").isInt(),
    body("leagueId").isInt(),
    body("position").isIn(["GK", "DF", "MF", "FW"]),
    body("number").optional().isInt({ min: 1, max: 99 }),

];
const updatePlayerValidation = [
    body("name").optional().isLength({ min: 2 }),
    body("birthdate").optional().isISO8601(),
    body("nationality").optional().isLength({ min: 2 }),
    body("teamId").optional().isInt(),
    body("leagueId").optional().isInt(),
    body("position").optional().isIn(["GK", "DF", "MF", "FW"]),
    body("number").optional().isInt({ min: 1, max: 99 })
];


// POST
router.post(
    "/",
    isAuthenticated,
    authorizeAdmin,
    upload.single("image"),
    playerValidation,
    createPlayer
);

//PUT
router.put(
    "/:id",
    isAuthenticated,
    authorizeAdmin,
    upload.single("image"),
    updatePlayerValidation,
    updatePlayer
);


// DELETE
router.delete(
    "/:id",
    isAuthenticated,
    authorizeAdmin,
    deletePlayer
);

export default router;
