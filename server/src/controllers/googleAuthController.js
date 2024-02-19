
import config from "config";
import googleStrategy from "../services/googleServices/googleAuth";
import passport from "passport";
import { revokeGoogleFitCredentials } from "../services/googleServices/googleAuth.js";
import logger, {formateLoggerMessage} from "../middlewares/logger";

export const createGoogleStrategy = async (req, res, next) => {
    try {
        passport.use(await googleStrategy(req.user.userID));
        next();
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const googleAuth = passport.authenticate("google",
{
    scope: Object.values(JSON.parse(config.get("GOOGLE_SCOPES"))),
    accessType: 'offline',
    expires_in: "30m",
}
);

export const disconnectGoogleFit = async (req, res) => {
    try {
        await revokeGoogleFitCredentials(req.user.userID);
        const message = "Google Fit has been disconnected";
        logger.info(formateLoggerMessage(200, message));
        res.status(200).send(message);
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const googleCallback = passport.authenticate(
    "google", 
    {
        session: false,
        accessType: 'offline',
        prompt: "consent",
        failureRedirect: "/auth/google",
        successRedirect: '/profile'
    }
);