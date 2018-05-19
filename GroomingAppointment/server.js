const express = require('express');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const urlencodeParser = bodyParser.urlencoded({extended: false});
const ejs = require('ejs');
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const multipart = require('connect-multiparty');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo')(session);
const removeSocketFromArr = require('./removesocket.js');
const sendSocketMsg = require('./socketmsg.js');

try{
	var my_ip = require('./ipaddress.js');
}catch(e){
	console.log("Temporarily not connected to the intranet, cannot get public ip address.");
}
var checkFileType = require('./checkfiletype.js');
var sendEmail = require('./sendemail.js');
var greaterThan = require('./datesort.js');
var sortDate = require('./swap.js');
var identityKey = 'groomkey';

// set server address and other information
const hostname = 'localhost';
const port = 3000;
const url = "mongodb://localhost:27017/groomingAppointment";

// init app
const app = express();

// set view engine and basic tools
app.use(morgan('dev'));
app.use(urlencodeParser);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(cookieParser());
app.use(session({
	name: identityKey,
	secret: 'grooming-appointment',
	cookie: {
		maxAge: 60 * 1000 * 60,
		httpOnly: false
	},
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: url,
		collection: 'sessions'
	})
}));
app.set('views', '/');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(3001);
// set storage engine
const storage = multer.diskStorage({
	destination: './public/upload/',
	filename: function(req, file, callback){
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

// init upload limitation
const upload = multer({
	storage: storage,
	limits: {
		filesize: 1024 * 1024
	},
	fileFilter: function(req, file, callback){
		checkFileType(file, callback);
	}
});

// for parsing formdata
const multipartMiddleware = multipart();

// start service
app.listen(port, function(){
	console.log('Server running at http://' + hostname + ':' + port);
});


global.admin = [];
io.on('connection', (socket) => {
  console.log('admin connected');
	socket.on('admin-login', function(data){
		admin.push(data);
	})
  socket.on("disconnect", () => {
    console.log("admin disconnected");
		removeSocketFromArr(admin, socket.id);
  });
});


app.get('/user-profile', function(req, res){
	if(!req.session || !req.session.user_email){
		res.render('login');
		res.end();
	}
});


// set up routers
app.get('/', function(req, res){
	res.render('index');
	res.end();
});

app.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
      if(err) {
				res.send(JSON.stringify({'status': 0, 'message': "Cannot logout at this moment."}));
				throw err;
			}
      res.clearCookie(identityKey);
			res.send(JSON.stringify({'status': 1, 'message': "Logout successfully."}));
			// return index.html
      res.redirect('/');
			res.end();
  });
});

app.get('/iflogin', function(req, res){
	if(!req.session || !req.session.user_email){
		// didn't login
		res.send(JSON.stringify({'status': 0, 'message': null}));
	}else{
		res.send(JSON.stringify({'status': 1, 'message': req.session}));
	}
	res.end();
})

app.get('/resend', urlencodeParser, function(req, res){
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

app.get('/active', urlencodeParser, function(req, res){
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



app.get('/getdoginfo', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email;
	if(req.session.user_email){
		req_email = req.session.user_email;
	}else if(req.query.email){
		req_email = req.query.email;
	}else{
		res.send(JSON.stringify({'status':0,'message': "Cannot get dog information."}));
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
				res.send(JSON.stringify({'status':1, 'message': result[0].dogs}));
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
			}
			client.close();
			res.end();
		});
	});
});

app.get('/getinfo', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email;
	if(req.session.user_email){
		req_email = req.session.user_email;
	}else if(req.query.email){
		req_email = req.query.email;
	}else{
		res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
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
				console.log(result[0]);
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
			}
			client.close();
			res.end();
		});
	});

});

app.get('/getappointment', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	if(!req.session.user_email){
		res.send(JSON.stringify({'status': 0, 'message': "You need to login to view your appointment."}));
		res.end();
		return;
	}else{
		var req_email = req.session.user_email;
		MongoClient.connect(url, function(err, client){
			assert.equal(null, err);
			if(err){
				console.log("Connot connect correctly to the database");
				res.sendStatus(500);
				return;
			}
			var db = client.db("groomingAppointment");
			db.collection("appointment").find({"userEmail": req_email}).toArray(function(err, result){
				if(err)throw err;
				if(result.length != 0){
					res.send(JSON.stringify({'status': 1, 'message': result}));
				}else{
					res.send(JSON.stringify({'status': 2, 'message': "You currently have no appointments."}));
				}
				res.end();
				client.close();
			});
		});
	}
});


app.get('/adminappointment', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			res.sendStatus(500);
			return;
		}
		var db = client.db("groomingAppointment");
		db.collection("appointment").find().toArray(function(err, result){
		if(err)throw err;
		if(result.length != 0){
			res.send(JSON.stringify({'status': 1, 'message': result}));
		}else{
			res.send(JSON.stringify({'status': 2, 'message': "You currently have no appointments."}));
		}
		res.end();
		client.close();
		});
	});
});

app.get('/requestbooking', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email;
	if(req.session.user_email){
		// user already login
		req_email = req.session.user_email;
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
				console.log(result[0]);
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
			}
			client.close();
			res.end();
		});
	});

});



app.post('/getcalendar', urlencodeParser, function(req, res){
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

app.post('/gettimetable', urlencodeParser, function(req, res){
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

app.post('/signup', urlencodeParser, function(req, res){
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



app.post('/login', urlencodeParser, function(req, res){
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


app.post('/uploadimg', upload.single('selfImage'), function(req, res){
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

app.post('/uploadprofile', urlencodeParser, function(req, res){
	console.log(req.body.email);
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

app.post('/uploaddogprofile', upload.single('editDogImage'), function(req, res){
	var userEmail = req.body.email;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		// md5 crypto password and compare with database
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email": userEmail}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// insert dog
				var dogName = req.body.editDogName;
				var dogNameForCompare = dogName.toLowerCase();
				// make comparision with the dog already in the database,
				//if their name are same, fail to add a dog and show user message to change a name
				var dogList = result.dogs;
				// check if the dog name is already being used
				if(dogList){
					for(var i=0; i<dogList.length; i++){
						if(dogList[i].d_name.toLowerCase() == dogNameForCompare){
							res.send(JSON.stringify({'status': 0, 'message': "Dog name already registered. Please try another name."}));
							res.end();
							client.close();
							return;
						}
					}
				}
				// if not return, that means no dog is matched in the database, insert it.
				var dogBreed = req.body.editDogBreed;
				var dogDateOfBirth = req.body.editDogDateOfBirth;
				var dogImagePath;
				if(req.file){
					dogImagePath = req.file.path;
				}else{
					dogImagePath = "data/dogs/dog-default.jpg";
				}
				var newDog = {
					d_name : dogName,
					d_breed : dogBreed,
					d_dateOfBirth : dogDateOfBirth,
					d_imagePath : dogImagePath
				}
				db.collection("client").updateOne(
					{email: userEmail},
					{
						$addToSet: {
							"dogs": newDog
						}
					}
				);
				res.send(JSON.stringify({'status': 1,'message': "Dog profile uploaded successfully."}));
			}else{
				res.send(JSON.stringify({'status': 2, 'message': "Failed to update dog profile, no user found."}));
			}
			res.end();
			client.close();
		});
	});
});

app.post('/booking', multipartMiddleware, function(req, res){
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
			}else{
				res.send(JSON.stringify({'status': 0, 'message': "Date you selected is temporarily unavailable, please try again later."}));
				res.end();
			}
			client.close();
		});
	});
});

app.post('/cancelappointment', urlencodeParser, function(req, res){
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

app.post('/confirmappointment', urlencodeParser, function(req, res){
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

app.post('/finishappointment', urlencodeParser, function(req, res){
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

app.post('/getappointmentdetail', urlencodeParser, function(req, res){
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

app.post('/rescheduleappointment', multipartMiddleware, function(req, res){
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
