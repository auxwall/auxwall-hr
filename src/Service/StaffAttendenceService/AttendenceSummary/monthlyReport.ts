import { HRModels } from '../../../types.js';
import { Op } from "sequelize";

export const monthlyReport = async (hrModels: HRModels, year: any, month: any, companyId: number) => {
    const { AttendenceSummary, Staff, Company } = hrModels;
    let _year = year ? year : new Date().getFullYear();
    let _month = month ? month : new Date().getMonth();
    const startDate = new Date(_year, _month, 1);
    const endDate = new Date(_year, _month + 1, 0);

    const totalLeaveOfMonth = await AttendenceSummary.count({
        where: {
            companyId,
            status: "Absent",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalPresentOfMonth = await AttendenceSummary.count({
        where: {
            companyId,
            status: "Present",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalLateOfMonth = await AttendenceSummary.count({
        where: {
            companyId,
            status: "Late",
            attendenceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    })
    const totalLeaveOfSpecificStaff = async (staffId: number) => {
        return await AttendenceSummary.count({
            where: {
                companyId,
                staffId: staffId,
                status: "Absent",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const totalPresentOfSpecificStaff = async (staffId: number) => {
        return await AttendenceSummary.count({
            where: {
                companyId,
                staffId: staffId,
                status: "Present",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }



    const totalLateOfSpecificStaff = async (staffId: number) => {
        return await AttendenceSummary.count({
            where: {
                companyId,
                staffId: staffId,
                status: "Late",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }
    const totalHalfDayOfSpecificStaff = async (staffId: number) => {
        return await AttendenceSummary.count({
            where: {
                companyId,
                staffId: staffId,
                status: "Half Day",
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const overtimeOfSpecificStaff = async (staffId: number) => {
        return await AttendenceSummary.sum('overtimeMinutes', {
            where: {
                companyId,
                staffId: staffId,
                attendenceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })
    }

    const staffList = await Staff.findAll({
        include: [{
            model: Company,
            where: { id: companyId },
            through: { attributes: [] }
        }],
        attributes: [Staff.primaryKeyAttribute || 'id', 'fullName']
    })
    const monthlyReport = await Promise.all(
        staffList.map(async (staff: any) => {
            const primaryKeyAttribute = Staff.primaryKeyAttribute || 'id';
            const totalLeave = await totalLeaveOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalPresent = await totalPresentOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalLate = await totalLateOfSpecificStaff(staff[primaryKeyAttribute]);
            const totalHalfDay = await totalHalfDayOfSpecificStaff(staff[primaryKeyAttribute]);
            const overtime = await overtimeOfSpecificStaff(staff[primaryKeyAttribute]);
            return {
                staffId: staff[primaryKeyAttribute],
                staffName: staff.fullName,
                totalLeave,
                totalPresent,
                totalLate,
                totalHalfDay,
                overtime: overtime || 0
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
