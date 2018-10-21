const express = require('express');
const router = express.Router();
const verification = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');

router.all('/', verification.verifyAuthorization, (req, res, next) => {
    next();
});

router.get('/following', (req, res) => {
})

router.get('/you', (req, res) => {

})

module.exports = router;