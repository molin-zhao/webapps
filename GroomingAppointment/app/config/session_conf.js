const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
module.exports = function(db_url){
  return {
	   name: 'groomkey',
	   secret: 'grooming-appointment',
	   cookie: {
		     maxAge: 60 * 1000 * 60,
		     httpOnly: false
	   },
	   resave: false,
	   saveUninitialized: true,
	   store: new mongoStore({
		     url: db_url,
		     collection: 'sessions'
	   })
  }
}
