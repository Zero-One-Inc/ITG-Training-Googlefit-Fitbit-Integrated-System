
import express from "express";
import verifyToken from "../middlewares/userAuth.js";
import {createGoogleStrategy, googleAuth, googleCallback} from "../controllers/googleAuthController.js";

const router = express.Router();

router.get("/", 
    (req, res, next) => verifyToken(req, res, next),
    async (req, res, next) => {await createGoogleStrategy(req, res, next)},
    googleAuth
);

router.get("/callback",
    (req, res, next) => verifyToken(req, res, next),
    googleCallback
)

export default router;