import Joi from "joi";

export const documentBodySchema = Joi.object({
    companyId: Joi.number().required(),
    categoryId: Joi.number().required(),
    staffId: Joi.number().optional().allow(null),
    uploadedBy: Joi.number().required(),
    expiryDate: Joi.date().greater('now').required(),
    reminderDays: Joi.date().optional().allow(null),
    status: Joi.string()
        .valid("Active", "Expired", "Archived")
        .default("Active"),
    myFile: Joi.any().optional()
});

export const documentIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Document "id" must be a number',
            'number.integer': 'Document "id" must be an integer',
            'number.positive': 'Document "id" must be a positive number',
            'any.required': 'Document "id" is required'
        })
})

export const updateDocumentSchema = documentBodySchema.fork(
    ['companyId', 'categoryId', 'uploadedBy', 'expiryDate', 'reminderDays', 'myFile'],
    (schema) => schema.optional()
);