import Joi from "joi";

export const categorizedSearchSchema = Joi.object({
    categoryId: Joi.number().allow(null).allow(''),
    category: Joi.string().allow(null).allow(''),
    name: Joi.string().allow(null).allow(''),
    expiry_start: Joi.date().allow(null).allow(''),
    expiry_end: Joi.date().allow(null).allow(''),
    status: Joi.string().allow(null).allow(''),
    type: Joi.string().allow(null).allow(''),
    page: Joi.number().default(1),
    size: Joi.number().default(10)
});
