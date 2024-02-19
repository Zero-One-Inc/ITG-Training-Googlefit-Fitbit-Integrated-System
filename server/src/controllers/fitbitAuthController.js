
import config from "config";
import axios from "axios";
import {createFitbitCredentails, generateCodeChallenge, getFitbitCredential, revokeFitbitCredential} from "../services/fitbitServices/fitbitAuth";
import Base64 from "crypto-js/enc-base64url";
import logger, {formateLoggerMessage} from "../middlewares/logger";
import Utf8 from 'crypto-js/enc-utf8';
import queryString from "querystring";

export const fitbitAuth = (req, res) => {
    try{
        const {codeVerifier, codeChallenge, state} = generateCodeChallenge();
        const fitbitAuthURI = new URL(config.get("FITBIT_AUTH_URI"));
        const scopes = config.get("FITBIT_SCOPES");
        console.log(scopes);
        fitbitAuthURI.searchParams.set("client_id", config.get("FITBIT_CLIENT_ID"));
        fitbitAuthURI.searchParams.set("scope", scopes);
        fitbitAuthURI.searchParams.set("code_challenge", codeChallenge);
        fitbitAuthURI.searchParams.set("code_challenge_method", config.get("CODE_CHALENGE_METHOD"));
        fitbitAuthURI.searchParams.set("response_type", "code");
        fitbitAuthURI.searchParams.set("state", state);
        
        req.session.codeVerifier = codeVerifier;
        req.session.state = state;
        res.redirect(fitbitAuthURI.href)
    }
    catch(error){
        logger.info(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const fitbitCallback = async (req, res) => {
    const state = req.query.state

    if (!state || state !== req.session.state){
        logger.info(400, "Invalid state parameter.");
        return res.status(400).send("Invalid state parameter.");
    }

    try{
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
                code: req.query.code,
                code_verifier: req.session.codeVerifier,
                grant_type: "authorization_code",
                state: state,
                expires_in: 10800,
                "redirect_uri": config.get("FITBIT_CALLBACK_URL")
            })
        });

        const fitbitCredentials = await getFitbitCredential(req.user.userID);

        if (!fitbitCredentials){
            await createFitbitCredentails(req.user.userID, callbackResponse.data.access_token, callbackResponse.data.refresh_token);
        }

        logger.info(formateLoggerMessage(200, "Fitbit connected."));
        res.status(200).send("Fitbit connected.");
    }
    catch(error){
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error);
    }
}

export const disconnectFitbit = async (req, res) => {
    try {
        await revokeFitbitCredential(req.user.userID);
        logger.info(200, "Fitbit credential revoked.")
        res.status(200).send("Fitbit credential revoked.");
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message))
    }
}