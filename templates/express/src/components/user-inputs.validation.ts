import Joi from 'joi';


export const createUserValidation = Joi.object({
  body: Joi.object({ 
    fullName: Joi.string().required(), 
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').required(),
    language: Joi.string().valid('en', 'fr', 'es').default('en')
  }).required()
}); 