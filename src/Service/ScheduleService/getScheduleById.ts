export async function getScheduleById(id, hrModels) {
    const schedule = await hrModels.Schedule.findByPk(id);
    if (!schedule) {
        const error = new Error(`Schedule with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    return schedule;
}