import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    leagueId: {
        type: Number,
        required: true
    },
    logoUrl: {
        type: String
    },
    country: {
        type: String
    },
    stadium: {
        type: String
    }
});

export default mongoose.model("Team", teamSchema);
