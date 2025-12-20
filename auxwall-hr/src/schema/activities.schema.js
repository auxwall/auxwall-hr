import Joi from "joi";

export const activitiesBodySchema = Joi.object({
    companyId: Joi.number().required(),
    docId: Joi.number().required(),
    userId: Joi.number().required(),
    actionType: Joi.string()
        .valid("Upload", "Update", "Delete", "Download", "View")
        .required()
        .messages({
            'any.only': 'Invalid action type'
        }),
    description: Joi.string()
        .allow(null)
        .allow(''),
    created_at: Joi.date().default(Date.now()).optional()
})

export const activitiesIdSchema = Joi.object({
    id: Joi.number().required()
})
