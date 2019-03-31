const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");
const { facebook, google, cookie, secretKey } = require("../config");
const jwt = require("jsonwebtoken");

exports.getToken = user => {
  return jwt.sign(user, secretKey, {
    expiresIn: cookie.maxAge / 1000
  });
};

exports.decodeToken = (token, callback) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return callback(err);
    return callback(null, decoded);
  });
};

// strategies
exports.facebookStrategy = () =>
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebook.clientID,
        clientSecret: facebook.clientSecret,
        callbackURL: facebook.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
      }
    )
  );
exports.googleStrategy = () =>
  passport.use(
    new GoogleStrategy(
      {
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: google.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        //  { sub: '108556959837567439014',
        //    name: 'Molin Zhao',
        //    given_name: 'Molin',
        //    family_name: 'Zhao',
        //    profile: 'https://plus.google.com/108556959837567439014',
        //    picture:
        //     'https://lh5.googleusercontent.com/-hX1qaNtImLU/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcCNfY7N_vg-8qWcX44tVZI3mDfog/mo/photo.jpg',
        //    gender: 'male',
        //    locale: 'zh-CN' } }
      }
    )
  );
