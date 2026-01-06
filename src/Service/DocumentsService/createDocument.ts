import { HRModels } from '../../types.js';
import fs from "fs";
import { getRelativePath } from "../../utils/pathHandler.js";
import { logActivity } from "../../utils/logActivity.js";
export const createDocument = async (documentData: any, hrModels: HRModels, uploadPath: any) => {
    const { Document, Activity } = hrModels;
    try {
        const newDocument: any = await Document.create({
            companyId: documentData.companyId,
            categoryId: documentData.categoryId,
            documentName: documentData.originalName,
            filePath: getRelativePath(documentData.path, uploadPath),
            fileSize: documentData.size,
            mimeType: documentData.mimeType,
            staffId: documentData.staffId || null,
            expiryDate: documentData.expiryDate || null,
            reminderDays: documentData.reminderDays || null,
            uploadedBy: documentData.uploadedBy,
            status: "Active"
        });
        await logActivity(Activity, {
            actionType: "Upload",
            description: `Document ${documentData.documentName} uploaded by ${documentData.uploadedBy}`,
            docId: newDocument.id,
            userId: documentData.uploadedBy,
            companyId: documentData.companyId
        });
        return newDocument;
    } catch (error) {
        if (documentData && documentData.path) {
            fs.unlink(documentData.path, (err) => {
                if (err) console.error("Database error cleanup failed:", err);
                else console.log("Database error: Orphaned file removed.");
            });
        }
        throw error;
    }
};