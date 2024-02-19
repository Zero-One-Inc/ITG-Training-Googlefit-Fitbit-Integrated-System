
import "dotenv/config";
import config from "config";
import express from "express";
import session from "express-session";
import connectDB from "./middlewares/databaseConnection";
import authRoute from "./routes/userAuth";
import googleFitAuthRoute from "./routes/googleFitAuth.js";
import googleFitServicesRoute from "./routes/googleFit.js";
import passport from "passport";
import fitbitAuthRoute from "./routes/fitbitAuth.js";
import fitbitServicesRoute from "./routes/fitbit.js";
import logger, {formateLoggerMessage} from "./middlewares/logger.js";
import { generateCodeChallenge } from "./services/fitbitServices/fitbitAuth";

connectDB();

const app = express();

process.on("uncaughtException", (error) => {
    logger.error(formateLoggerMessage(500, error.message));
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.error(formateLoggerMessage(500, error.message));
    process.exit(1);
});

const sessionOptions = {
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/auth/user/", authRoute);
app.use("/auth/google", googleFitAuthRoute);
app.use("/auth/fitbit", fitbitAuthRoute);
app.use("/fitbit", fitbitServicesRoute);
app.use("/google", googleFitServicesRoute);
app.get("/profile", (req, res) => { 
  generateCodeChallenge();
  res.status(200).send("Inside Profile")});

const PORT = config.get("PORT") || 3000;

app.listen(PORT, () => {
    const message = `Listening on: http://localhost:${PORT}`;
    logger.info(formateLoggerMessage(200, message));
})