
import express from "express";
import verifyToken from "../middlewares/userAuth";

const router = express.Router();

router.post(
    "/googleFit/Activity",
    (req, res, next) => verifyToken(req, res, next),
    )

export default router;