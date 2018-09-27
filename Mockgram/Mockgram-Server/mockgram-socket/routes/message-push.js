const express = require('express');
const router = express.Router();

router.post('/post', (req, res) => {
    res.json({
        status: 200,
        msg: "socket server received your message."
    });
});
module.exports = router;