const express = require('express');
const path = require('path');
const ejs = require('ejs');
const logger = require('morgan');
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(logger('dev'));

// set static directory
app.use(express.static(path.join(__dirname, 'public')));


// set up router
app.use('/', indexRouter);


// catch 404 and handle response
app.use(function (req, res, next) {
  return res.status(404).json({
    status: response.ERROR.NOT_FOUND.CODE,
    msg: response.ERROR.NOT_FOUND.MSG
  });
});

// catch 500 and handle response
app.use(function (err, req, res, next) {
  return res.status(500).json({
    status: response.ERROR.SERVER_ERROR.CODE,
    msg: response.ERROR.SERVER_ERROR.MSG,
  });
});

module.exports = app;