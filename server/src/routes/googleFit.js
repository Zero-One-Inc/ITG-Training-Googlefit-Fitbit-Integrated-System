
import express from "express";
import verifyUserToken from "../middlewares/userAuth.js";
import getGoogleFitData from "../controllers/googleFitController.js";

const router = express.Router();

router.get("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await getGoogleFitData(req, res)
);

export default router;