export const viewAttendenceSummary = async (limit, offset, AttendenceSummary) => {
    try {
        const result = await AttendenceSummary.findAndCountAll({
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