import { Op } from "sequelize";

export const monthlyReport = async (hrModels, year, month) => {
    const { AttendenceSummary, Staff } = hrModels;
    let _year = year ? year : new Date().getFullYear();
    let _month = month ? month : new Date().getMonth();
    const startDate = new Date(_year, _month, 1);
    const endDate = new Date(_year, _month + 1, 0);

    const totalLeaveOfMonth = await AttendenceSummary.count({
        where: {
            status: "Absent",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalPresentOfMonth = await AttendenceSummary.count({
        where: {
            status: "Present",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalLateOfMonth = await AttendenceSummary.count({
        where: {
            status: "Late",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalLeaveOfSpecificStaff = async (staffId) => {
        return await AttendenceSummary.count({
            where: {
                staffId: staffId,
                status: "Absent",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const totalPresentOfSpecificStaff = async (staffId) => {
        return await AttendenceSummary.count({
            where: {
                staffId: staffId,
                status: "Present",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }



    const totalLateOfSpecificStaff = async (staffId) => {
        return await AttendenceSummary.count({
            where: {
                staffId: staffId,
                status: "Late",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }
    const totalHalfDayOfSpecificStaff = async (staffId) => {
        return await AttendenceSummary.count({
            where: {
                staffId: staffId,
                status: "Half Day",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const overtimeOfSpecificStaff = async (staffId) => {
        return await AttendenceSummary.sum('overtimeMinutes', {
            where: {
                staffId: staffId,
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const staffList = await Staff.findAll({
        attributes: [Staff.primaryKeyAttribute, 'name']
    })
    const monthlyReport = await Promise.all(
        staffList.map(async (staff) => {
            const primaryKeyAttribute = Staff.primaryKeyAttribute;
            const totalLeave = await totalLeaveOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalPresent = await totalPresentOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalLate = await totalLateOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalHalfDay = await totalHalfDayOfSpecificStaff(staff[primaryKeyAttribute]);
            const overtime = await overtimeOfSpecificStaff(staff[primaryKeyAttribute]);
            return {
                staffId: staff[primaryKeyAttribute],
                staffName: staff.name,
                totalLeave,
                totalPresent,
                totalLate,
                totalHalfDay,
                overtime
            }
        }
        ));

    return {
        totalLeaveOfMonth,
        totalPresentOfMonth,
        totalLateOfMonth,
        monthlyReport
    }
}
