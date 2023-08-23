
import mongoose from "mongoose";
import User from "./Users";

const fitbitCredentialSchema = new mongoose.Schema({
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const FitbitCredential = mongoose.model("FitbitCredential", fitbitCredentialSchema);

export default FitbitCredential;