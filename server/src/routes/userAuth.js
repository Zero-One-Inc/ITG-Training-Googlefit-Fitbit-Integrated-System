
import express from "express";
import { registerValidation, loginValidation } from "../middlewares/validation/user.js";
import {register, login, logout} from "../controllers/userAuthController.js";
import verifyUserToken from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/register", 
    (req, res, next) => registerValidation(req, res, next),
    async (req, res) => await register(req, res) 
);

router.post("/login", 
    (req, res, next) => loginValidation(req, res, next),
    async (req, res) => await login (req, res) 
);

router.post("/logout", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await logout (req, res) 
);

export default router;