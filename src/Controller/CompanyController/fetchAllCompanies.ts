const errorHandler = require("../../middleware/errorHandler");
const fetchAllCompaniesService = require("../../Service/CompanyService/fetchAllCompanies");

const fetchAllCompanies = async (req, res) => {
    try {
        const data = await fetchAllCompaniesService();

        if (!data || data.length === 0) {
            return errorHandler.getNotFoundMessage(
                "Companies not found",
                res
            );
        }

        return errorHandler.getMessageResult(
            data,
            "Company details",
            res
        );

    } catch (err) {
        console.log(err);
        return errorHandler.serverError(res, err.message);
    }
};

export default fetchAllCompanies;