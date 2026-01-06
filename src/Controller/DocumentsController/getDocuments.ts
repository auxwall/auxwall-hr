import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as documentService from "../../Service/DocumentsService/getDocuments.js";

export const getDocuments = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const documents = await documentService.getDocuments(limit, offset, hrModels.Document);
        const response = getPaginationResponse(documents, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}