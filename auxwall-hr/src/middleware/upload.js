// middleware/upload.js
import multer from "multer";
import fs from "fs";

const dir = "./uploads";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// 1. Define where and how to store files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generates: 1734612345-filename.pdf
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// 2. Initialize Multer
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: limit to 10MB
});