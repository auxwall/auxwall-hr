import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as departmentService from "../../Service/DepartmentService/getDepartment.js";

export const getDepartments = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size, status, name } = req.query;
        const { limit, offset } = getPagination(page, size);
        const id = req.params.id;
        const documents = await departmentService.getDepartments(limit, offset, id, hrModels, status, name);
        const response = getPaginationResponse(documents, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}