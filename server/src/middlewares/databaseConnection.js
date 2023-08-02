
import config from "config";
import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(config.get("DATABASE_URL"))
    .then(() => {
        console.log("Database connected.");
    })
    .catch((error) => {
        console.log(error.message);
    });
}

export default connectDB;