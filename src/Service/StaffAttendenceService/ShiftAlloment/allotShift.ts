import { Op } from "sequelize";

export const updateStaffShiftAllotment = async (
    staffId,
    companyId,
    shiftId,
    scheduleId,
    Staff,
    CompanyUserRelation
) => {

    /* =========================
       1️⃣ CHECK STAFF BELONGS TO COMPANY
    ========================= */

    const companyUser = await CompanyUserRelation.findOne({
        where: {
            companyId,
            userId: staffId
        }
    });

    if (!companyUser) {
        return {
            success: false,
            message: "Staff does not belong to this company"
        };
    }

    /* =========================
       2️⃣ UPDATE STAFF SHIFT + SCHEDULE
    ========================= */

    const [updatedRows] = await Staff.update(
        {
            shiftId,
            scheduleId
        },
        {
            where: {
                id: staffId
            }
        }
    );

    if (updatedRows === 0) {
        return {
            success: false,
            message: "Staff not found or not updated"
        };
    }

    /* =========================
       3️⃣ RETURN UPDATED DATA
    ========================= */

    const updatedStaff = await Staff.findOne({
        where: { id: staffId },
        attributes: [
            "id",
            "fullName",
            "shiftId",
            "scheduleId",
            "departmentId"
        ]
    });

    return {
        success: true,
        message: "Shift allotment updated successfully",
        data: updatedStaff
    };
};