import * as staffService from "../../Service/StaffService/createStaff.js";

export const createStaff = async (req, res) => {
    try {
        const staff = await staffService.createStaff(req.body);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}