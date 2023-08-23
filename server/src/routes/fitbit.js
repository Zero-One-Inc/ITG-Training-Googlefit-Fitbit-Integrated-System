
import express from "express";
import getCalories from "../controllers/fitbitController";
import verifyUserToken from "../middlewares/userAuth";

const router = express.Router()

router.get("/activityLogList",
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await getCalories(req, res)
);

export default router;