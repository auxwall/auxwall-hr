import Joi from "joi";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
export const shiftBodySchema = Joi.object({
    staffId: Joi.number().integer().positive().required(),
    shiftName: Joi.string().required(),
    shiftStart: Joi.string().pattern(timeRegex).required().messages({
        'string.pattern.base': 'Shift start time must be in HH:mm or HH:mm:ss format'
    }),
    shiftEnd: Joi.string().pattern(timeRegex).required().messages({
        'string.pattern.base': 'Shift end time must be in HH:mm or HH:mm:ss format'
    }),
    breakMinutes: Joi.number().integer().positive().optional(),
    lateGraceMinutes: Joi.number().integer().positive().optional(),
    overtimeMinutes: Joi.number().integer().positive().optional()
})

export const updateShiftSchema = Joi.object({
    staffId: Joi.number().integer().positive().optional(),
    shiftName: Joi.string().allow(null).allow('').optional(),
    shiftStart: Joi.string().pattern(timeRegex).allow(null).allow('').optional().messages({
        'string.pattern.base': 'Shift start time must be in HH:mm or HH:mm:ss format'
    }),
    shiftEnd: Joi.string().pattern(timeRegex).allow(null).allow('').optional().messages({
        'string.pattern.base': 'Shift end time must be in HH:mm or HH:mm:ss format'
    }),
    breakMinutes: Joi.number().integer().positive().optional(),
    lateGraceMinutes: Joi.number().integer().positive().optional(),
    overtimeMinutes: Joi.number().integer().positive().optional()
})

export const shiftIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
})