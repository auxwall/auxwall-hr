import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as deviceService from "../../Service/DeviceService/deleteDevice.js";

export const deleteDevice = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const device = await deviceService.deleteDevice(id, hrModels);
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
