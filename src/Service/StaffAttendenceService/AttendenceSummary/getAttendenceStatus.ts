export const getAttendenceStatus = (AttendenceSummary) => {
    return AttendenceSummary.rawAttributes.status.values;
};