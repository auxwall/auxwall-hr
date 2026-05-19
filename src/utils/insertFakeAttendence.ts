import { Op } from "sequelize";
import { HRModels } from "../types.js";

export const insertFakeAttendance = async (
    hrModels: HRModels,
    params: {
        staffId: number;
        companyId: number;
        eventDate?: Date;
    }
) => {
    const {
        Punching,
        Staff,
        CompanyUserRelation
    } = hrModels;

    const {
        staffId,
        companyId,
        eventDate = new Date()
    } = params;

    const transaction = await Punching.sequelize!.transaction();

    try {
        /* =========================
           1️⃣ VALIDATE COMPANY LINK
        ========================= */
        const relation = await CompanyUserRelation.findOne({
            where: {
                companyId,
                userId: staffId
            },
            transaction
        });

        if (!relation) {
            throw new Error("Staff is not linked to this company");
        }

        /* =========================
           2️⃣ GET STAFF DETAILS
        ========================= */
        const user: any = await Staff.findOne({
            where: { id: staffId },
            transaction
        });

        if (!user) {
            throw new Error("Staff not found");
        }

        /* =========================
           3️⃣ DUPLICATE CHECK (±10 sec)
        ========================= */
        const startWindow = new Date(eventDate.getTime() - 10 * 1000);
        const endWindow = new Date(eventDate.getTime() + 10 * 1000);

        const recent = await Punching.findOne({
            where: {
                companyId,
                staffId,
                eventDate: {
                    [Op.between]: [startWindow, endWindow]
                }
            },
            transaction
        });

        if (recent) {
            await transaction.rollback();
            return {
                success: false,
                message: "Duplicate fake attendance already exists"
            };
        }

        /* =========================
           4️⃣ INSERT FAKE ATTENDANCE
        ========================= */
        const attendance = await Punching.create(
            {
                device: "FAKE_DEVICE",
                deviceId: null,
                eventDate,
                verify_mode_name: "Fake",
                name: user.fullName,
                pin: null,
                eventCode: 0,
                eventStatus: "test",
                staffId,
                companyId
            },
            { transaction }
        );

        await transaction.commit();

        return {
            success: true,
            message: "Fake attendance inserted successfully",
            attendance
        };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};