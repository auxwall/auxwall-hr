import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as deviceService from "../../Service/DeviceService/getAllDevices.js";

export const getAllDevices = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size, status, name } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = req.params.companyId;
        const devices = await deviceService.getAllDevices(limit, offset, companyId, hrModels, status, name);
        const response = getPaginationResponse(devices, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}