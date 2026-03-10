import { HRModels } from "../types.js";
import { Sequelize } from "sequelize";

export const setupAttendanceTrigger = async (hrModels: HRModels, sequelize: Sequelize) => {

    // 1️⃣ Create the queue table if it doesn't exist
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS attendance_summary_queue (
      id SERIAL PRIMARY KEY,
      attendance_id INT NOT NULL,
      processed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

    // 2️⃣ Create trigger function
    await sequelize.query(`
    CREATE OR REPLACE FUNCTION enqueue_attendance_summary()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO attendance_summary_queue (attendance_id)
        VALUES (NEW.id);
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    // 3️⃣ Create trigger (Postgres supports "IF NOT EXISTS" for triggers via a little workaround)
    const triggerExists = await sequelize.query(`
    SELECT tgname
    FROM pg_trigger
    WHERE tgname = 'trg_attendance_summary_enqueue';
  `);

    if ((triggerExists as any)[0].length === 0) {
        await sequelize.query(`
      CREATE TRIGGER trg_attendance_summary_enqueue
      AFTER INSERT ON attendance_transactions
      FOR EACH ROW
      EXECUTE FUNCTION enqueue_attendance_summary();
    `);
    }

    console.log("Attendance trigger & queue setup complete ✅");
};
