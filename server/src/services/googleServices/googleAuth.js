
import GoogleOAuth20 from "passport-google-oauth20";
import config from "config";
import GoogleFitCredential from "../../models/GoogleFitCredential.js";
import axios from "axios";
import logger, {formateLoggerMessage} from "../../middlewares/logger.js";

const googleStrategy = async (userID) => {
    return new (GoogleOAuth20.Strategy)({
        clientID: config.get("GOOGLE_CLIENT_ID"),
        clientSecret: config.get("GOOGLE_SECRET_KEY"),
        callbackURL: config.get("GOOGLE_CALLBACK_URL"),
        pkce: true,
        state: true,
    },
    async (accessToken, refreshToken, profile, verifyCallback) => {
        try {
            let googleFitCredential = await GoogleFitCredential
            .findOne({userID: userID})
            .sort("date");

            if (!googleFitCredential){
                googleFitCredential = new GoogleFitCredential({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userID: userID
                });
                
                await googleFitCredential.save();
                
                const message = "Google Fit credential saved successfully.";
                logger.info(200, message);

                return verifyCallback(null, googleFitCredential);
            }
            
            return verifyCallback(null, accessToken);
        } catch (error) {
            const errorMessage = "Google Fit credential error: " + error.message;;
            logger.info(500, errorMessage);

            return verifyCallback(error, null);
        }
    });
}

export const getGoogleFitCredential = async (userID) => {
    let googleFitCredential = await GoogleFitCredential
        .findOne({userID: userID})
        .sort("date");

        if (!googleFitCredential){
            return null;
        }
        
        return googleFitCredential;
}

export const getNewGoogleAccessToken = async (googleFitCredential) => {
    try {
        const response = await axios({
            method: "post",
            url: config.get("GOOGLE_RENEW_ACCESS_TOKEN_URL"),
            data: {
                client_id: config.get("GOOGLE_CLIENT_ID"),
                client_secret: config.get("GOOGLE_SECRET_KEY"),
                refresh_token: googleFitCredential.refreshToken,
                grant_type: "refresh_token",
            }
        });
        
        googleFitCredential.accessToken = response.data.access_token;
        
        await googleFitCredential.save();

        return googleFitCredential;
    } catch (error) {

        logger.error(formateLoggerMessage(500, error.message));
        await googleFitCredential.deleteOne();
        return null;
    }
}

export const revokeGoogleFitCredentials = async(userID) => {
    try {
        let googleFitCredential = await GoogleFitCredential
        .findOne({userID: userID})
        .sort("date")

        if (!googleFitCredential){
            return;
        }
        await googleFitCredential.deleteOne();   
    } catch (error) {
        throw new Error("Couldn't revoke Google Fit credential.");
    }
}

export default googleStrategy;