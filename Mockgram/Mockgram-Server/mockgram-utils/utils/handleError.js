const response = require('./response');
exports.handleError = (res, err) => {
    console.log(err);
    return res.json({
        status: response.ERROR.SERVER_ERROR.CODE,
        msg: response.ERROR.SERVER_ERROR.MSG,
        data: err
    })
}