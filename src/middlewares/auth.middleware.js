

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

module.exports = { isAuthenticated };
