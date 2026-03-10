export async function deleteSchedule(id, hrModels) {
    const schedule = await hrModels.Schedule.findByPk(id);
    if (!schedule) {
        const error = new Error(`Schedule with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await schedule.destroy();
    return { message: `Schedule with ID ${id} deleted successfully.` };
}