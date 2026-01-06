export async function getDocuments(limit, offset, DocumentModel) {
    const documents = await DocumentModel.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return documents;
}