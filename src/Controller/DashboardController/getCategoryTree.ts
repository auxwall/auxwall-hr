import { HRModels } from "../../types.js";
import { Request, Response } from "express";
import { getPaginationResponse, getPagination } from "../../utils/pagination.js";
import * as DashboardService from "../../Service/DashboardService/getCategoryTree.js";
export const getCategoryTree = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { size, page } = req.query;
        const { limit, offset } = getPagination(page, size);
        const { Category } = hrModels;
        const companyId = req.params.id;
        const categories = await DashboardService.getCategoryTree(Category, companyId, limit, offset);
        const response = getPaginationResponse(categories, page, limit);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

};