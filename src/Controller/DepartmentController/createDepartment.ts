import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as departmentService from "../../Service/DepartmentService/createDepartment.js";

export const createDepartment = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const department = await departmentService.createDepartment(req.body, hrModels.Department);
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}