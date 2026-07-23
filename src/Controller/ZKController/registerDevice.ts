import * as zkService from "../../Service/ZKService/registerDevice.js";
import { HRModels } from "../../types.js";
import { Request, Response } from "express";
export const registerDevice = async (
    req: Request,
    res: Response,
    hrModels: HRModels
) => {
    try {
        const body = req.body;

        const parsed: any = {};

        // ZKTeco sends key=value format
        body.split('\t').forEach((item: string) => {
            const [k, v] = item.split('=');
            parsed[k] = v;
        });

        const result = await zkService.registerDevice(
            parsed,
            hrModels.ZKDevice
        );

        // IMPORTANT: ZKTeco expects plain text response
        res.setHeader("Content-Type", "text/plain");
        res.send(
            `registry=${result.registry}\nRegistryCode=${result.RegistryCode}`
        );

    } catch (error: any) {
        console.log(error);
        res.send("OK");
    }
};