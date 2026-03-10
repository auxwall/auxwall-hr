import { HRModels } from "../types.js";
import { QueryTypes } from "sequelize";
import { Sequelize } from "sequelize";
import { updateAttendanceSummary } from "./attendenceLogic.js";

export const processAttendanceQueue = async (sequelize: Sequelize, hrModels: HRModels) => {
    console.log("🟡 processAttendanceQueue started");

    const records = await sequelize.query(
        `
    SELECT q.id AS queue_id, a.*
    FROM attendance_summary_queue q
    JOIN attendance_transactions a
      ON a.id = q.attendance_id
    WHERE q.processed = false
    ORDER BY q.created_at
    `,
        { type: QueryTypes.SELECT }
    );
    console.log("📦 Queue records count:", (records as any[]).length);
    console.log("📦 Queue records raw:", records);
    for (const record of records as any[]) {
        console.log("🟢 Processing queue row:", record.queue_id);
        try {
            console.log("➡️ Calling updateAttendanceSummary");

            await updateAttendanceSummary(record, hrModels);

            await sequelize.query(
                `UPDATE attendance_summary_queue SET processed = true WHERE id = :id`,
                { replacements: { id: record.queue_id } }
            );
        } catch (err) {
            console.error("Failed to process attendance summary:", err);
        }
    }
};