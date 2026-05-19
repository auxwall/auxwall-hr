import { HRModels } from "../../types.js";

const fetchAllCompaniesService = async (hrModels: HRModels) => {
    const data: any = await hrModels.Company.findAll();
    return data;
};

export default fetchAllCompaniesService;