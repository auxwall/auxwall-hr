export const viewAttendenceSummary = async (limit, offset, hrModels) => {
    try {
        const { AttendenceSummary, Staff } = hrModels;

        const result = await AttendenceSummary.findAndCountAll({
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['name']
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