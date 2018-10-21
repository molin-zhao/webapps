// used to create, sign, and verify tokens
const response = require('./response');
const decodeToken = require('./authenticate').decodeToken;
const handleError = require('./handleError').handleError;

exports.verifyAuthorization = function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
        return decodeToken(token, (err, decoded) => {
            if (err) return handleError(res, err);
            req.user = decoded;
            next();
        })
    } else {
        return res.json({
            status: response.ERROR.NO_TOKEN_PROVIDED.CODE,
            msg: response.ERROR.NO_TOKEN_PROVIDED.MSG
        })
    }
}

exports.verifyUser = function (req, res, next) {
    let queryId = req.params.id || req.body.id || req.query.id;
    let userId = req.user ? req.user._id : null;
    console.log(queryId);
    console.log(userId);
    if (queryId && queryId === userId) {
        next();
    } else {
        return res.json({
            status: response.ERROR.FORBIDDEN.CODE,
            msg: response.ERROR.FORBIDDEN.MSG
        });
    }
};