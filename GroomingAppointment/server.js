const express = require('express');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const urlencodeParser = bodyParser.urlencoded({extended: false});
const ejs = require('ejs');
const url = require('url');
const multer = require('multer');

var my_ip = require('./ipaddress.js');
var checkFileType = require('./checkfiletype.js');

// set server address and other information
const hostname = 'localhost';
const port = 3000;
const url = "mongodb://localhost:27017/groomingAppointment";

// init app
const app = express();

// set view engine and basic tools
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
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
}).single('selfImage');


// start service
app.listen(port, function(){
	console.log('Server running at http://' + hostname + ':' + port);
});


// set up routers
app.get('/', function(req, res){
	res.render('index');
});

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
					res.send(JSON.stringify({'status':0, 'message': "Email for activation not found."}));
				}else{
					db.collection("client").updateOne(
						{email: req_email},
						{
							$set: {active: true}
						}
					);
					res.send(JSON.stringify(
						{'status':1,
						'message': "Email account activated."}
					));
				}
				client.close();
				res.end();
			});
		});
	}
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
		db.collection("client").find({"email":email}).toArray(function(err, result){
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
				sendEmailForActivation(req_email, "Activation Your Email");
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
	var req_email = req.body.email;
	var req_password = req.body.password;
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
		}
		if(result.length != 0){
			// active and inactive users
			if(result[0].active == false){
				res.send(JSON.stringify({'status':2, 'message': "You mush first activate your account via email."}));
			}else{
				// active user successfully login
				res.send(JSON.stringify({'status':1, 'message': "Login successfully."}));
				res.send(JSON.stringify(result[0]));
			}
		}else{
			res.send(JSON.stringify({'status':0, 'message': "Email or password not match. Unable to login."}));
		}
		client.close();
		res.end();
		});
	});
});


app.post('/uploadimg', urlencodeParser, function(req, res){
	upload(req, res, (err) => {
		if(err){
			console.log("saving file error");
			throw err;
		}else{
			console.log(req.file);
			// MongoClient.connect(url, function(err, client){
			// 	assert.equal(null, err);
			// 	if(err){
			// 		console.log("Connot connect correctly to the database");
			// 		return;
			// 	}
			// 	console.log("Correctly connected to the database");
			// 	var db = client.db("groomingAppointment");
			// 	db.collection("client").find({"email": req_email_og}).toArray(function(err, result){
			// 		if(err) throw err;
			// 	}
			// 	if(result.length != 0){
			// 		// update user
			// 		db.collection("client").updateOne(
			// 			{email: req_email},
			// 			{
			// 				$set: {
			// 					name: req_name,
			// 					homeNumber: req_home_number,
			// 					workNumber: req_work_number,
			// 					mobileNumber: req_mobile_number,
			// 					address: req_address,
			// 					selfIntro: req_self_intro
			// 				}
			// 			}
			// 		);
			// 		res.send(JSON.stringify(
			// 			{'status':1,
			// 			'message': "Update completed."};
			// 		));
			// 	}else{
			// 		res.send(JSON.stringify({'status':0, 'message': "Failed to update profile, no user found."}));
			// 	}
			// 	client.close();
			// 	res.end();
			// 	});
			// });
		}
	})
});

app.post('/uploadprofile', urlencodeParser, function(req, res){
	var req_email_og = req.body.emailOg;
	var req_name = req.body.editName;
	var req_email = req.body.editEmail;
	var req_home_number = req.body.editHomeNumber;
	var req_work_number = req.bdoy.editWorkNumber;
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
		db.collection("client").find({"email": req_email_og}).toArray(function(err, result){
			if(err) throw err;
		}
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
			res.send(JSON.stringify(
				{'status':1,
				'message': "Update completed."};
			));
		}else{
			res.send(JSON.stringify({'status':0, 'message': "Failed to update profile, no user found."}));
		}
		client.close();
		res.end();
		});
	});
});
