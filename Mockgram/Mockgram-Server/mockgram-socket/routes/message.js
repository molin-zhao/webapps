const express = require('express');
const router = express.Router();
const userSocket = require('../bin/www');
router.get('/', (req, res) => {
    console.log(userSocket);
    res.json({
        status: 'ok'
    })
})
router.post('/post', (req, res) => {
    res.json({
        status: 200,
        msg: "socket server received your message."
    });
});
module.exports = router;