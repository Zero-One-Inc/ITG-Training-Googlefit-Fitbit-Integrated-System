
import Joi from "joi";
import joiObjectid from "joi-objectid";
import config from "config";
import logger, {formateLoggerMessage} from "../logger";

Joi.objectId = joiObjectid(Joi);

const validateAggregateData = (req, res, next) => {
    try {
        const schema = Joi.object({
            userID: Joi.objectId().required(),
            dataTypes: Joi.array().items(Joi.string().min(1).max(100)).required(),
            groupByTime: Joi.string().valid("day", "week", "month").required(),
            startTime: Joi.date().required(),
            endTime: Joi.date().greater(Joi.ref("startTime")).message("End date should be greater than start date.").required(),
        });
        const data = {
            userID: req.user.userID,
            dataTypes: req.body.dataTypes,
            groupByTime: req.body.groupByTime,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        }

        const { error } = schema.validate(data);

        if (error) {
            logger.error(formateLoggerMessage(400, error.details[0].message));
            return res.status(400).send(error.details[0].message);
        }

        
        const GOOGLE_FIT_DATA_TYPES = Object.keys(JSON.parse(config.get("GOOGLE_DATA_TYPE_NAME")));
        
        for (const dataType of req.body.dataTypes) {
            if(!GOOGLE_FIT_DATA_TYPES.includes(dataType)){
                logger.error(formateLoggerMessage(400, "Unsupported data type."));
                return res.status(400).send("Unsupported data type.");
            }
        } 

        next();
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export default validateAggregateData;