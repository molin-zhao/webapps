const express = require('express');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const urlencodeParser = bodyParser.urlencoded({extended: false});
const ejs = require('ejs');
// const URL = require('url');
const multer = require('multer');
const multipart = require('connect-multiparty');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo')(session);

var my_ip = require('./ipaddress.js');
var checkFileType = require('./checkfiletype.js');
var sendEmailForActivation = require('./sendemail.js');
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


// set up routers
app.get('/', function(req, res){
	res.render('index');
});

app.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
      if(err) {
				res.send(JSON.stringify({'status': 0, 'message': "Cannot logout at this moment."}));
				throw err;
			}
      res.clearCookie(identityKey);
			res.send(JSON.stringify({'status': 1, 'message': "Logout successfully."}));
      res.redirect('/');
  });
});

app.get('/iflogin', function(req, res){
	if(!req.session.user_email){
		// didn't login
		res.send(JSON.stringify({'status': 0, 'message': null}));
	}else{
		res.send(JSON.stringify({'status': 1, 'message': req.session}));
	}
	res.end();
})

app.get('/resend', urlencodeParser, function(req, res){
	var req_email = req.query.email;
	sendEmailForActivation(req_email, "Activation Your Email");
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
					res.send(JSON.stringify({'status':1, 'message': "Email for activation not found."}));
				}else{
					res.send(JSON.stringify({'status':0,'message': "Email account activated."}));
				}
				client.close();
				res.end();
			});
		});
	}
});

app.get('/getdoginfo', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email = req.query.email;
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
	var req_email = req.query.email;
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
				// sendEmailForActivation(req_email, "Activation Your Email");
				db.collection("client").updateOne(
					{email: req_email},
					{
						$set: {active: true}
					}
				);
				// 3. callback and notify user.
				res.send(JSON.stringify(
					{'status':1,
					'message': "Register successfully, please active account within 24 hours via registered Email."}
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
	var userId = req.body.userId;//user email address, used for find user and update image path;
	var imgPath = req.file.path;
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
				var dogName = req.body.editDogName.toLowerCase();
				// make comparision with the dog already in the database,
				//if their name are same, fail to add a dog and show user message to change a name
				var dogList = result.dogs;
				if(dogList === undefined || dogList == null){
					dogList = new Array();
				}else{
					for(var dog in dogList){
						if(dog.d_name == dogName){
							res.send(JSON.stringify({'status': 0, 'message': "Dog name already registered. Please try another name."}));
							res.end();
							client.close();
							return;
						}
					}
				}
				// if not return, that means no dog is matched in the database, insert it.
				var dogBread = req.body.editDogBread;
				var dogDateOfBirth = req.body.editDogDateOfBirth;
				var dogPreferredGroomOption = req.body.groomingOptions;
				var dogDescription = req.body.description;
				var dogImagePath = req.file.path;
				var newDog = {
					d_name : dogName,
					d_bread : dogBread,
					d_dateOfBirth : dogDateOfBirth,
					d_dogPreferedGroomOption : dogPreferredGroomOption,
					d_description : dogDescription,
					d_imagePath : dogImagePath
				}
				dogList.push(newDog);
				db.collection("client").updateOne(
					{email: userEmail},
					{
						$set: {
							dogs: dogList
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
