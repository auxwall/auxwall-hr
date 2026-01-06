import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as documentService from "../../Service/DocumentsService/updateDocument.js";

export const updateDocument = async (req: Request, res: Response, hrModels: HRModels, uploadPath: string) => {
    try {
        const id = parseInt(req.params.id);
        const document = await documentService.updateDocument(id, req.body, req.file, hrModels, uploadPath);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}