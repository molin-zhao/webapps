const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const useragent = require("express-useragent");
const passport = require("passport");

// routers
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const discoveryRouter = require("./routes/discovery");
const profileRouter = require("./routes/profile");
const messageRouter = require("./routes/message");
const recommendRouter = require("./routes/recommend");

// utils
const response = require("../utils/response");
const config = require("../config");
const { normalizePort } = require("../utils/tools");

// set up app
const app = express();

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${
  config.mongoUrl.db
}`;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected correctly to mongodb");
  })
  .catch(err => console.log(err));
mongoose.set("useFindAndModify", false);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(useragent.express());
app.use(logger("dev"));
// adding a generic JSON and URL-encoded parser as a top-level middleware,
// which will parse the bodies of all incoming requests.
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
// set up passport strategy
app.use(passport.initialize());
app.use(passport.session());

// set up routers
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/discovery", discoveryRouter);
app.use("/profile", profileRouter);
app.use("/message", messageRouter);
app.use("/recommend", recommendRouter);

// catch 404 and handle response
app.use(function(req, res, next) {
  return res.status(404).json({
    status: response.ERROR.NOT_FOUND.CODE,
    msg: response.ERROR.NOT_FOUND.MSG
  });
});

// catch 500 and handle response
app.use(function(err, req, res, next) {
  console.log(err);
  return res.status(500).json({
    status: response.ERROR.SERVER_ERROR.CODE,
    msg: response.ERROR.SERVER_ERROR.MSG
  });
});

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
