var express = require('express');
var router = express.Router();

/* redirect to the home page. */
router.get('/', function (req, res, next) {
  res.redirect("https://mockgram.molinz.com");
});

module.exports = router;