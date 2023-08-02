
import "dotenv/config";
import config from "config";
import express from "express";
import connectDB from "./middlewares/databaseConnection";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.status(200).send("Hello World.");
});

const PORT = config.get("PORT") || 3000;

app.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`);
})