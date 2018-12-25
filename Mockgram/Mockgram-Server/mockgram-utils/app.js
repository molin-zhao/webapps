const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('../config');

const app = express();

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${config.mongoUrl.db}`;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected correctly to mongodb');
}).catch(err => console.log(err));

app.use(logger('dev'));


module.exports = app;