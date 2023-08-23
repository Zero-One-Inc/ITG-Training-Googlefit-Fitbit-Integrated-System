
import express from "express";
import verifyUserToken from "../middlewares/userAuth.js";
import { disconnectFitbit, fitbitAuth, fitbitCallback } from "../controllers/fitbitAuthController.js";
import { checkGoogleFitConnection } from "../middlewares/platformConnectionChecker.js";

const router = express.Router();

router.get("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res, next) => await checkGoogleFitConnection(req, res, next),
    (req, res) => fitbitAuth(req, res),
);

router.get("/callback",
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res, next) => await checkGoogleFitConnection(req, res, next),
    async (req, res) => await fitbitCallback(req, res),
)

router.delete("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await disconnectFitbit(req, res)
);

export default router;