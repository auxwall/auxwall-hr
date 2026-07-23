import * as zkService
    from "../../Service/ZKService/createEnrollFace.js";
import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
export const registerFace = async (
    req: Request,
    res: Response,
    hrModels: HRModels
) => {

    try {

        const { staffId, serialNumber } =
            req.body;

        const result = await zkService.createEnrollFace(
            staffId,
            serialNumber,
            hrModels.ZKCommand
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};