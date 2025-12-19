import { Document } from "../../models/index.js";

export async function getDocuments(limit, offset) {
    const documents = await Document.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return documents;
}