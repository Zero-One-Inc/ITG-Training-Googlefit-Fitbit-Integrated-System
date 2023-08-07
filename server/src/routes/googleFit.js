
import express from "express";
import verifyToken from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/",
    (req, res, next) => verifyToken(req, res, next),
    (req, res) => {
        
        res.status(200).send("Opened");
    }
    );

export default router;