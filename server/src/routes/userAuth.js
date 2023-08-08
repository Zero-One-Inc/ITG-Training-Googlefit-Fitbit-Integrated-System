
import express from "express";
import { registerValidation, loginValidation } from "../middlewares/validation/user.js";
import {register, login} from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/register", 
    (req, res, next) => registerValidation(req, res, next),
    async (req, res) => await register(req, res) 
);

router.post("/login", 
    (req, res, next) => loginValidation(req, res, next),
    async (req, res) => await login (req, res) 
);

export default router;