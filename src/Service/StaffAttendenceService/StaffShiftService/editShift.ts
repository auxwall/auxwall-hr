export const editShift = async (id, shift, StaffShiftModel) => {
    const selectedShift = await StaffShiftModel.findByPk(id);
    if (!selectedShift) {
        const error = new Error(`Shift with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await selectedShift.update(shift);
    return selectedShift;
}