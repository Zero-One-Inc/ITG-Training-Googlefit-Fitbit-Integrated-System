
import { getNewGoogleAccessToken } from "../services/googleServices/googleAuth";
import config from "config";
import jwt from "jsonwebtoken";
import GoogleFitCredential from "../models/GoogleFitCredential";

const verifyGoogleAccessToken = async (req, res, next) => {
    try {
        let googleFitCredential = await GoogleFitCredential
        .findOne({userID: req.user.userID})
        .sort("date").exec();

        const response = axios({
            method: "get",
            url: config.get("GOOGLE_PUBLiC_KEYS_URL")
        });

        const googelKeys = response.data.keys;

        const decodedToken = jwt.decode(googleFitCredential.accessToken, {complete: true});
        const googleKeyId = decodedToken.header.kid;
        const key = googelKeys.find(key => key.kid === googleKeyId);
        
        if (!key) {
            throw new Error('Invalid token signature');
        }

        
    } catch (error) {
        
    }
}