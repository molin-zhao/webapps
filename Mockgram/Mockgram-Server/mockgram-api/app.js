const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const authenticate = require('../mockgram-utils/utils/authenticate');
const config = require('../config');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
require('../mockgram-utils/utils/model-migration');


const app = express();

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${config.mongoUrl.db}`;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true
}).then(() => {
  console.log('connected correctly to mongodb');
}).catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

// set up session information
app.use(session({
  store: new RedisStore({
    client: redis.createClient(config.redisUrl.port, config.redisUrl.host)
  }),
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  name: config.name,
  cookie: config.cookie
}));

// set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// adding a generic JSON and URL-encoded parser as a top-level middleware, 
// which will parse the bodies of all incoming requests.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// set up routers
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;