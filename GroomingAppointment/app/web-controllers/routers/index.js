// index.js is a router that focuses on access control and other global router settings
const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.render('index');
	res.end();
});

module.exports = router;
