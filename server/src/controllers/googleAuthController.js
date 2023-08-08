
import googleStrategy from "../services/googleServices/googleAuth";
import passport from "passport";
import config from "config";

export const createGoogleStrategy = async (req, res, next) => {
    try {
        passport.use(await googleStrategy("req.user.userID"));
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
}

export const googleAuth = passport.authenticate("google",
{
    scope: Object.values(JSON.parse(config.get("GOOGLE_SCOPES"))),
}
);

export const googleCallback = passport.authenticate(
    "google", 
    {
        session: false,
        failureRedirect: "/auth/google",
        successRedirect: '/profile'
    }
);