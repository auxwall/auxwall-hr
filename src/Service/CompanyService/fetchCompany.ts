import { HRModels } from "../../types.js";

const fetchCompanyService = async (companyId: any, hrModels: HRModels) => {
    const data = await hrModels.Company.findOne({
        where: { id: companyId }
    });

    return data;
};

export default fetchCompanyService;