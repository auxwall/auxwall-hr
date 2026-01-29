import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as departmentService from "../../Service/DepartmentService/getStaffByDepartment.js";

export const getStaffByDepartment = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size, departmentId } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = req.params.companyId;

        const staffs = await departmentService.getStaffByDepartment(
            limit,
            offset,
            Number(companyId),
            Number(departmentId),
            hrModels.Staff
        );

        const response = getPaginationResponse(staffs, page, limit);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
