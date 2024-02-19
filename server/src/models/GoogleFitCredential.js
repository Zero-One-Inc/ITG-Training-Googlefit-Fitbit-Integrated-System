
import mongoose from "mongoose";

const googleFitCredentialSchema = new mongoose.Schema({
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

const GoogleFitCredential = mongoose.model("GoogleFitCredential", googleFitCredentialSchema);

export default GoogleFitCredential;