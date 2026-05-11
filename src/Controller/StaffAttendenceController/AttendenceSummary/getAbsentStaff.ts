import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import {
    getPagination,
    getPaginationResponse
} from '../../../utils/pagination.js';

import { getAbsentStaffService } from "../../../Service/StaffAttendenceService/AttendenceSummary/getAbsentStaff.js";

export const getAbsentStaffController = async (
    req: Request,
    res: Response,
    hrModels: HRModels
) => {

    try {

        const { page, size, from, to, name } = req.query;

        // ✅ pagination
        const { limit, offset } = getPagination(page, size);

        // ✅ service call
        const result = await getAbsentStaffService(
            limit,
            offset,
            from,
            to,
            name,
            hrModels
        );

        // ✅ wrap result like attendance summary
        const wrappedResult = {
            count: result.count,
            rows: result.rows
        };

        // ✅ pagination response
        const response = getPaginationResponse(
            wrappedResult,
            page,
            limit
        );

        return res.status(200).json({
            ...response
        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};