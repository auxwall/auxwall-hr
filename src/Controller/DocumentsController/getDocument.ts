import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as documentService from "../../Service/DocumentsService/getDocument.js";

export const getDocument = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const document = await documentService.getDocument(id, hrModels.Document);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
