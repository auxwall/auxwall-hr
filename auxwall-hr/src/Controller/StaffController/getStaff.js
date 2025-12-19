import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as staffService from "../../Service/StaffService/getStaff.js";

export const getStaff = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const staff = await staffService.getStaff(limit, offset);
        const response = getPaginationResponse(staff, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}