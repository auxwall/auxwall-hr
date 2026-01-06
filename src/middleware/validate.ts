import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        let dataToValidate = { ...req[property as keyof Request] };
        if (property === 'body' && req.file) {
            dataToValidate.myFile = req.file;
        }
        const { error } = schema.validate(dataToValidate, { abortEarly: false });
        if (error) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Failed to delete orphaned file after validation error:", unlinkErr);
                    } else {
                        console.log("Validation failed: Orphaned file successfully removed.");
                    }
                });
            }

            const errorMessage = error.details.map((err) => err.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }

        next();
    };
};