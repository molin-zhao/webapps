const express = require('express');
const router = express.Router();
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