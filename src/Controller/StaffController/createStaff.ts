import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as staffService from "../../Service/StaffService/createStaff.js";

export const createStaff = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const staff = await staffService.createStaff(req.body, hrModels);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}