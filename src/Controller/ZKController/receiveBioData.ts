import * as zkService
    from "../../Service/ZKService/saveBiometric.js";
import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
export const receiveBioData = async (
    req: Request,
    res: Response,
    hrModels: HRModels
) => {

    try {

        const body = req.body;

        const parsed: any = {};

        body.split('\t').forEach((item: any) => {

            const [k, v] = item.split('=');

            parsed[k] = v;
        });

        await zkService.saveBiometric(
            parsed,
            hrModels.ZKBiometric
        );

        await hrModels.Staff.update(
            {
                faceRegistered: true
            },
            {
                where: {
                    id: parsed.PIN
                }
            }
        );

        res.send("OK");

    } catch (error) {

        console.log(error);

        res.send("OK");
    }
};