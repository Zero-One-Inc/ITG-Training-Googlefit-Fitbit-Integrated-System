
import Joi from "joi";
import joiObjecid from "joi-objectid";
import logger, {formateLoggerMessage} from "../logger";

Joi.objectId = joiObjecid(Joi);

export const registerValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            firstName: Joi.string().max(50).min(1).required(),
            lastName: Joi.string().max(50).min(1).required(),
            email: Joi.string().email().max(255).min(7).required(),
            password: Joi.string().max(255).min(8).required()
        });
    
        const { error } = schema.validate(req.body);
    
        if (error){
            logger.error(formateLoggerMessage(400, error.details[0].message));
            return res.status(400).send(error.details[0].message);
        }
    
        next();   
    } catch (error) {
        console.log(error.message);
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export const loginValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().max(255).min(7).required(),
            password: Joi.string().max(255).min(8).required()
        });
    
        const { error } = schema.validate(req.body);
    
        if (error){
            console.log(error.details[0].message);
            logger.error(formateLoggerMessage(400, error.details[0].message));
            return res.status(400).send(error.details[0].message);
        }
    
        next();   
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
} 