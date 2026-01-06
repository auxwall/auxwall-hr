import { HRModels } from '../../types.js';
import fs from "fs";
import path from "path";
import { getRelativePath } from "../../utils/pathHandler.js";
import { logActivity } from "../../utils/logActivity.js";

export async function updateDocument(id, document, file, hrModels, uploadPath) {
    const { Document, Activity } = hrModels;
    const selectedDocument = await Document.findByPk(id);

    if (!selectedDocument) {
        if (file) fs.unlinkSync(file.path);
        const error = new Error(`Document with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    const fileName = path.basename(selectedDocument.filePath);
    const absolutePath = path.join(uploadPath, fileName);

    try {
        if (file) {
            document.documentName = file.originalname;
            document.filePath = getRelativePath(file.path, uploadPath);
            document.fileSize = file.size;
            document.mimeType = file.mimetype;
        }
        await selectedDocument.update(document);

        await logActivity(Activity, {
            actionType: "Update",
            description: `Document ${selectedDocument.documentName} updated by ${selectedDocument.uploadedBy}`,
            docId: id,
            userId: selectedDocument.uploadedBy,
            companyId: selectedDocument.companyId
        });
        try {
            if (file && fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log("Old file deleted successfully");
            }
        } catch (unlinkError) {
            console.error("Warning: Failed to delete old physical file:", unlinkError.message);
        }
        return await Document.findAll();

    } catch (error) {
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.error("DB Error: Newly uploaded file cleaned up.");
        }
        throw error;
    }
}