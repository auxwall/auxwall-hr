import Joi from 'joi';

export const paginationQuerySchema = Joi.object({
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).max(100).default(10)
    // .max(100) prevents users from requesting 1 million rows at once
});