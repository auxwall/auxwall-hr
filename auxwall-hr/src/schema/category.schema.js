import Joi from 'joi';

export const categoryBodySchema = Joi.object({

    name: Joi.string()
        .min(2)
        .max(15)
        .required()
        .messages({
            'string.min': 'Category name must be at least 2 characters long',
            'string.max': 'Category name must be at most 15 characters long',
            'any.required': 'Category "name" is required'
        }),

    company_id: Joi.number()
        .integer()
        .required(),

    parent_id: Joi.number()
        .integer()
        .allow(null),

    createdBy: Joi.number()
        .integer()
        .required()
});
export const categoryIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'The ID must be a number',
            'number.positive': 'The ID must be a valid positive integer'
        })
});

export const updateCategorySchema = categoryBodySchema.fork(
    ['name', 'company_id', 'parent_id', 'createdBy'],
    (schema) => schema.optional()
);