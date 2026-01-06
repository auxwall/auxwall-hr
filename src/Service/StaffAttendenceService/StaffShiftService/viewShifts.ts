export const viewShifts = async (limit, offset, staffShift) => {
    const viewShifts = await staffShift.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'ASC']
        ]
    });
    return viewShifts;
}