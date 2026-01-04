import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
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
    birthdate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    teamId: {
        type: Number,
        required: true
    },
    leagueId: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true,
        enum: ["GK", "DF", "MF", "FW"]
    },
    number: {
        type: Number,
        min: 1,
        max: 99
    },
    imageUrl: {
        type: String,
        required: true
    },
    flagUrl: {
        type: String,
        required: true
    }
});

export default mongoose.model("Player", playerSchema);
