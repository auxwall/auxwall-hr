import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as deviceService from "../../Service/DeviceService/createDevice.js";

export const createDevice = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const device = await deviceService.createDevice(req.body, hrModels);
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}