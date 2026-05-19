export const updateSchedule = async (
    id,
    data,
    Schedule
) => {

    if (!id) {
        throw new Error("Schedule ID is required");
    }

    if (!data) {
        throw new Error("Schedule data is required");
    }

    /* =========================
       1️⃣ FIND SCHEDULE
    ========================= */

    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
        throw new Error("Schedule not found");
    }

    /* =========================
       2️⃣ NORMALIZE EXISTING DATA
    ========================= */

    const existingData =
        typeof schedule.data === "string"
            ? JSON.parse(schedule.data)
            : schedule.data || {};

    /* =========================
       3️⃣ NORMALIZE NEW DATA
    ========================= */

    const newData =
        typeof data === "string"
            ? JSON.parse(data)
            : data;

    /* =========================
       4️⃣ MERGE DATA (SAFE UPDATE)
    ========================= */

    const mergedData = {
        ...existingData,
        ...newData
    };

    /* =========================
       5️⃣ UPDATE SCHEDULE
    ========================= */

    await schedule.update({
        data: mergedData
    });

    /* =========================
       6️⃣ RETURN RESPONSE
    ========================= */

    return {
        message: "Schedule updated successfully",
        schedule
    };
};