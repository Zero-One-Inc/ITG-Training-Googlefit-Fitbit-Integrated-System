
import express from "express";
import verifyUserToken from "../middlewares/userAuth.js";
import getGoogleFitData from "../controllers/googleFitController.js";
import validateAggregateData from "../middlewares/validation/googleFitDataValidation.js";

const router = express.Router();

router.get("/aggregate",
    async (req, res, next) => await verifyUserToken(req, res, next),
    (req, res, next) => validateAggregateData(req, res, next),
    async (req, res) => await getGoogleFitData(req, res)
);

export default router;