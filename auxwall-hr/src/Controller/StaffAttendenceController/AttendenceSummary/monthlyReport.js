import * as attendanceSummaryService from "../../../Service/StaffAttendenceService/AttendenceSummary/monthlyReport.js"

export const monthlyReport = async (req, res, hrModels) => {
    try {
        const { year, month } = req.query;
        const result = await attendanceSummaryService.monthlyReport(hrModels, year, month);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching monthly report:", error);
        res.status(500).json({ error: "Failed to fetch monthly report" });
    }
}