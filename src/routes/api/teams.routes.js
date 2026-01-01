import express from "express";
import { getTeams } from "../../controllers/teams.controller.js";

const router = express.Router();

// GET /api/teams - publiko
router.get("/", getTeams);

export default router;
