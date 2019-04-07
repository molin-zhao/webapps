const http = require("http");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const logger = require("morgan");
const { normalizePort } = require("../utils/tools");
const response = require("../utils/response");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "public/dist/mockgram-web"));
app.engine("html", ejs.__express);
app.set("view engine", "html");
app.use(logger("dev"));

// set static directory
app.use(express.static(path.join(__dirname, "public/dist/mockgram-web")));

// index.html
app.all("*", (req, res) => {
  return res.render("index");
});

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
