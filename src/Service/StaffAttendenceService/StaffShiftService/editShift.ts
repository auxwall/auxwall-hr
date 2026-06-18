export const editShift = async (id, shift, StaffShiftModel) => {

    const selectedShift = await StaffShiftModel.findByPk(id);

    if (!selectedShift) {
        const error = new Error(`Shift with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    const updatedData = {
        shiftName: shift.shiftName ?? selectedShift.shiftName,
        shiftStart: shift.shiftStart ?? selectedShift.shiftStart,
        shiftEnd: shift.shiftEnd ?? selectedShift.shiftEnd,
        breakMinutes: shift.breakMinutes ?? selectedShift.breakMinutes,
        lateGraceMinutes: shift.lateGraceMinutes ?? selectedShift.lateGraceMinutes,
        overtimeMinutes: shift.overtimeMinutes ?? selectedShift.overtimeMinutes,
        shiftColor: shift.shiftColor ?? selectedShift.shiftColor,
        departmentId: shift.departmentId ?? selectedShift.departmentId,
        uploadedBy: shift.uploadedBy ?? selectedShift.uploadedBy
    };

    await selectedShift.update(updatedData);

    return selectedShift;
};