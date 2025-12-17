import * as Company from "../Service/Company.js";
export const createCompany = async (req, res) => {
    try {
        const company = await Company.createCompany(req.body);
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getCompany = async (req, res) => {
    try {
        const company = await Company.getCompany();
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}