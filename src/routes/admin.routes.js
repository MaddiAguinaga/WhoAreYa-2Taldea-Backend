import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import fetch from "node-fetch";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";


const router = express.Router();

/**
 * Middleware specific to the ADMIN WEB PANEL.
 *
 * Purpose:
 * - Check if a session exists
 * - Redirect to /admin/login instead of returning JSON
 *
 * This middleware MUST NOT be reused in the API,
 * because APIs should return JSON, not HTML redirects.
 */
const adminAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/admin/login");
    }

    // Make the user available to next middlewares/routes
    req.user = req.session.user;
    next();
};
const upload = multer({ dest: "tmp/" });

/**
 * GET /admin/login
 * Renders the admin login page (EJS view).
 */
router.get("/login", (req, res) => {
    res.render("admin/login", { error: null });
});

/**
 * POST /admin/login
 *
 * Handles admin login from the WEB form.
 * - Validates credentials
 * - Creates the session in THIS request
 * - Forces session save before redirect
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Invalid credentials (email not found)
        if (!user) {
            return res.render("admin/login", {
                error: "Invalid email or password"
            });
        }

        // Compare plain password with hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render("admin/login", {
                error: "Invalid email or password"
            });
        }

        // Create session (IMPORTANT: done here, not via API)
        req.session.user = {
            id: user._id,
            role: user.role
        };

        /**
         * Force session persistence BEFORE redirecting.
         * This avoids race conditions with express-session.
         */
        req.session.save(() => {
            res.redirect("/admin");
        });

    } catch (error) {
        res.render("admin/login", {
            error: "Unexpected error during login"
        });
    }
});

router.get(
    "/",
    adminAuth,
    authorizeAdmin,
    async (req, res) => {
        try {
            const response = await fetch("http://localhost:3000/api/players");

            if (!response.ok) {
                throw new Error("Failed to fetch players from API");
            }

            const result = await response.json();

            //Extract only the array
            const players = result.data;

            // Check for success messages in query params
            const { success } = req.query;

            res.render("admin/dashboard", {
                players,
                success
            });


        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading admin dashboard");
        }
    }
);


/**
 * GET /admin/logout
 *
 * Destroys the session and redirects to the login page.
 */
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});

/**
 * GET /admin/players/new
 * Render form to create a new player
 */
router.get(
    "/players/new",
    adminAuth,
    authorizeAdmin,
    (req, res) => {
        res.render("admin/new-player");
    }
);
/**
 * POST /admin/players/new
 * Creates a player using the API
 */

router.post(
    "/players/new",
    adminAuth,
    authorizeAdmin,
    upload.single("image"),
    async (req, res) => {
        try {
            const formData = new FormData();

            // Text fields
            for (const key in req.body) {
                formData.append(key, req.body[key]);
            }

            // Image
            if (req.file) {
                formData.append(
                    "image",
                    fs.createReadStream(req.file.path)
                );
            }

            const response = await fetch(
                "http://localhost:3000/api/players",
                {
                    method: "POST",
                    headers: {
                        cookie: req.headers.cookie
                    },
                    body: formData
                }
            );

            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }

            if (!response.ok) {
                const text = await response.text();
                console.error("API ERROR:", text);
                return res.status(response.status).send(text);
            }

            res.redirect("/admin?success=player_created");

        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating player");
        }
    }
);


/**
 * GET /admin/players/edit/:id
 * Render edit player form
 */
router.get(
    "/players/edit/:id",
    adminAuth,
    authorizeAdmin,
    async (req, res) => {
        try {
            const playerId = req.params.id;

            const response = await fetch(
                `http://localhost:3000/api/players/${playerId}`,
                {
                    headers: {
                        cookie: req.headers.cookie
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch player from API");
            }

            const result = await response.json();
            const player = result.data;

            res.render("admin/edit-player", { player });

        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading edit player form");
        }
    }
);
/**
 * PUT /admin/players/edit/:id
 * (Implemented as POST because HTML forms do not support PUT)
 * Calls PUT /api/players/:id
 */
router.post(
    "/players/edit/:id",
    adminAuth,
    authorizeAdmin,
    upload.single("image"),
    async (req, res) => {
        try {
            const playerId = req.params.id;

            const formData = new FormData();

            // Add text fields
            for (const key in req.body) {
                formData.append(key, req.body[key]);
            }

            // Add image if uploaded
            if (req.file) {
                formData.append(
                    "image",
                    fs.createReadStream(req.file.path)
                );
            }

            const response = await fetch(
                `http://localhost:3000/api/players/${playerId}`,
                {
                    method: "PUT",
                    headers: {
                        cookie: req.headers.cookie
                    },
                    body: formData
                }
            );
            // Clean up temp file
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }

            if (!response.ok) {
                const text = await response.text();
                console.error("API ERROR:", text);
                return res.status(response.status).send(text);
            }

            res.redirect("/admin?success=player_updated");

        } catch (error) {
            console.error(error);
            res.status(500).send("Error updating player");
        }
    }
);


/**
 * DELETE /admin/players/delete/:id
 * (Implemented as POST because HTML forms do not support DELETE)
 * Calls DELETE /api/players/:id
 */
router.post(
    "/players/delete/:id",
    adminAuth,
    authorizeAdmin,
    async (req, res) => {
        try {
            const playerId = req.params.id;

            const response = await fetch(
                `http://localhost:3000/api/players/${playerId}`,
                {
                    method: "DELETE",
                    headers: {
                        cookie: req.headers.cookie
                    }
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("API ERROR:", text);
                return res.status(response.status).send(text);
            }


            res.redirect("/admin?success=player_deleted");


        } catch (error) {
            console.error(error);
            res.status(500).send("Error deleting player");
        }
    }
);




export default router;
