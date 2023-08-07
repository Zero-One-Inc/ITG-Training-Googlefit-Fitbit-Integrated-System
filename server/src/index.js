
import "dotenv/config";
import config from "config";
import express from "express";
import connectDB from "./middlewares/databaseConnection";
import authRoute from "./routes/userAuth";
// import googleFitAuthRoute from "./routes/googleFit.js";
import googleFitServicesRoute from "./routes/googleFit.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/user/auth/", authRoute);
// app.use("/google/auth");
app.use("/google", googleFitServicesRoute);

const PORT = config.get("PORT") || 3000;

app.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`);
})