import { HRModels } from "../types.js";
import moment from "moment";

export const runSyncTask = async (
    hrModels: HRModels,
    date?: string
) => {
    const { Staff, AttendenceSummary, Company, StaffShift } = hrModels;

    try {
        const formattedDate = date
            ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
            : moment().subtract(1, "day").format("YYYY-MM-DD");

        console.log(`--- Syncing Absent Data for: ${formattedDate} ---`);

        const primaryKeyField = Staff.primaryKeyAttribute || "id";

        const allStaff = await Staff.findAll({
            where: { status: true },
            attributes: [primaryKeyField, "fullName"],
            include: [
                {
                    model: Company,
                    attributes: ["id"],
                    through: { attributes: [] },
                },
            ],
        });

        const allShifts = await StaffShift.findAll();

        const absentRecord = allStaff.flatMap((staff: any) => {
            const actualId = staff[primaryKeyField];
            const shift: any = allShifts.find(
                (s: any) => s.staffId === actualId
            );

            const companies =
                staff.Company_Detials?.length > 0
                    ? staff.Company_Detials
                    : [{ id: null }];

            return companies.map((company: any) => ({
                staffId: actualId,
                staffName: staff.fullName || null,
                attendenceDate: formattedDate, // ✅ FIXED
                shiftStart: shift?.shiftStart || "09:00",
                shiftEnd: shift?.shiftEnd || "18:00",
                first_in: null,
                last_out: null,
                companyId: company.id,
                workedMinutes: 0,
                lateMinutes: 0,
                overtimeMinutes: 0,
                breakMinutes: 0,
                totalPunches: 0,
                status: "Absent",
            }));
        });

        if (absentRecord.length > 0) {
            await AttendenceSummary.bulkCreate(absentRecord, {
                ignoreDuplicates: true,
            });

            console.log(
                `✅ Successfully finalized absent data for ${formattedDate}`
            );
        } else {
            console.log("No staff found to sync.");
        }
    } catch (error: any) {
        console.error(
            "Error updating absent data:",
            error
        );
    }
};
