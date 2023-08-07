
import jwt from "jsonwebtoken";
import config from "config";

const verifyToken = (req, res, next) => {
    const token = req.header("USER_TOKEN").split(" ")[1];

    if(!token){
        return res.status(401).send("Access denied, Unauthorized user.");
    }

    try {
        const decode = jwt.verify(token, config.get("JWT_TOKEN_KEY"));
        req.user = decode;
        
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Invalid token");
    }
}

export default verifyToken;