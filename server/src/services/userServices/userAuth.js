
import jwt from "jsonwebtoken";
import config from "config";

export const generateAuthToken = (user) => {
    const token = "Bearer " + jwt.sign({userID: user._id, email: user.email}, config.get("JWT_TOKEN_KEY"), {expiresIn: "30m"});
    return token;
}

export const generateAuthRefreshToken = (user) => {
    const refreshToken = "Bearer " + jwt.sign({userID: user._id, email: user.email}, config.get("JWT_REFRESH_TOKEN_KEY"), {expiresIn: "3d"});
    return refreshToken;
}