export const updateUnauthorizedAttendence = async (id, attendence, AttendenceModel) => {
    const selectedAttendence = await AttendenceModel.findByPk(id);
    if (!selectedAttendence) {
        const error = new Error(`Attendence with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await selectedAttendence.update(attendence);
    return selectedAttendence;
}