import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
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
    code: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10
    },
    country: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    flagUrl: {
        type: String,
        required: true
    }
});

export default mongoose.model("League", leagueSchema);
