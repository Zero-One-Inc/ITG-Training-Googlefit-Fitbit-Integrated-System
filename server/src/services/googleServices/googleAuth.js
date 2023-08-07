
import GoogleOAuth20 from "passport-google-oauth20";
import config from "config";
import User from "../../models/Users.js";

const googleStratigy = async (userID) => {
    return GoogleOAuth20.Strategy({
        clientID: config.get("GOOGLE_CLIENT_ID"),
        clientSecret: config.get("GOOGLE_SECRET_KEY"),
        callbackURL: "GOOGLE_CALLBACK_URL"
    },
    async (accessToken, refreshToken, profile, verifyCallback) => {
        let user = await User.findOne({
            googleFitToken: accessToken
        });

        if (!user){
            user = await User.findById(userID);

            if (!user){
                return verifyCallback(err, fasle);
            }

            user.set({
                googleAuthinticate: accessToken,
            })

            return verifyCallback(err, user);
        }

        return verifyCallback(err, user);
    });
}

export default googleStratigy;