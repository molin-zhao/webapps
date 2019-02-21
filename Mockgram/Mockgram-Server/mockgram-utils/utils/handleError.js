const response = require('./response');
exports.handleError = (res, err, errType = response.ERROR.SERVER_ERROR) => {
    console.log(err);
    return res.json({
        status: errType.CODE,
        msg: errType.MSG,
        data: err
    })
}