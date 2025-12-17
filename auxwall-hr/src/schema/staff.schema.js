import Joi from 'joi';

export const staffBodySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Staff name must be at least 2 characters long',
            'string.max': 'Staff name must be at most 50 characters long',
            'any.required': 'Staff "name" is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Staff "email" must be a valid email address',
            'any.required': 'Staff "email" is required'
        }),
    phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.length': 'Staff "phone" must be 10 digits long',
            'string.pattern': 'Staff "phone" must be a valid phone number',
            'any.required': 'Staff "phone" is required'
        }),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    companyId: Joi.number().required(),
    designation: Joi.string().required()
})
