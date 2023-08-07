
import googleStratigy from "../services/googleServices/googleAuth";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "config";

export const googleAuthintication = async (req, res) => {

    passport.use(googleStratigy(req.user.userID));

    passport.authenticate(
        "google", 
        {
            scope: config.get("GOOGLE_SCOPE")
        }
    );
}

export const googleAuthinticationCallback = async (req, res) => {
    const authorization = req.header("USER_TOKEN").split(" ")[1];
    const decode = null;
    try {
         decode = jwt.verify(authorization, config.get("JWT_TOKEN_KEY"));
    } catch (error) {
        console.log(error.message);
        return res.status(401).send(error.message);
    }

    passport.use(googleStratigy(decode.userID));

    passport.authenticate(
        "google", 
        {
            failureRedirect: "/auth/google"
        },
        (req, res) => {
            res.redirect('/');
        }
    );
}