import Joi from "joi";

export const companyBodySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(20)
        .required(),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Company "email" must be a valid email address',
            'any.required': 'Company "email" is required'
        }),
    location: Joi.string()
        .required(),
    isActive: Joi.boolean().default(true),
    created_at: Joi.date().default(Date.now()),
    updated_at: Joi.date().default(Date.now()),

})
