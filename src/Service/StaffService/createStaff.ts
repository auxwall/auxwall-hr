import { HRModels } from '../../types.js';
export async function createStaff(staff, hrModels) {
    const newStaff = await hrModels.Staff.create(staff);
    return newStaff;
}
