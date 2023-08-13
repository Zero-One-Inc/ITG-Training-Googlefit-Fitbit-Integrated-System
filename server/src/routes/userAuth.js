
import express from "express";
import { validateRegistration, validateLogin } from "../middlewares/validation/user.js";
import {register, login, logout, deleteUser} from "../controllers/userAuthController.js";
import verifyUserToken from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/register", 
    (req, res, next) => validateRegistration(req, res, next),
    async (req, res) => await register(req, res) 
);

router.post("/login", 
    (req, res, next) => validateLogin(req, res, next),
    async (req, res) => await login (req, res) 
);

router.post("/logout", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res) => await logout (req, res) 
);

router.delete("/", 
    async (req, res, next) => await verifyUserToken(req, res, next),
    async (req, res, next) => await deleteUser(req, res, next)
);
export default router;