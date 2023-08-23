
import Base64 from "crypto-js/enc-base64url";
import SHA256 from "crypto-js/sha256";
import crypto from "crypto";
import FitbitCredential from "../../models/FitbitCredentials";

const generateCodeVerifier = () => {
    const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const codeVerifierLength = crypto.randomInt(43, 128);
    const allowedCharactersLength = allowedCharacters.length;

    let codeVerifier = '';

    for (let i = 0; i < codeVerifierLength; i++) {
        const randomIndex = crypto.randomInt(0, allowedCharactersLength);
        codeVerifier += allowedCharacters.charAt(randomIndex);
    }

    return codeVerifier;
}

function generateState(length) {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
        result += alphanumericChars.charAt(randomIndex);
    }

    return result;
}

export const generateCodeChallenge = () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = Base64.stringify(SHA256(codeVerifier));
    const state = generateState(32); 

    return {codeVerifier, codeChallenge, state};
}

export const createFitbitCredentails = async (userID, accessToken, refreshToken) => {
    const fitbitCredential = new FitbitCredential({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userID: userID
    });

    await fitbitCredential.save();
    return fitbitCredential;
}  

export const getFitbitCredential = async (userID) => {
    const fitbitCredential = await FitbitCredential
        .findOne({userID: userID})
        .sort("date");

    if (!fitbitCredential){
        return null;
    }
    
    return fitbitCredential;
}

export const getNewFitbitAccessToken = async (fitbitCredential) => {
    try {
        const fitbit_ID_SECRET_KEY = config.get("FITBIT_CLIENT_ID")+":"+config.get("FITBIT_SECRET_KEY");
        const fitbitUserCredentials = Base64.stringify(Utf8.parse(fitbit_ID_SECRET_KEY));

        const callbackResponse = await axios({
            method: "POST",
            url: config.get("FITBIT_TOKEN_URI"),
            headers: {
                Authorization: `Basic ${fitbitUserCredentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: queryString.stringify({
                client_id: config.get("FITBIT_CLIENT_ID"),
                refresh_token: fitbitCredential.refreshToken,
                grant_type: "refresh_token",
                expires_in: 10800,
            })
        });
        
        fitbitCredential.accessToken = callbackResponse.data.access_token;
        fitbitCredential.refresh_token = callbackResponse.data.refresh_token;
        
        await fitbitCredential.save();

        return fitbitCredential;
    } 
    catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        await fitbitCredential.deleteOne();
        return null;
    }
}

export const revokeFitbitCredential = async (userID) => {
    try {
        const fitbitCredential = await FitbitCredential
        .findOne({userID: userID})
        .sort("date")

        if (!fitbitCredential){
            return;
        }
        await fitbitCredential.deleteOne();   
    } catch (error) {
        throw new Error("Couldn't revoke Google Fit credential.");
    }
}