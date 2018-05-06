var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var urlencodeParser = bodyParser.urlencoded({extended: false});
var ejs = require('ejs');

// set server address
var hostname = 'localhost';
var port = 3000;
var url = "mongodb://localhost:27017/groomingAppointment";

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));


// set up routers
app.get('/', function(req, res){
	res.render('index');
})

app.post('/signup', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	console.log('Email: ' + req.body.email);
	console.log('Password: ' + req.body.password);
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email":req.body.email}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				console.log("email already taken, cannot register.");
			}else{
				var clientObj = {email: req.body.email, password: req.body.password}; 
				db.collection("client").insertOne(clientObj, function(err, res){
					if(err) throw err;
					console.log("register successful!");
				});
			}
			client.close();
			res.end();
		});
	});


})

app.post('/login', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	console.log('Email: ' + req.body.email);
	console.log('Password: ' + req.body.password);
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email":req.body.email, "password": req.body.password}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				console.log("Login successfully!");
			}else{
				console.log("Email or password not match, login failed.");
			}
			client.close();
			res.end();
		});
	});


})



app.set('views', '/');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.listen(port, hostname, function(){
	console.log('Server running at http://' + hostname + ':' + port);
});
