import * as Staff from "../Service/Staff.js";

export const createStaff = async (req, res) => {
    try {
        const staff = await Staff.createStaff(req.body);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getStaff = async (req, res) => {
    try {
        const staff = await Staff.getStaff();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}