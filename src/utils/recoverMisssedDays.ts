import { HRModels } from "../types.js";
import { runSyncTask } from "./runSync.js";
import moment from "moment";

/**
 * Recover attendance for missed days.
 * Automatically handles first-time runs and updates CronLog.
 */
export const recoverMissedDays = async (hrModels: HRModels) => {
    try {
        // 1️⃣ Get last run date from CronLog
        const cronLog = await hrModels.CronLog.findOne({
            where: { jobName: 'ABSENT_SYNC' }
        });

        // 2️⃣ Safe fallback: use yesterday if no cronLog exists
        const lastRunDateValue = cronLog?.getDataValue('lastRunDate') as string | undefined;
        const startDate = lastRunDateValue
            ? moment(lastRunDateValue)
            : moment().subtract(1, "day");

        // 3️⃣ Today’s date (we won't go past this)
        const today = moment();

        console.log(`⏳ Starting attendance recovery from ${startDate.format("YYYY-MM-DD")} to ${today.format("YYYY-MM-DD")}`);

        // 4️⃣ Loop through all missed days (inclusive)
        for (
            let currentDate = startDate.clone();
            currentDate.isSameOrBefore(today, "day");
            currentDate.add(1, "day")
        ) {
            const dateStr = currentDate.format("YYYY-MM-DD");
            console.log(`🔄 Recovering attendance for ${dateStr}`);
            await runSyncTask(hrModels, dateStr);
        }

        // 5️⃣ Update CronLog to mark last successful run
        await hrModels.CronLog.upsert({
            jobName: 'ABSENT_SYNC',
            lastRunDate: today.format("YYYY-MM-DD")
        });

        console.log("✅ Attendance recovery complete");

    } catch (error) {
        console.error("❌ Failed to sync attendance:", error);
    }
};
