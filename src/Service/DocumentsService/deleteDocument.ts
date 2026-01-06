import { HRModels } from '../../types.js';
import fs from "fs";
import path from "path";
import { logActivity } from "../../utils/logActivity.js";

export async function deleteDocument(id, hrModels, uploadPath) {
    const { Document, Activity } = hrModels;
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    try {
        const fileName = path.basename(selectedDocument.filePath);
        const absolutePath = path.join(uploadPath, fileName);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log("File deleted successfully");
        }
        else {
            console.log("File not found");
        }
    } catch (error) {
        console.log("File delete error: ", error);
    }
    await logActivity(Activity, {
        actionType: "Delete",
        description: `Document ${selectedDocument.documentName} deleted by ${selectedDocument.uploadedBy}`,
        docId: id,
        userId: selectedDocument.uploadedBy,
        companyId: selectedDocument.companyId
    });
    await Document.destroy({ where: { id: id } });
    return await Document.findAll();
}