export const createShift = async (shiftData, StaffShift) => {
    const shift = await StaffShift.create(shiftData);
    return shift;
}