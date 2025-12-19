import { Document } from "../../models/index.js";

export const createDocument = async (documentData) => {
    const newDocument = await Document.create({
        companyId: documentData.companyId,
        categoryId: documentData.categoryId,
        documentName: documentData.originalName,
        filePath: documentData.path,
        fileSize: documentData.size,
        mimeType: documentData.mimeType,
        staffId: documentData.staffId || null,
        expiryDate: documentData.expiryDate || null,
        reminderDays: documentData.reminderDays || null,
        uploadedBy: documentData.uploadedBy,
        status: "Active"
    });

    return newDocument;
};