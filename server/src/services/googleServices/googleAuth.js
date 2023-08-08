
import GoogleOAuth20 from "passport-google-oauth20";
import config from "config";
import GoogleFitCredential from "../../models/GoogleFitCredential.js";

const googleStrategy = async (userID) => {

    return new (GoogleOAuth20.Strategy)({
        clientID: config.get("GOOGLE_CLIENT_ID"),
        clientSecret: config.get("GOOGLE_SECRET_KEY"),
        callbackURL: config.get("GOOGLE_CALLBACK_URL")
    },
    async (accessToken, refreshToken, profile, verifyCallback) => {
        try {
            let googleFitCredential = await GoogleFitCredential
            .findOne({userID: userID})
            .sort("date")

            if (!googleFitCredential || googleFitCredential.isRevoked){
                googleFitCredential = new GoogleFitCredential({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userID: userID,
                    isRevoked: false
                });
                
                await googleFitCredential.save();
    
                return verifyCallback(null, googleFitCredential);
            }
            
            return verifyCallback(null, accessToken);
        } catch (error) {
            return verifyCallback(error, null);
        }
    });
}

export default googleStrategy;