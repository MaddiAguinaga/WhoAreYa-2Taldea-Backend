
export const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Autentifikazioa beharrezkoa da"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Ez duzu baimenik (Admin bakarrik)"
        });
    }

    next();
};
