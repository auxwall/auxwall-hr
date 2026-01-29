import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as departmentService from "../../Service/DepartmentService/getDepartmentById.js";
export const getDepartmentById = async (req: Request, res: Response, hrModels: HRModels) => {
    try {

        const id = parseInt(req.params.id);

        const department = await departmentService.getDepartmentById(id, hrModels.Department);
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}