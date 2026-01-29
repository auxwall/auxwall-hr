import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as dashboardService from "../../Service/DashboardService/getByCategory.js";

export const getByCategory = async function (req: Request, res: Response, hrModels: HRModels) {
    try {
        const {
            categoryId,
            category,
            name,
            expiry_start,
            expiry_end,
            type,
            status,
            page,
            size
        } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = parseInt(req.params.id);
        const result = await dashboardService.getByCategory(
            categoryId,
            category,
            name,
            expiry_start,
            expiry_end,
            type,
            status,
            limit,
            offset,
            hrModels,
            companyId
        );

        res.status(200).json({
            message: "Documents filtered successfully",
            count: result.count,
            data: result.rows,
            pagination: getPaginationResponse(result, page, limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}