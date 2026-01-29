import Joi from 'joi';

export const departmentBodySchema = Joi.object({

    name: Joi.string()
        .min(2)
        .max(15)
        .required()
        .messages({
            'string.min': 'Department name must be at least 2 characters long',
            'string.max': 'Department name must be at most 15 characters long',
            'any.required': 'Department "name" is required'
        }),

    companyId: Joi.number()
        .integer()
        .required(),

    createdBy: Joi.number()
        .integer()
        .optional()
});
export const departmentIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'The ID must be a number',
            'number.positive': 'The ID must be a valid positive integer'
        })
});

export const updateDepartmentSchema = departmentBodySchema.fork(
    ['name', 'companyId', 'createdBy'],
    (schema) => schema.optional()
);