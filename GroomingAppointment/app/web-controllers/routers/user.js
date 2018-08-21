const express = require('express');
const router = express.Router();
const debugger = require('../utils/logger');
const logger = debugger.logger;
const errors = debugger.errors;
let User = require('../../models/user');
let Appointment = require('../../models/appointment');

router.get('/profile', function(req, res){
	if(!req.session){
		// if user not login, try to redirect him/her to the index page.
		// all users should login first to view his/her profile.
		// in case of url attacking and keep users' privacy.
		res.redirect(301, '/');
	}else{
		var userEmail = req.session.user_email;
		User.findOne({email: userEmail}, function(err, user){
			if(err){
				logger(err, errors.NO_USER_FOUND);
				res.end();
				return;
			}
			Appointment.find({userEmail: userEmail}, function(err, appointments){
				if(err){
					logger(err, errors.NO_APPOINTMENT_FOUND);
					res.end();
					return;
				}
				res.render('user_profile', {
					user: user,
					dogs: dogs,
					appointment: appointments
				});
			});
		});
	}
});

router.get('/info/:id', urlencodeParser, function(req, res){
	//TODO
});

router.get('/resend', urlencodeParser, function(req, res){
	var req_email = req.query.email;
	try{
		const sendTime = Date.now();
		const to = req_email;
		var activationLink = "http://"+my_ip+":3000/active?email="+to+"&time="+sendTime;
		const content = 'Please activate your email account via following link: \n' + activationLink;
		sendEmail({
			to: req_email,
			subject: "Activate Your Email",
			text: content
		});
	}catch(e){
		console.log("Error, cannot send email to " + req_email);
	}
});

router.get('/active', urlencodeParser, function(req, res){
	var req_email = req.query.email;
	var req_timestamp = req.query.time;
	var timestamp_now = Date.now();
	var diff = (timestamp_now - req_timestamp) / (1000 * 60 * 60);
	if(diff >= 24){
		res.end("link expired");
	}else{
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
					if(result[0].active){
						res.send("Your account has been activated. You can login and make appointments!")
					}else{
						db.collection("client").updateOne(
							{"email": req_email},
							{
								$set: {"active": true}
							}
						);
						res.send("Email account activated.");
					}
				}else{
					res.send("Error on activating your email.");
				}
				res.end();
				client.close();
			});
		});
	}
});

router.post('/signup', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email = req.body.signUpEmail;
	var req_password = req.body.signUpPassword;

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
				res.send(JSON.stringify({'status':0, 'message': "Email already registered."}));
			}else{
				// insert user to the database, but not active
				// first of all, md5 crypto user password, and insert into database using new password
				let md5 = crypto.createHash("md5");
				let newPassword = md5.update(req_password).digest("hex");
				var clientObj = {email: req_email, password: newPassword, active: false};

				// 1. insert user info to database.
				db.collection("client").insertOne(clientObj, function(err){
					if(err) throw err;
				});
				// 2. send email to user.
				try{
					const sendTime = Date.now();
					const to = req_email;
					var activationLink = "http://"+my_ip+":3000/active?email="+to+"&time="+sendTime;
					const content = 'Please activate your email account via following link: \n' + activationLink;
					sendEmail({
						to: req_email,
						subject: "Activate Your Email",
						text: content
					});
				}catch(e){
					console.log("Error, cannot send email to " + req_email);
				}
				// db.collection("client").updateOne(
				// 	{email: req_email},
				// 	{
				// 		$set: {active: true}
				// 	}
				// );
				// 3. callback and notify user.
				res.send(JSON.stringify(
					{'status':1,
					'message': "Register successfully, please active your account within 24 hours via registered Email."}
				));
			}
			client.close();
			res.end();
		});
	});
});

router.post('/login', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email = req.body.loginEmail;
	var req_password = req.body.loginPassword;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		// md5 crypto password and compare with database
		let md5 = crypto.createHash("md5");
		let newPassword = md5.update(req_password).digest("hex");
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email": req_email, "password": newPassword}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// active and inactive users
				if(result[0].active == false){
					res.send(JSON.stringify({'status':2, 'message': "You mush first activate your account via email."}));
				}else{
					// active user successfully login
					// set session or cookie to reserve user status
					req.session.user_email = req_email;
					req.session.user_imgpath = result[0].imagePath;
					res.send(JSON.stringify({'status':1, 'message': "Login successfully.", 'session': req.session}));
					// console.log(req.session);
					// res.send(JSON.stringify(req.session));
				}
			}else{
				res.send(JSON.stringify({'status':0, 'message': "Email or password not match. Unable to login."}));
			}
			client.close();
			res.end();
		});
	});
});

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
      if(err) {
				res.send(JSON.stringify({'status': 0, 'message': "Cannot logout at this moment."}));
				throw err;
			}
      res.clearCookie(identityKey);
			res.send(JSON.stringify({'status': 1, 'message': "Logout successfully."}));
			// return index.html
      res.redirect(301, '/');
			res.end();
  });
});

router.post('/upload/image', upload.single('selfImage'), function(req, res){
	//user email address, used for find user and update image path;
	var userId;
	if(req.session.user_email){
		userId = req.session.user_email;
	}else{
		userId = req.body.userId;
	}
	var imgPath = req.file.path;
	req.session.user_imgpath = imgPath;
	res.send(JSON.stringify({'status':1, 'message': imgPath}));
	res.end();
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		// md5 crypto password and compare with database
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email": userId}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// update user
				db.collection("client").updateOne(
					{email: userId},
					{
						$set: {
							imagePath: imgPath
						}
					}
				);
			}
			client.close();
		});
	});
});

router.post('/upload/profile', urlencodeParser, function(req, res){
	var req_email = req.body.email;
	var req_name = req.body.editName;
	var req_home_number = req.body.editHomeNumber;
	var req_work_number = req.body.editWorkNumber;
	var req_mobile_number = req.body.editMobileNumber;
	var req_address = req.body.editAddress;
	var req_self_intro = req.body.editSelfIntro;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		// md5 crypto password and compare with database
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email": req_email}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// update user
				db.collection("client").updateOne(
					{email: req_email},
					{
						$set: {
							name: req_name,
							homeNumber: req_home_number,
							workNumber: req_work_number,
							mobileNumber: req_mobile_number,
							address: req_address,
							selfIntro: req_self_intro
						}
					}
				);
				res.send(JSON.stringify({'status':1,'message': "Update completed."}));
			}else{
				res.send(JSON.stringify({'status':0, 'message': "Failed to update profile, no user found."}));
			}
			res.end();
			client.close();
		});
	});
});

module.exports = router;
