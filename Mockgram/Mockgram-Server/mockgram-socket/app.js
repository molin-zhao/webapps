const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

// routers
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/message');

// utils
const config = require('../config');
const { normalizePort } = require('../mockgram-utils/utils/tools');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${config.mongoUrl.db}`;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('connected correctly to mongodb');
}).catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// adding a generic JSON and URL-encoded parser as a top-level middleware, 
// which will parse the bodies of all incoming requests.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// set up routers
app.use('/', indexRouter);
app.use('/message', messageRouter);

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

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = socketIo(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

app.locals.sockets = [];

io.on('connection', socket => {
  socket.on('establish-connection', clientInfo => {
    console.log(clientInfo);
  })
  socket.on('disconnect', () => {
  })
})



