export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        let dataToValidate = { ...req[property] };
        if (property === 'body' && req.file) {
            dataToValidate.myFile = req.file;
        }
        const { error } = schema.validate(dataToValidate, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((err) => err.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    };
};