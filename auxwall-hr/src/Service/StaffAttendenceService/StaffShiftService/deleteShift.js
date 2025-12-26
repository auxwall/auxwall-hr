export const deleteShift = async (id, StaffShiftModel) => {
    const selectedShift = await StaffShiftModel.findByPk(id);
    if (!selectedShift) {
        const error = new Error(`Shift with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await selectedShift.destroy();
    return selectedShift;
}