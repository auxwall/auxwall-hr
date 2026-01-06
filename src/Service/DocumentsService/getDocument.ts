export async function getDocument(id, DocumentModel) {
    const document = await DocumentModel.findByPk(id);
    if (!document) {
        const error = new Error(`Document with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    return document;
}