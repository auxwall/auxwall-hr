import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as departmentService from "../../Service/DepartmentService/getStaffByStatus.js";

export const getStaffByStatus = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size, status, departmentId } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = req.params.companyId;

        const staffs = await departmentService.getStaffByStatus(
            limit,
            offset,
            Number(companyId),
            Number(departmentId),
            status,
            hrModels.Staff
        );

        const response = getPaginationResponse(staffs, page, limit);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
