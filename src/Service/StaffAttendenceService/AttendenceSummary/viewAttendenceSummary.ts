import { HRModels } from '../../../types.js';
export const viewAttendenceSummary = async (limit: any, offset: any, hrModels: HRModels) => {
    try {
        const { AttendenceSummary, Staff } = hrModels;

        const result = await AttendenceSummary.findAndCountAll({
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['fullName']
                }
            ],
            limit: limit,
            offset: offset,
            order: [
                ['attendenceDate', 'DESC']
            ]
        });
        return result;
    } catch (error) {
        console.error("Error fetching attendence summary:", error);
        throw error;
    }
}