

export const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            message: "Autentifikazioa beharrezkoa da"
        });
    }

    // Erabiltzailea eskuragarri uzten dugu ondorengo middlewareetarako
    req.user = req.session.user;
    next();
};
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
export const adminAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/admin/login");
    }

    // Make the user available to next middlewares/routes
    req.user = req.session.user;
    next();
};

