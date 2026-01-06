import cron from "node-cron";
import { HRModels } from "../types.js";

export const syncAttendence = async (hrModels: HRModels) => {
    const { AttendenceSummary, Staff, StaffShift } = hrModels;

    const runSyncTask = async () => {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedYesterday = yesterday.toISOString().split("T")[0];

            console.log(`--- Syncing Absent Data for: ${formattedYesterday} ---`);

            const primaryKeyField = Staff.primaryKeyAttribute || 'id';

            const [allStaff, allShifts] = await Promise.all([
                Staff.findAll({ attributes: [primaryKeyField, 'fullName'] }),
                StaffShift.findAll()
            ]);

            const absentRecord = allStaff.map((staff: any) => {
                const actualId = staff[primaryKeyField];
                const shift: any = allShifts.find((s: any) => s.staffId === actualId);
                return {
                    staffId: actualId,
                    staffName: staff.fullName || null,
                    attendenceDate: formattedYesterday,
                    shiftStart: shift?.shiftStart || "09:00",
                    shiftEnd: shift?.shiftEnd || "18:00",
                    first_in: null,
                    last_out: null,
                    workedMinutes: 0,
                    lateMinutes: 0,
                    overtimeMinutes: 0,
                    breakMinutes: 0,
                    totalPunches: 0,
                    status: "Absent"
                };
            });

            if (absentRecord.length > 0) {
                await AttendenceSummary.bulkCreate(absentRecord, { ignoreDuplicates: true });
                console.log(`✅ Successfully finalized absent data for ${formattedYesterday}`);
            } else {
                console.log("No staff found to sync.");
            }
        } catch (error: any) {
            console.error('Error updating yesterday\'s absent data:', error);
        }
    };

    await runSyncTask();
    cron.schedule("30 8 * * 1-6", runSyncTask);
};