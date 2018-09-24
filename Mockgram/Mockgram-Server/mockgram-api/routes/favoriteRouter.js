var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Favorites = require('../models/favorites');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function(req, res, next){
	Favorites.find({postBy: req.decoded._id})
		.populate('postedBy')
		.populate('dishes.id')
		.exec(function (err, favorites) {
        	if (err) return next(err);
        	res.json(favorites);
        });
})
.post(function(req, res, next){
	// first check if such a document corresponding to this user does not already exist in the system
	Favorites.find({postBy: req.decoded._id}, function(err, favorites){
		if(err){
			console.log(err);
			return next(err);
		}
		if(JSON.stringify(favorites) === '[]'){
			Favorites.create({
				postBy: req.decoded._id,
				dishes: [req.body]
			}, function(err, favorites){
				if(err){
					console.log(err);
					return next(err);
				}
				console.log('User ' + req.decoded._id + ' favorite dishes created!');
				res.json(favorites);
			});
		}else{
			favorites.dishes.push(req.body);
		}
	});
})
.delete(function(req, res, next){
	Favorites.remove({}, function(err){
		if(err){
			console.log(err);
			return next(err);
		}else{
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Favorites removed.');
		}
	});
});

router.route('/:dishId')
.all(Verify.verifyOrdinaryUser)
.get(function(req, res, next){
	Favorites.findOne({'dishes.id': req.params.dishId})
	.populate('dishes.id')
	.exec(function(err, favorite){
		if(err){
			console.log(err);
			return next(err);
		}
		res.json(favorite.dishes);
	})
})
.delete(function(req, res, next){
	Favorites.deleteOne({'dishes.id': req.params.dishId}, function(err, resp){
		if(err){
			console.log(err);
			return next(err);
		}
		res.json(resp);
	});
});


module.exports = router;