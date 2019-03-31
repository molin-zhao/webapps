const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');

let facebookProfile = ['id', 'displayName', 'name', 'gender', 'picture.type(large)'];

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: config.cookie.maxAge / 1000 });
}

exports.decodeToken = function (token, callback) {
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) return callback(err);
    return callback(null, decoded);
  })
}

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
