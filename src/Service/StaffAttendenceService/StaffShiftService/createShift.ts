import { Op } from "sequelize";
export const createShift = async (shiftData, StaffShift) => {

    const existingShift = await StaffShift.findOne({
        where: {
            [Op.or]: [
                { shiftName: shiftData.shiftName },
                { shiftColor: shiftData.shiftColor }
            ]
        }
    });

    if (existingShift) {
        if (existingShift.shiftName === shiftData.shiftName) {
            throw new Error("Shift already exists");
        }

        if (existingShift.shiftColor === shiftData.shiftColor) {
            throw new Error("Color already exists");
        }
    }

    return await StaffShift.create(shiftData);
};