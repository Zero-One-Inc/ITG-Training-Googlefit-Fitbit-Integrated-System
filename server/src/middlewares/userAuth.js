
import jwt from "jsonwebtoken";
import config from "config";
import { generateAuthToken } from "../services/userServices/userAuth";
import logger, {formateLoggerMessage} from "./logger";

const verifyUserToken = (req, res, next) => {
    const token = req.header("USER_TOKEN").split(" ")[1];
    if (!token) {
        const errorMessage = "Access denied, Unauthorized access";
        logger.error(formateLoggerMessage(401, errorMessage));
        return res.status(401).send("Access denied, Unauthorized user.");
    }

    try {
        const decode = jwt.verify(token, config.get("JWT_TOKEN_KEY"));

        req.user = decode;
        res.header("USER_TOKEN", req.header("USER_TOKEN"));
        res.header("USER_REFRESH_TOKEN", req.header("USER_REFRESH_TOKEN"));

        next();
    } catch (error) {
        renewAuthToken(req, res, next);
    }
}

const renewAuthToken = (req, res, next) => {
    const refreshToken = req.header("USER_REFRESH_TOKEN").split(" ")[1];
    if (!refreshToken) {
        const errorMessage = "Access denied, Unauthorized access";
        logger.error(formateLoggerMessage(401, errorMessage));
        return res.status(401).send(errorMessage);
    }

    try {
        const decode = jwt.verify(refreshToken, config.get("JWT_REFRESH_TOKEN_KEY"));

        const newUserAccessToken = generateAuthToken(decode);

        req.user = decode;
        res.header("USER_TOKEN", newUserAccessToken);
        res.header("USER_REFRESH_TOKEN", req.header("USER_REFRESH_TOKEN"));

        next();
    } catch (error) {
        const errorMessage = "Invalid token";
        logger.error(formateLoggerMessage(400, errorMessage));
        res.status(400).send(errorMessage);
    }
}

export default verifyUserToken;