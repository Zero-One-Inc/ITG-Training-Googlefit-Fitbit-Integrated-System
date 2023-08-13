
import jwt from "jsonwebtoken";
import config from "config";
import { generateAuthToken } from "../services/userServices/userAuth";
import logger, {formateLoggerMessage} from "./logger";

const verifyUserToken = (req, res, next) => {
    // const token = req.header("USER_TOKEN").split(" ")[1];
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGQ0Y2JkMGNiZDU5OGMwMDE4Nzk5MWEiLCJlbWFpbCI6ImF0YWEuc2hhcW91ckBnbWFpbC5jb20iLCJpYXQiOjE2OTE3MzY2NzQsImV4cCI6MTY5MTczODQ3NH0.m5qTaOFG90EuH89-cVyeoj7_piHfGqCFRWQ6qwLbaGk";
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
    // const refreshToken = req.header("USER_REFRESH_TOKEN").split(" ")[1];
    const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGQ0Y2JkMGNiZDU5OGMwMDE4Nzk5MWEiLCJlbWFpbCI6ImF0YWEuc2hhcW91ckBnbWFpbC5jb20iLCJpYXQiOjE2OTE3MzY2NzQsImV4cCI6MTY5MTk5NTg3NH0.A662S6F2fr_kBmDhxmttDDAQpsA5v1sTfSmuk190kZQ";
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