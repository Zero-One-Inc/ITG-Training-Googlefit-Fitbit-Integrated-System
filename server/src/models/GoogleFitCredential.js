
import mongoose from "mongoose";

const googleFitCredentialSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        minlength: 8,
        maxlength: 255,
    },
    refreshToken: {
        type: String,
        minlength: 8,
        maxlength: 255,
    },
    userID: {
        type: mongoose.Types.ObjectId,
        minlength: 8,
        maxlength: 255,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isRevoked: {
        type: Boolean,
        default: false,
        required: true
    }
});

const GoogleFitCredential = mongoose.model("GoogleFitCredential", googleFitCredentialSchema);

export default GoogleFitCredential;