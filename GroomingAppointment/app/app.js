// import module from npm
const express = require('express');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({extended: false});
const multer = require('multer');
const multipart = require('connect-multiparty');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


// import module from static util folder
const email_config = require('./config/email-conf');
const database_config = require('./config/database-conf');
const server_config = require('./config/server_conf');
const session_config = require('./config/session_conf')

// try to get my ip address within the Intranet
try{
	var my_ip = require('./ipaddress.js');
}catch(e){
	console.log("Temporarily not connected to the intranet, cannot get public ip address.");
}

// import util functions
const checkFileType = require('../utils/check-filetype');
const sendEmail = require('../utils/send-email');
const greaterThan = require('../utils/date-sort').greaterThan;
const sortDate = require('../utils/date-sort').sortDate;
const removeSocketFromArr = require('../utils/socket').removeSocket;
const sendSocketMsg = require('../utils/socket').socketMessage;

// set server address and other information
const hostname = server_config.hostname;
const port = server_config.port;
const url = database_config.database;
const sessionObj = session_config(url);

// init app
const app = express();

// set view engine and tools like middleware, session, and static folder
app.use(morgan('dev'));
app.use(urlencodeParser);
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session(sessionObj));
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');
const multipartMiddleware = multipart();


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

// Setup mongoose connection
mongoose.connect(url);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// start service
app.listen(port, function(){
	console.log('Server running at http://' + hostname + ':' + port);
});


app.io = io;
app.admin = [];
io.on('connection', (socket) => {
  console.log('admin connected');
	socket.on('admin-login', function(data){
		app.admin.push(data);
	})
  socket.on("disconnect", () => {
    console.log("admin disconnected");
		removeSocketFromArr(app.admin, socket.id);
  });
});

// Route Files
let index = require('./web-controllers/routes/index');
let appointment = require('./web-controllers/routes/appointment');
let user = require('./web-controllers/routes/user');
let dog = require('./web-controllers/routes/dog');
let admin = require('./web-controllers/routes/admin');

// Setup routers
app.use('/', index);
app.use('/user', user);
app.use('/appointment', appointment);
app.use('/dog', dog);
app.use('/admin', admin);
