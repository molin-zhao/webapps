const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const generatorRouter = require('./routes/generator');

const app = express();

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${config.mongoUrl.db}`;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected correctly to mongodb');
}).catch(err => console.log(err));

// app.use('/generator', generatorRouter);

module.exports = app;