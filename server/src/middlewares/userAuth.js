
import jwt from "jsonwebtoken";
import config from "config";
import { generateAuthToken } from "../services/userServices/userAuth";

const verifyToken = (req, res, next) => {
    const token = req.header("USER_TOKEN").split(" ")[1];

    if(!token){
        return res.status(401).send("Access denied, Unauthorized user.");
    }

    try {
        const decode = jwt.verify(token, config.get("JWT_TOKEN_KEY"));
        req.user = decode;
        res.header("USER_TOKEN", req.header("USER_TOKEN"));
        res.header("USER_REFRESH_TOKEN", req.header("USER_REFRESH_TOKEN"));
        console.log("inside token.");
        next();
    } catch (error) {
        renewAuthToken(req, res, next);
    }
}

const renewAuthToken = (req, res, next) => {
    const refreshToken = req.header("USER_REFRESH_TOKEN").split(" ")[1];
    
    if (!refreshToken){
        return res.status(401).send("Access denied, Unauthorized user.");
    }

    try {
        const decode = jwt.verify(refreshToken, config.get("JWT_REFRESH_TOKEN_KEY"));
        
        const newUserAccessToken = generateAuthToken(decode);

        res.header("USER_TOKEN", newUserAccessToken);
        res.header("USER_REFRESH_TOKEN", req.header("USER_REFRESH_TOKEN"));
        
        console.log("inside refresh token.");
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Invalid token;");
    }
}

export default verifyToken;