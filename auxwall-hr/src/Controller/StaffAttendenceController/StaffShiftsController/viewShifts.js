import * as shiftServie from "../../../Service/StaffAttendenceService/StaffShiftService/viewShifts.js";
import { getPagination, getPaginationResponse } from "../../../utils/pagination.js"
export const viewShifts = async (req, res, hrModels) => {
    try {
        const { size, page } = req.query;
        const { limit, offset } = getPagination(page, size);
        const viewShifts = await shiftServie.viewShifts(limit, offset, hrModels.StaffShift);
        const response = getPaginationResponse(viewShifts, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}