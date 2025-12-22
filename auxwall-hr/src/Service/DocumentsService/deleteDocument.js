import fs from "fs";

export async function deleteDocument(id, DocumentModel) {
    const selectedDocument = await DocumentModel.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    if (fs.existsSync(selectedDocument.filePath)) {
        fs.unlinkSync(selectedDocument.filePath);
        console.log("File deleted successfully");
    }
    else {
        console.log("File not found");
    }
    await DocumentModel.destroy({ where: { id: id } });
    return await DocumentModel.findAll();
}