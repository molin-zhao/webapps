const express = require('express');
const router = express.Router();
const debugger = require('../utils/logger');
const logger = debugger.logger;
const errors = debugger.errors;
let User = require('../../models/user');
let Appointment = require('../../models/appointment');

router.get('/booking/request', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var reqEmail;
	if(req.session){
		// user already login
		reqEmail = req.session.user_email;
	}else{
		res.send(JSON.stringify({'status':0,'message': "User haven't login, or a new user."}));
		res.end();
		return;
	}

	// connect to database
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			res.sendStatus(500);
			return;
		}
		// correctly connected to the database.
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email":req_email}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				res.send(JSON.stringify({'status':1, 'message': result[0]}));
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
			}
			client.close();
			res.end();
		});
	});

});

router.post('/booking/confirm', multipartMiddleware, function(req, res){
	var userEmail;
	if(req.session.user_email){
		userEmail = req.session.user_email;
	}else{
		userEmail = req.body.bookUserEmail;
	}
	var contactEmail = req.body.bookUserEmail;
	var contactName = req.body.bookUserName;
	var contactMobileNum = req.body.bookMobileNum;
	var contactAddress = req.body.bookAddress;
	var groomOption = req.body.bookGroomOption;
	var additionalDescription = req.body.bookDescription;
	var dogName = req.body.bookDogName;
	var dogBreed = req.body.bookDogBreed;
	var bookTime = req.body.bookTime;
	var bookTimeForQuery = req.body.bookTimeForQuery;
	var bookTimeQueryArr = bookTimeForQuery.split(' ');

	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var bookYear = parseInt(bookTimeQueryArr[0]);
		var bookMonth = parseInt(bookTimeQueryArr[1]);
		var bookDayAndPeriod = "dayList." + (bookTimeQueryArr[2]-1) + "." + bookTimeQueryArr[3];
		var db = client.db("groomingAppointment");
		db.collection("timetable").find({"year": bookYear, "month": bookMonth, [bookDayAndPeriod]: true}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// date found and is available
				db.collection("timetable").updateOne(
					{"year": bookYear, "month": bookMonth},
					{$set:{[bookDayAndPeriod]:false}}
				);

				var appointment = {};
				appointment.userEmail = userEmail;
				appointment.contactEmail = contactEmail;
				appointment.contactMobileNum = contactMobileNum;
				appointment.contactAddress = contactAddress;
				appointment.contactName = contactName;
				appointment.dogName = dogName;
				appointment.dogBreed = dogBreed;
				appointment.groomOption = groomOption;
				appointment.additionalDescription = additionalDescription;
				appointment.bookTime = bookTime;
				appointment.creatTime = Date.now();
				appointment.status = "booked";
				appointment.bookTimeForQuery = bookTimeForQuery;
				db.collection("appointment").insertOne(appointment, function(err){
					if(err) throw err;
				});
				res.send(JSON.stringify({'status': 1, 'message': "Booking success."}));
				sendSocketMsg(io, admin, 'update-appointment', appointment);
				const content = "Thanks for booking at :" + bookTime;
				sendEmail({
					to: contactEmail,
					subject: "Booking Information.",
					text: content
				});
			}else{
				res.send(JSON.stringify({'status': 0, 'message': "Date you selected is temporarily unavailable, please try again later."}));
				res.end();
			}
			client.close();
		});
	});
});

router.post('/calendar', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var c_year = req.body.year;
	var c_month = req.body.month;
	// connect to database
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			res.sendStatus(500);
			return;
		}
		// correctly connected to the database.
		var db = client.db("groomingAppointment");
		db.collection("timetable").find({"year":{$gte: c_year}},{year:1,month:1}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// sort result
				var sortedResult = sortDate(result);
				var calendar = new Array();
				for(var i in sortedResult){
					if(greaterThan(sortedResult[i], req.body)){
						var date = {};
						date.year = sortedResult[i].year;
						date.month = sortedResult[i].month;
						calendar.push(date);
					}
				}
				res.send(JSON.stringify({'status':1, 'message': calendar}));
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get calendar information."}));
			}
			client.close();
			res.end();
		});
	});
});

router.post('/timetable', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var c_year = req.body.year;
	var c_month = req.body.month;
	var c_day = req.body.day;
	// connect to database
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			res.sendStatus(500);
			return;
		}
		// correctly connected to the database.
		var db = client.db("groomingAppointment");
		db.collection("timetable").find({"year":c_year, "month": c_month}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// create timetable
				var timetable = result[0].dayList[c_day-1];
				res.send(JSON.stringify({'status':1, 'message': timetable}));
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get timetable information."}));
			}
			client.close();
			res.end();
		});
	});
});

router.delete('/cancel', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_bookId = req.body.bookId;
	var req_bookTimeForQuery = req.body.bookTimeForQuery;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var bookTimeQueryArr = req_bookTimeForQuery.split(' ');
		var bookYear = parseInt(bookTimeQueryArr[0]);
		var bookMonth = parseInt(bookTimeQueryArr[1]);
		var bookDayAndPeriod = "dayList." + (bookTimeQueryArr[2]-1) + "." + bookTimeQueryArr[3];
		var db = client.db("groomingAppointment");
		try{
			db.collection("timetable").updateOne(
				{"year": bookYear, "month": bookMonth},
				{
					$set: {[bookDayAndPeriod]: true}
				}
			);
			db.collection("appointment").deleteOne({'_id': ObjectId(req_bookId)});
			res.send(JSON.stringify({'status': 1, 'message': "Cancel success."}));
		}catch(e){
			console.log(e);
			res.send(JSON.stringify({'status': 0, 'message': "Cannot cancel your appointment temporarily."}));
			res.end();
			return;
		}
		res.end();
		client.close();
	});
});

router.put('/confirm', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_bookId = req.body.bookId;
	var req_bookTimeForQuery = req.body.bookTimeForQuery;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var bookTimeQueryArr = req_bookTimeForQuery.split(' ');
		var bookYear = parseInt(bookTimeQueryArr[0]);
		var bookMonth = parseInt(bookTimeQueryArr[1]);
		var bookDayAndPeriod = "dayList." + (bookTimeQueryArr[2]-1) + "." + bookTimeQueryArr[3];
		var db = client.db("groomingAppointment");
		try{
			db.collection("appointment").updateOne(
				{'_id': ObjectId(req_bookId)},
				{
					$set: {"status": "inProgress"}
				}
			);
			res.send(JSON.stringify({'status': 1, 'message': "Appointment is in progress, you can view it under 'in progress' tab."}));
		}catch(e){
			console.log(e);
			res.send(JSON.stringify({'status': 0, 'message': "Cannot confirm this appointment temporarily."}));
			res.end();
			return;
		}
		res.end();
		client.close();
	});
});

router.put('/finish', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_bookId = req.body.bookId;
	var req_bookTimeForQuery = req.body.bookTimeForQuery;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var bookTimeQueryArr = req_bookTimeForQuery.split(' ');
		var bookYear = parseInt(bookTimeQueryArr[0]);
		var bookMonth = parseInt(bookTimeQueryArr[1]);
		var bookDayAndPeriod = "dayList." + (bookTimeQueryArr[2]-1) + "." + bookTimeQueryArr[3];
		var db = client.db("groomingAppointment");
		try{
			db.collection("appointment").updateOne(
				{'_id': ObjectId(req_bookId)},
				{
					$set: {"status": "finished"}
				}
			);
			res.send(JSON.stringify({'status': 1, 'message': "Appointment is finished, you can view it under 'in progress' tab."}));
		}catch(e){
			console.log(e);
			res.send(JSON.stringify({'status': 0, 'message': "Cannot confirm this appointment temporarily."}));
			res.end();
			return;
		}
		res.end();
		client.close();
	});
});

router.post('/reschedule', multipartMiddleware, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_bookId = req.body.bookId;
	var req_ogBookTimeForQuery = req.body.ogBookTimeForQuery;
	var req_bookTimeForQuery = req.body.newBookTimeForQuery;
	var req_bookTime = req.body.newBookTime
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var bookTimeQueryArr = req_bookTimeForQuery.split(' ');
		var bookYear = parseInt(bookTimeQueryArr[0]);
		var bookMonth = parseInt(bookTimeQueryArr[1]);
		var bookDayAndPeriod = "dayList." + (bookTimeQueryArr[2]-1) + "." + bookTimeQueryArr[3];
		var db = client.db("groomingAppointment");
		db.collection("timetable").find({"year": bookYear, "month": bookMonth, [bookDayAndPeriod]: true}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// date found and is available;
				try{
					// release og book time
					var ogBookTimeQueryArr = req_ogBookTimeForQuery.split(' ');
					var ogBookYear = parseInt(ogBookTimeQueryArr[0]);
					var ogBookMonth = parseInt(ogBookTimeQueryArr[1]);
					var ogBookDayAndPeriod = "dayList." + (ogBookTimeQueryArr[2]-1) + "." + ogBookTimeQueryArr[3];
					db.collection("timetable").updateOne(
						{"year": ogBookYear, "month": ogBookMonth},
						{
							$set:{[ogBookDayAndPeriod]:true}
						}
					);
					// update new book time
					db.collection("timetable").updateOne(
						{"year": bookYear, "month": bookMonth},
						{
							$set:{[bookDayAndPeriod]:false}
						}
					);

					// update appointment information
					db.collection("appointment").updateOne(
						{"_id": ObjectId(req_bookId)},
						{
							$set: {"bookTime": req_bookTime, "bookTimeForQuery": req_bookTimeForQuery, "status": "rescheduled"}
						}
					);
					res.send(JSON.stringify({'status': 1, 'message': "Reschedule success."}));
				}catch(e){
					console.log(e);
					res.send(JSON.stringify({'status': 0, 'message': "Error. Cannot complete re-schedule operation temporarily."}));
					res.end();
					return;
				}
			}else{
				res.send(JSON.stringify({'status': 0, 'message': "Date you selected is temporarily unavailable, please try again later."}));
			}
			res.end();
			client.close();
		});
	});
});

router.get('/detail/:id', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_bookId = req.body.bookId;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var db = client.db("groomingAppointment");
		db.collection("appointment").find({"_id": ObjectId(req_bookId)}).toArray(function(err, result){
			if(err)throw err;
			if(result.length!=0){
				res.send(JSON.stringify({'status': 1, 'message': result[0]}));
			}else{
				res.send(JSON.stringify({'status': 0, 'message': "Cannot view appointment detail."}));
			}
			res.end();
			client.close();
		});
	});
});

router.post('/comment', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var bookId = req.body.bookId;
	var comment = req.body.comment;
	var stars = req.body.stars;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		var db = client.db("groomingAppointment");

	});
});

module.exports = router;
