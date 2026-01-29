import { HRModels } from '../../../types.js';
import { Op } from 'sequelize';
function formatMinutesToHoursMinutes(minutes: number) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
}

export const viewAttendenceSummary = async (
    limit: number,
    offset: number,
    hrModels: HRModels,
    companyId: number,
    name,
    status,
    from,
    to
) => {
    try {
        const { AttendenceSummary, Staff, StaffShift } = hrModels;

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        // 1️⃣ Calculate totals using 'status' column
        const [totalLateStaff, totalAbsentStaff, totalPresentStaff, totalHalfDayStaff] = await Promise.all([
            AttendenceSummary.count({
                where: {
                    companyId,
                    status: 'Late',
                    attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
                }
            }),
            AttendenceSummary.count({
                where: {
                    companyId,
                    status: 'Absent',
                    attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
                }
            }),
            AttendenceSummary.count({
                where: {
                    companyId,
                    status: 'Present',
                    attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
                }
            }),
            AttendenceSummary.count({
                where: {
                    companyId,
                    status: 'Half Day',
                    attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
                }
            })
        ]);
        const whereClause: any = {};
        if (companyId) {
            whereClause.companyId = companyId
        }
        if (name) {
            whereClause.staffName = { [Op.iLike]: `%${name}%` }
        }
        if (status) {
            whereClause.status = status
        }
        if (from || to) {
            whereClause.attendenceDate = {};

            if (from) {
                const startDate = new Date(from);
                startDate.setHours(0, 0, 0, 0);
                whereClause.attendenceDate[Op.gte] = startDate;
            }
            if (to) {
                const endDate = new Date(to);
                endDate.setHours(23, 59, 59, 999);
                whereClause.attendenceDate[Op.lte] = endDate;
            }
        }
        // 2️⃣ Fetch paginated rows
        const result = await AttendenceSummary.findAndCountAll({
            include: [{ model: Staff, as: 'staff', attributes: ['fullName', 'shiftId'] }],
            where: whereClause,
            limit,
            offset,
            order: [['attendenceDate', 'DESC']]
        });

        // 3️⃣ Fetch shifts once
        const allShifts = await StaffShift.findAll({ attributes: ['id', 'shiftName'] });

        // 4️⃣ Map rows
        const mappedRows = result.rows.map((record: any) => {
            const staffShiftId = record.staff.shiftId;
            const shift = allShifts.find((s: any) => s.get('id') === staffShiftId);
            const shiftName = shift?.get('shiftName') || null;

            return {
                ...record.toJSON(),
                staffName: record.staff.fullName,
                shiftName,
                workedTime: formatMinutesToHoursMinutes(record.workedMinutes),
                lateTime: formatMinutesToHoursMinutes(record.lateMinutes),
                overtime: formatMinutesToHoursMinutes(record.overtimeMinutes),
                status: record.status // take status directly from DB
            };
        });

        return {
            count: result.count,
            totalLateStaff,
            totalAbsentStaff,
            totalPresentStaff,
            totalHalfDayStaff,
            rows: mappedRows
        };
    } catch (error) {
        console.error("Error fetching attendence summary:", error);
        throw error;
    }
};
