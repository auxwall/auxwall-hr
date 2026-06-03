import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as deviceService from "../../Service/DeviceService/getDeviceById.js";

export const getDeviceById = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const device = await deviceService.getDeviceById(id, hrModels.Device);
        res.status(200).json(device);
    } catch (error) {
        const status = (error as any).status || 500;
        res.status(status).json({ error: error.message });
    }
}