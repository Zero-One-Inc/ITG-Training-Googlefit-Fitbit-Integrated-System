
import Joi from "joi";
import joiObjecid from "joi-objectid";

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
            console.log(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
    
        next();   
    } catch (error) {
        console.log(error.message);
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
            return res.status(400).send(error.details[0].message);
        }
    
        next();   
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
} 