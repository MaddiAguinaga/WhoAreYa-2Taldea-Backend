import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Autentifikatuta dagoen edozeinek
router.get("/", isAuthenticated, (req, res) => {
    res.json({ message: "Jokalariak ikusteko baimena" });
});

// Admin bakarrik
router.post("/", isAuthenticated, authorizeAdmin, (req, res) => {
    res.json({ message: "Jokalaria sortua (admin bakarrik)" });
});

export default router;
