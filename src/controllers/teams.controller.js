import Team from "../models/Team.js";

// GET /api/teams
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find();

        res.status(200).json({
            success: true,
            data: teams,
            message: "Taldeak arrakastaz lortu dira"
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
