import * as punchingService from "../../../Service/StaffAttendenceService/PunchingService/getPunchingDetails.js";
import { getPaginationResponse, getPagination } from "../../../utils/pagination.js";
export const getPunchingDetails = async (req, res, hrModels) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const punching = await punchingService.getPunchingDetails(limit, offset, hrModels.Punching);
        const response = getPaginationResponse(punching, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}