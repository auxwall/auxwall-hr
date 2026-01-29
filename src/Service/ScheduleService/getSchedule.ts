export const getAllSchedules = async (type, hrModels, companyId = null, departmentId = null) => {
    const { Schedule, StaffShift } = hrModels;

    // 1️⃣ Fetch schedules
    const schedules = await Schedule.findAll({
        where: {
            companyId,
            ...(type ? { type: type.toLowerCase() } : {}),
            ...(departmentId ? { departmentId } : {})
        }
    });

    // 2️⃣ Fetch all shifts
    const allShifts = await StaffShift.findAll({
        where: { companyId },
        attributes: ["id", "shiftName"]
    });

    // 3️⃣ Map shift IDs in schedule.data to shift names
    const schedulesWithShiftNames = schedules.map(s => {
        const mappedData = {};
        for (const [day, shiftId] of Object.entries(s.data)) {
            const shift = allShifts.find(sh => sh.id === shiftId);
            mappedData[day] = shift ? shift.shiftName : null;
        }
        return {
            id: s.id,
            type: s.type,
            name: s.name,
            companyId: s.companyId,
            departmentId: s.departmentId,
            data: mappedData
        };
    });

    return schedulesWithShiftNames;
};
