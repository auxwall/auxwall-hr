import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as categoriesService from "../../Service/CategoriesService/updateCategory.js";

export const updateCategory = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoriesService.updateCategory(id, req.body, hrModels.Category);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}