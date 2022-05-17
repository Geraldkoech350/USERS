import Joi from "joi";

export const Registerschema = Joi.object({
    username: Joi.string().required(),
    fullname: Joi.string().required(),
    email: Joi.string().email(), 
    age: Joi.number().required(), 
    password: Joi.string().required().min(6).max(20), 
    role: Joi.string().required()
})