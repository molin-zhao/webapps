const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const auth = require('passport-local-authenticate');
const User = require('../models/user');
const config = require('../../config');

let facebookProfile = ['id', 'displayName', 'name', 'gender', 'picture.type(large)'];

exports.local = passport.use(new LocalStrategy({ usernameField: 'username' }, function (username, password, done) {
  // local login strategy with either email or username
  // criteria for choosing email or username is check if the username field passed in contains @
  let criteria = (username.indexOf('@') === -1) ? { username: username } : { email: username };
  User.findOne(criteria, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: `${username} not exists.` });
    user.authenticate(password, (err, isValid) => {
      if (err) return done(err);
      if (isValid) return done(null, user);
      return done(null, false, { message: 'wrong password' });
    });
  });
}));

exports.facebook = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL,
  facebookProfile
},
  function (accessToken, refreshToken, profile, done) {
    User.findOne({
      OauthId: profile.id
    }, function (err, user) {
      if (err) {
        // TODO
        console.log(err);
      }
      if (!err && user !== null) {
        // user found, return user
        done(null, user);
      } else {
        user = new User({
          nickname: profile.displayName,
          OauthId: profile.id,
          OauthToken: accessToken,
          username: profile.name,
          adimin: false,
          gender: profile.gender,
          avatar: profile.photo
        });
        user.save(function (err) {
          if (err) {
            // TODO
            console.log(err);
          } else {
            done(null, user);
          }
        });
      }
    });
  }
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());