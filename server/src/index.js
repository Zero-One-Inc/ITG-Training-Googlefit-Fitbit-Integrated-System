import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.status(200).send("Hello World.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`);
})