import Joi from 'joi';

export const categoryBodySchema = Joi.object({

    name: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.min': 'Category name must be at least 2 characters long',
            'any.required': 'Category "name" is required'
        }),

    companyId: Joi.number()
        .integer()
        .required(),

    parentId: Joi.number()
        .integer()
        .allow(null),

    createdBy: Joi.number()
        .integer()
        .optional()
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
    ['name', 'companyId', 'parentId', 'createdBy'],
    (schema) => schema.optional()
);