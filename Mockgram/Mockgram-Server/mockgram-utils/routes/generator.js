const express = require('express');
const router = express.Router();
const generator = require('../utils/hotPostGenerator').generator;
const response = require('../utils/response');

global.hotPostGeneratorInterval = null;
router.get('/on', (req, res) => {
    if (global.hotPostGeneratorInterval) {
        console.log("START GENERATOR ERROR: generator is already running")
        res.json({
            status: response.ERROR.SERVER_ERROR.CODE,
            msg: response.ERROR.SERVER_ERROR.MSG,
        })
    } else {
        global.hotPostGeneratorInterval = generator(1000 * 15);
        console.log("START GENERATOR SUCCEEDED: generator is up and running");
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
        })
    }
})

router.get('/off', (req, res) => {
    if (global.hotPostGeneratorInterval) {
        console.log("SHUTDOWN GENERATOR SUCCEEDED: generator is shut down.");
        clearInterval(global.hotPostGeneratorInterval);
        global.hotPostGeneratorInterval = null;
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
        })
    } else {
        console.log("SHUTDOWN GENERATOR ERROR: generator is not running.");
        res.json({
            status: response.ERROR.SERVER_ERROR.CODE,
            msg: response.ERROR.SERVER_ERROR.MSG,
        })
    }
})
module.exports = router;