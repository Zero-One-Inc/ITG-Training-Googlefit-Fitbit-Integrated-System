
import express from "express";
import verifyUserToken from "../middlewares/userAuth.js";
import {createGoogleStrategy, googleAuth, googleCallback, disconnectGoogleFit} from "../controllers/googleAuthController.js";

const router = express.Router();

router.get("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res, next) => {await createGoogleStrategy(req, res, next)},
    googleAuth
);

router.get("/callback",
    async (req, res, next) => await verifyUserToken(req, res, next),
    googleCallback
)

router.delete("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await disconnectGoogleFit(req, res)
);

export default router;