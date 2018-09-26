const express = require('express');
const router = express.Router();
const verification = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');

router.all('/', verification.verifySession, (req, res, next) => {
    next();
});

module.exports = router;