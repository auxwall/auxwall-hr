import * as punchingService from "../../../Service/StaffAttendenceService/PunchingService/markPunches.js";
export const markPunches = async (req, res, hrModels) => {
    try {
        const punching = await punchingService.markPunches(req.body, hrModels.Punching);
        res.status(200).json(punching);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}