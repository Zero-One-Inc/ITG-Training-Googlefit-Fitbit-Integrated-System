import FitbitCredential from "../models/FitbitCredentials";
import GoogleFitCredential from "../models/GoogleFitCredential"
import logger, { formateLoggerMessage } from "./logger";

export const checkGoogleFitConnection = async (req, res, next) => {
    try {
        const googleCredential = await GoogleFitCredential
        .findOne({userID: req.user.userID})
        .sort("date");

        if (!googleCredential){
            next();
        }

        logger.error(formateLoggerMessage(400, "You Should logout from google fit account."));
        res.status(400).send("You Should logout from google fit account.");
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const checkFitbitConnection = async (req, res, next) => {
    try {
        const fitbitCredential = await FitbitCredential
        .findOne({userID: req.user.userID})
        .sort("date");

        if (!fitbitCredential){
            next();
        }

        logger.error(formateLoggerMessage(400, "You Should logout from fitbit account."));
        res.status(400).send("You Should logout from fitbit account.");
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}