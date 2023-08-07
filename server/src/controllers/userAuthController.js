
import bcrypt from "bcrypt";
import config from "config";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import {generateAuthToken, generateAuthRefreshToken} from "../services/userServices/userAuth.js";

export const register = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});

        if(user){
            console.log("This user is already registerd");
            return res.status(400).send("This user is already registerd");
        }

        const SALT = await bcrypt.genSalt(Number(config.get("SALT")));
        const hashedPassword = await bcrypt.hash(req.body.password, SALT);
        req.body.password = hashedPassword;

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        
        user = await user.save();

        res.status(200).send(user);   
    } catch (error) {
        console.log(error.message);
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

    res.set("user", {
        userID: user._id,
        email: user.email
    });
    res.set("USER_TOKEN", token);
    res.set("USER_REFRESH_TOKEN", refreshToken);

    res.status(200).send("Loged in.");
}

export const logout = (req, res) => {
    
}

export const renewAuthToken = (req, res) => {
    const refreshToken = req.header("USER_REFRESH_TOKEN").split(" ")[1];
    
    if (!refreshToken){
        return res.status(401).send("Access denied, Unauthorized user.");
    }

    try {
        const decode = jwt.verify(refreshToken, config.get("JWT_REFRESH_TOKEN_KEY"));
        
        const newUserAccessToken = generateAuthToken(decode);

        res.set("USER_TOKEN", newUserAccessToken);
        res.set("USER_REFRESH_TOKEN", refreshToken);
        res.set("user", decode);

        res.status(200).send("Token refreshed.");
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Invalid token;");
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
        throw error;
    }
}