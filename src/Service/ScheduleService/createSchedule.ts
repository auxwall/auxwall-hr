// services/scheduleService.js
export const saveSchedule = async (type, data, Schedule, companyId = null, departmentId = null, name = null) => {
    // Upsert: insert if not exists, update if exists (based on type + companyId + departmentId)
    return Schedule.upsert({
        type,
        data,
        companyId,
        departmentId,
        name
    });
};
