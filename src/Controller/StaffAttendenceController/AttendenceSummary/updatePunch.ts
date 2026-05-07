import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import { Sequelize } from "sequelize";
import * as punchService from "../../../Service/StaffAttendenceService/AttendenceSummary/updatePunch.js";

export const updatePunch = async (req: Request, res: Response, hrModels: HRModels, sequelize: Sequelize) => {
    try {
        console.log("BODY:", req.body);
        console.log("QUERY:", req.query);
        console.log("PARAMS:", req.params);
        const id = parseInt(req.params.id);
        const date = req.query.date || req.body.date;
        if (!date) {
            return res.status(400).json({
                message: "Date is required"
            });
        }
        const attendence = await punchService.updatePunch(
            id,
            date,
            hrModels,
            req.body.punches
            // sequelize
        );
        res.status(200).json(attendence);
    } catch (error) {
        console.error("UPDATE_PUNCH_ERROR:", error); // 👈 add this
        res.status(500).json({
            message: error.message
        });
    }
}