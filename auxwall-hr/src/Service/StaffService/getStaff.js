import { Staff } from "../../models/index.js";

export async function getStaff(limit, offset) {
    const staff = await Staff.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return staff;
}