// export const deleteUnauthorizedAttendence = async (id, AttendenceModel) => {
//     const selectedAttendence = await AttendenceModel.findByPk(id);
//     if (!selectedAttendence) {
//         const error = new Error(`Attendence with ID ${id} not found.`);
//         (error as any).status = 404;
//         throw error;
//     }
//     await selectedAttendence.destroy();
//     return selectedAttendence;
// }
export const deleteUnauthorizedAttendence = async (
    id,
    AttendenceModel,
    AttendenceTransaction,
    StaffModel
) => {

    // 1. Get HR attendance record
    const selectedAttendence = await AttendenceModel.findByPk(id);

    if (!selectedAttendence) {
        const error = new Error(`Attendence with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    // 2. Fetch staff details (optional but safer if name comes from Staff table)
    const staff = await StaffModel.findByPk(selectedAttendence.staffId);

    if (!staff) {
        const error = new Error(`Staff not found for attendance ID ${id}`);
        (error as any).status = 404;
        throw error;
    }

    const staffId = selectedAttendence.staffId;
    const attendenceDate = selectedAttendence.attendenceDate;

    // 3. Delete from HR table
    await selectedAttendence.destroy();

    // 4. Delete from MAIN transaction table using staffId + date + name
    if (AttendenceTransaction) {
        await AttendenceTransaction.destroy({
            where: {
                staffId: staffId,
                attendenceDate: attendenceDate,
                staffName: staff.fullName // or selectedAttendence.staffName
            }
        });
    }

    return selectedAttendence;
};