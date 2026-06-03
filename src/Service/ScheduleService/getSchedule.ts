// export const getSchedules = async (type, hrModels, companyId = null, departmentId = null, offset, limit) => {
//     const { Schedule, StaffShift, Department } = hrModels;

//     // 1️⃣ Fetch schedules
//     const schedules = await Schedule.findAndCountAll({
//         limit,
//         offset,
//         where: {
//             companyId,
//             ...(type ? { type: type.toLowerCase() } : {}),
//             ...(departmentId ? { departmentId } : {})
//         }, include: [
//             {
//                 model: Department,
//                 as: 'department',
//                 attributes: ['id', 'name']
//             }
//         ]
//     });

//     // 2️⃣ Fetch all shifts
//     const allShifts = await StaffShift.findAll({
//         where: { companyId },
//         attributes: ["id", "shiftName"]
//     });

//     // 3️⃣ Map shift IDs in schedule.data to shift names
//     const schedulesWithShiftNames = schedules.rows.map(s => {
//         const mappedData = {};
//         for (const [day, shiftId] of Object.entries(s.data)) {
//             const shift = allShifts.find(sh => sh.id === shiftId);
//             mappedData[day] = shift ? shift.shiftName : null;
//         }
//         return {
//             id: s.id,
//             type: s.type,
//             name: s.name,
//             companyId: s.companyId,
//             departmentId: s.departmentId,
//             departmentName: s.department?.name,
//             data: mappedData
//         };
//     });

//     return schedulesWithShiftNames;
// };
export const getSchedules = async (
    type,
    hrModels,
    companyId = null,
    departmentId = null,
    offset,
    limit
) => {
    const { Schedule, StaffShift, Department } = hrModels;

    const schedules = await Schedule.findAndCountAll({
        limit,
        offset,
        where: {
            companyId,
            ...(type ? { type: type.toLowerCase() } : {}),
            ...(departmentId ? { departmentId } : {})
        },
        include: [
            {
                model: Department,
                as: "department",
                attributes: ["id", "name"]
            }
        ]
    });

    const allShifts = await StaffShift.findAll({
        where: { companyId },
        attributes: ["id", "shiftName"]
    });

    const rows = schedules.rows.map(s => {
        const mappedData = {};

        for (const [day, shiftId] of Object.entries(s.data || {})) {
            const shift = allShifts.find(sh => sh.id === shiftId);

            mappedData[day] = shift ? shift.shiftName : null;
        }

        return {
            id: s.id,
            type: s.type,
            name: s.name,
            companyId: s.companyId,
            departmentId: s.departmentId,
            departmentName: s.department?.name,
            data: mappedData
        };
    });

    return {
        count: schedules.count,
        rows
    };
};