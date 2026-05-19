const errorHandler = require("../../middleware/errorHandler");
const fetchCompanyService = require("../../Service/CompanyService/fetchCompany");

const fetchCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        const data = await fetchCompanyService(companyId);

        if (!data) {
            return errorHandler.getNotFoundMessage("Company not found", res);
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

module.exports = fetchCompany;