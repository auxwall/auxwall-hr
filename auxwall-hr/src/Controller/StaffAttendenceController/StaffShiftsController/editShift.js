import * as shiftService from "../../../Service/StaffAttendenceService/StaffShiftService/editShift.js";

export const editShift = async (req, res, hrModels) => {
    try {
        const id = parseInt(req.params.id);
        const shift = await shiftService.editShift(id, req.body, hrModels.StaffShift);
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
