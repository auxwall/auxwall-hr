// import { HRModels } from '../../../types.js';
// import { Request, Response } from 'express';
// import * as shiftServie from "../../../Service/StaffAttendenceService/StaffShiftService/viewShiftById.js";
// export const viewShift = async (req: Request, res: Response, hrModels: HRModels) => {
//     try {

//         const shiftId = parseInt(req.params.id);

//         const viewShifts = await shiftServie.viewShiftById(shiftId, hrModels.StaffShift, hrModels.Department);
//         res.status(200).json(viewShifts);
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }