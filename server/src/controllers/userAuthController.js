
import bcrypt from "bcrypt";
import config from "config";
import User from "../models/Users";
import {generateAuthToken, generateAuthRefreshToken} from "../services/userServices/userAuth.js";
import { revokeGoogleFitCredentials } from "../services/googleServices/googleAuth";
import logger, {formateLoggerMessage} from "../middlewares/logger";

export const register = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});

        if(user){
            const errorMessage = "This user is already registered.";
            logger.error(formateLoggerMessage(400, errorMessage));
            return res.status(400).send();
        }

        const SALT = await bcrypt.genSalt(Number(config.get("SALT")));
        const hashedPassword = await bcrypt.hash(req.body.password, SALT);
        req.body.password = hashedPassword;

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            isLogedOut: true
        });
        
        user = await user.save();

        const message = "User registered successfully";
        logger.info(formateLoggerMessage(200, message));
        res.status(200).send(user);
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const login = async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if (!user){
        console.log("There is no user that have this email.");
        return res.status(404).send("There is no user that have this email.");
    }

    const isMatchedPassword = await bcrypt.compare(req.body.password, user.password);

    if(!isMatchedPassword){
        console.log("Wrong Password");
        return res.status(404).send("Wrong Password");
    }
    
    const token = generateAuthToken(user);
    const refreshToken = generateAuthRefreshToken(user);

    res.set("USER_TOKEN", token);
    res.set("USER_REFRESH_TOKEN", refreshToken);
    
    await user.updateOne({isLogedOut: false});

    const result = {
        message: "Loged in.",
        user: {
            userID: user._id,
            email: user.email
        }
    }

    res.status(200).send(result);
}

export const logout = async (req, res) => {
    try {
        await revokeGoogleFitCredentials(req.user.userID);

        res.status(200).send("User loged out.");
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById({_id: req.params.userID});

        if (!user){
            console.log("This user doesn't exist.");
            res.status(404).redirect("/login");
        }

        await user.deleteOne();
        res.status(200).redirect("/register");

        return true;
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
}