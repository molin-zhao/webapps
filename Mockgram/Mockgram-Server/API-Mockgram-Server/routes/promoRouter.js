var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Promotions = require('../models/promotions');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function (req, res, next) {
    Promotions.find(req.query, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Promotions.create(req.body, function (err, promotion) {
        if (err) return next(err);
        console.log('promotion created!');
        var id = promotion._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Promotions.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

router.route('/:id')
.get(function (req, res, next) {
    Promotions.findById(req.params.id, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Promotions.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Promotions.findByIdAndRemove(req.params.id, function (err, resp) {        
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = router;