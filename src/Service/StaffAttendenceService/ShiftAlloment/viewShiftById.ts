export const viewShiftById = async (
    Schedule,
    staffShift,
    Department,
    Staff,
    CompanyUserRelation,
    id
) => {

    /* =========================
       CHECK USER EXISTS
    ========================= */

    const companyUser = await CompanyUserRelation.findOne({
        where: {
            userId: id
        }
    });

    if (!companyUser) {
        return null;
    }

    /* =========================
       GET ALL SHIFTS
    ========================= */

    const allShifts = await staffShift.findAll({
        attributes: [
            "id",
            "shiftName",
            "shiftStart",
            "shiftEnd",
            "departmentId"
        ],
        raw: true
    });

    /* =========================
       CREATE SHIFT MAP
    ========================= */

    const shiftMap = new Map();

    allShifts.forEach((shift: any) => {
        shiftMap.set(shift.id, {
            shiftId: shift.id,
            shiftName: shift.shiftName,
            shiftStart: shift.shiftStart,
            shiftEnd: shift.shiftEnd,
            departmentId: shift.departmentId
        });
    });

    /* =========================
       GET STAFF DETAILS
    ========================= */

    const staff = await Staff.findOne({

        where: {
            id
        },

        attributes: [
            "id",
            "fullName",
            "shiftId",
            "scheduleId",
            "departmentId",
            "isFlexible"
        ],

        include: [

            // SHIFT
            {
                model: staffShift,
                as: "shift",
                attributes: [
                    "id",
                    "shiftName",
                    "shiftStart",
                    "shiftEnd",
                    "departmentId"
                ],

                include: [
                    {
                        model: Department,
                        as: "department",
                        attributes: ["id", "name"]
                    }
                ]
            },

            // SCHEDULE
            {
                model: Schedule,
                as: "schedule",
                attributes: [
                    "id",
                    "name",
                    "type",
                    "data"
                ]
            }
        ]
    });

    if (!staff) {
        return null;
    }

    /* =========================
       TRANSFORM RESPONSE
    ========================= */

    const plainStaff = staff.toJSON();

    let transformedSchedule = null;

    if (plainStaff.schedule) {

        const rawData =
            typeof plainStaff.schedule.data === "string"
                ? JSON.parse(plainStaff.schedule.data)
                : plainStaff.schedule.data || {};

        const transformedData: any = {};

        for (const key in rawData) {

            const shiftId = rawData[key];

            transformedData[key] =
                shiftId
                    ? shiftMap.get(shiftId) || null
                    : null;
        }

        transformedSchedule = {
            ...plainStaff.schedule,
            data: transformedData
        };
    }

    return {
        ...plainStaff,
        schedule: transformedSchedule
    };
};