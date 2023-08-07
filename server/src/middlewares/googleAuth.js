
import jwt from "jsonwebtoken";
import config from "config";

const verifyGoogleFitAuthintecation = (req, res, next) => {
    const googleToken = req.header("GOOGLE_ACCESS_TOKEN").split(" ")[1];

    if (!googleToken){
        return res.status(401).redirect("/auth/google");
    }


}