
import config from "config";
import mongoose from "mongoose";
import logger,{formateLoggerMessage} from "./logger";

const connectDB = async () => {
    await mongoose.connect(config.get("DATABASE_URL"))
    .then(() => {
        const message = "Database connection established.";
        logger.info(200, message);
    })
    .catch((error) => {
        logger.error(500, formateLoggerMessage(error));
    });
}

export default connectDB;