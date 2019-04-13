const { facebook, google, cookie, secretKey } = require("../config");
const jwt = require("jsonwebtoken");
const response = require("./response");
const { handleError } = require("./handleError");
// strategies
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = User => {
  return {
    getToken: user => {
      return jwt.sign(user, secretKey, {
        expiresIn: cookie.maxAge / 1000
      });
    },
    verifyAuthorization: (req, res, next) => {
      let token =
        req.body.token || req.query.token || req.headers.authorization;
      if (token) {
        return jwt.verify(token, secretKey, (err, decoded) => {
          if (err) return handleError(res, err.message);
          let userId = decoded._id;
          return User.findOne({ _id: userId })
            .select("loginStatus")
            .then(user => {
              if (
                user &&
                user.loginStatus &&
                user.loginStatus.token === token
              ) {
                req.user = decoded;
                next();
              } else {
                return res.json({
                  status: response.ERROR.UNAUTHORIZED.CODE,
                  msg: response.ERROR.UNAUTHORIZED.MSG
                });
              }
            })
            .catch(err => {
              return handleError(res, err);
            });
        });
      } else {
        return res.json({
          status: response.ERROR.NO_TOKEN_PROVIDED.CODE,
          msg: response.ERROR.NO_TOKEN_PROVIDED.MSG
        });
      }
    },
    verifyUser: (req, res, next) => {
      let queryId = req.params.id || req.body.id || req.query.id;
      let userId = req.user ? req.user._id : null;
      if (queryId && queryId === userId) {
        next();
      } else {
        return res.json({
          status: response.ERROR.FORBIDDEN.CODE,
          msg: response.ERROR.FORBIDDEN.MSG
        });
      }
    },
    // OAuth strategies
    facebookStrategy: new FacebookStrategy(
      {
        clientID: facebook.clientID,
        clientSecret: facebook.clientSecret,
        profileFields: facebook.profileFields,
        callbackURL: facebook.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        let profileJson = profile._json;
        User.findOne({ "facebookOAuth.id": profile.id }).exec((err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, { _id: user._id });
          return User.create({
            nickname: profileJson.name,
            avatar: profileJson.picture.data.url,
            authMethod: "OAuth",
            facebookOAuth: {
              id: profileJson.id,
              email: profileJson.email,
              accessToken: accessToken
            }
          })
            .then(newUser => {
              return done(null, { _id: newUser._id });
            })
            .catch(err => {
              return done(err, false);
            });
        });
      }
    ),
    googleStrategy: new GoogleStrategy(
      {
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        scope: google.scope,
        callbackURL: google.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        let profileJson = profile._json;
        User.findOne({ "googleOAuth.id": profile.id }).exec((err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, { _id: user._id });
          return User.create({
            nickname: profileJson.name,
            avatar: profileJson.picture,
            authMethod: "OAuth",
            googleOAuth: {
              id: profileJson.sub,
              email: profileJson.email,
              accessToken: accessToken
            }
          })
            .then(newUser => {
              return done(null, { _id: newUser._id });
            })
            .catch(err => {
              return done(err, false);
            });
        });
      }
    )
  };
};
