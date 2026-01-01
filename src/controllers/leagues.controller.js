import League from "../models/League.js";

// GET /api/leagues
export const getLeagues = async (req, res) => {
    try {
        const leagues = await League.find();

        res.status(200).json({
            success: true,
            data: leagues,
            message: "Ligak arrakastaz lortu dira"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Zerbitzariaren errorea"
            }
        });
    }
};
