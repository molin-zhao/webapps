// used to create, sign, and verify tokens
const jwt = require('jsonwebtoken');
const config = require('../../config');
const response = require('./response');


exports.getToken = function (user) {
    return jwt.sign(user.toJSON(), config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyToken = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                return res.json({
                    status: response.ERROR.UNAUTHORIZED.CODE,
                    msg: response.ERROR.UNAUTHORIZED.MSG
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.json({
            status: response.ERROR.NO_TOKEN_PROVIDED.CODE,
            msg: response.ERROR.NO_TOKEN_PROVIDED.MSG
        });
    }
};

exports.verifySession = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({
            status: response.ERROR.UNAUTHORIZED.CODE,
            msg: response.ERROR.UNAUTHORIZED.MSG
        });
    }
};

exports.verifyUser = function (req, res, next) {
    let queryId = req.params[0] || req.body.id || req.query.id;
    let userId = req.user ? req.user.id : null;
    if (queryId && queryId === userId) {
        next();
    } else {
        return res.json({
            status: response.ERROR.FORBIDDEN.CODE,
            msg: response.ERROR.FORBIDDEN.MSG
        });
    }
};