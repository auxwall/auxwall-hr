const httpStatus = require("http-status");

module.exports = {

    getExistsResult: function (result, res) {
        res.status(httpStatus.OK).json({ "status": false, error: result, msg: result });
    },

    getSuccessResult: function (result, res) {
        // let jsonMsg = (result && result.msg) ? { "status": true, data: JSON.parse(result.data), msg: result?.msg } : { "status": true, data: JSON.parse(result.data) };
        res.status(httpStatus.OK).json({
            "status": true, data: typeof (result?.data) == 'string' ? JSON.parse(result?.data) : result?.data, msg: result?.msg || "",
            ...(result?.pagination ? { pagination: result.pagination } : {})
        });
    },
    getSuccessMessage: function (msg, res) {
        let jsonMsg = { "status": true, msg: msg }
        res.status(httpStatus.OK).json(jsonMsg);
    },

    getMessageResult: function (response, msg, res) {

        if (response?.length === 1) {
            const data = Object.assign({}, ...response);
            res.status(httpStatus.OK).json({ "status": true, data: data, msg: msg });
        }
        else if (typeof (response) == "string") {
            res.status(httpStatus.OK).json({ "status": true, data: JSON.parse(response), msg: msg });
        }
        else {
            res.status(httpStatus.OK).json({ "status": true, data: response, msg: msg });
        }
    },

    getNotExistsResult: function (response, res) {
        res.status(httpStatus.OK).json({ "status": false, msg: response });
    },

    getBadRequestResult: function (result, res) {
        res.status(httpStatus.BAD_REQUEST).json({ "status": false, msg: 'Bad request found' });
    },

    getBadRequestMessage: function (msg, res) {
        res.status(httpStatus.BAD_REQUEST).json({ "status": false, msg: msg });
    },

    getNotFoundMessage: function (msg, res) {
        res.status(httpStatus.NOT_FOUND).json({ "status": false, msg: msg });
    },

    getErrorResult: function (errResp, res) {
        res.status(httpStatus.BAD_REQUEST).json({ "status": false, error: errResp.message ? errResp.message : errResp, msg: errResp.message ? errResp.message : errResp });
    },
    getErrorMessage: function (msg, res) {
        res.status(httpStatus.BAD_REQUEST).json({ "status": false, msg: msg });
    },

    getMessageResultPagination: function (response, msg, res) {
        res.status(httpStatus.OK).json({ "status": true, data: response.rows, count: response.count, pages: response.pages, msg: msg, basePath: response.basePath });
    },

    serverError: function (res, error) {
        try {

            res?.status(httpStatus.INTERNAL_SERVER_ERROR).json({ "status": false, error: "Internal server error", msg: error });
        } catch (err) {
            console.log(err)
        }
    }
}