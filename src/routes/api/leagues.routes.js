import express from "express";
import { getLeagues } from "../../controllers/leagues.controller.js";

const router = express.Router();

// GET /api/leagues - publiko
router.get("/", getLeagues);

export default router;
