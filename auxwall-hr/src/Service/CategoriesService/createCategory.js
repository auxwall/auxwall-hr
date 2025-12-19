import { Categories } from "../../models/index.js";

export async function createCategory(category) {
    const newCategory = await Categories.create(category);
    return newCategory;
}