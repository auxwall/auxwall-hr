import Joi from "joi";

export const documentBodySchema = Joi.object({
    companyId: Joi.number().required(),
    categoryId: Joi.number().required(),
    documentName: Joi.string()
        .min(2)
        .required(),
    filePath: Joi.string().required(),
    fileSize: Joi.number().required(),
    mimeType: Joi.string().required(),
    staffId: Joi.number().required(),
    reminderDays: Joi.date().required(),
    status: Joi.string()
        .valid("Active", "Expired", "Archived")
        .required(),
    uploadedBy: Joi.number().required(),
    expiryDate: Joi.date().greater('now').required(),
    created_at: Joi.date().default(Date.now()),
    updated_at: Joi.date().default(Date.now()),
})

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
