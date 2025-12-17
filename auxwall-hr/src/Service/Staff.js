import { Staff } from "../models/index.js";

export async function createStaff(staff) {
    const newStaff = await Staff.create(staff);
    return newStaff;
}
export async function getStaff() {
    const staff = await Staff.findAll();
    return staff;
}