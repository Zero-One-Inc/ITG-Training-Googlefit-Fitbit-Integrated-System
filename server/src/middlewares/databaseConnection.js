
import config from "config";
import mongoose from "mongoose";
import logger,{formateLoggerMessage} from "./logger";

const connectDB = async () => {
    await mongoose.connect(config.get("DATABASE_URL"))
    .then(() => {
        const message = "Database connection established.";
        logger.info(formateLoggerMessage(200, message));
    })
    .catch((error) => {
        logger.error(formateLoggerMessage(500, error.message));
    });
}

export default connectDB;