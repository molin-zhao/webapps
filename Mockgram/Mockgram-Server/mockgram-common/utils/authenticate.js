var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var config = require('../../config');

let facebookProfile = ['id', 'displayName', 'name', 'gender', 'picture.type(large)'];

exports.local = passport.use(new LocalStrategy(User.authenticate()));
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