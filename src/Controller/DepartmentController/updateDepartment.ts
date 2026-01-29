import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as departmentService from "../../Service/DepartmentService/updateDepartment.js";

export const updateDepartment = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const department = await departmentService.updateDepartment(id, req.body, hrModels.Department);
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
