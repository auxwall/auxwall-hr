import multer from "multer";

export const createUploadMiddleware = (uploadPath) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    });

    return multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 }
    });
};