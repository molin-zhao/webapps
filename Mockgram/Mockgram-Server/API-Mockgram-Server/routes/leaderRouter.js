var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Leadership = require('../models/leaderships');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function (req, res, next) {
    Leadership.find(req.query, function (err, leadership) {
        if (err) return next(err);
        res.json(leadership);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leadership.create(req.body, function (err, leadership) {
        if (err) return next(err);
        console.log('leadership created!');
        var id = leadership._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leadership with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leadership.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

router.route('/:id')
.get(function (req, res, next) {
    Leadership.findById(req.params.id, function (err, leadership) {
        if (err) return next(err);
        res.json(leadership);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leadership.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, leadership) {
        if (err) return next(err);
        res.json(leadership);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leadership.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = router;