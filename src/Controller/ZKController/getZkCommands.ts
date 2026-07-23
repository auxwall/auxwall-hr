import * as zkService
    from "../../Service/ZKService/getPendingCommand.js";
import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
export const getZkCommands = async (
    req: Request,
    res: Response,
    hrModels: HRModels
) => {

    try {

        const serialNumber =
            req.query.SN;

        const cmd = await zkService.getPendingCommand(
            serialNumber,
            hrModels.ZKCommand
        );

        if (!cmd) {

            return res.send("OK");
        }

        res.send(cmd);

    } catch (error) {

        res.send("OK");
    }
};