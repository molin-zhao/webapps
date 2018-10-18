const express = require('express');
const router = express.Router();
const passport = require('passport');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const User = require('../../mockgram-utils/models/user');
const verification = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');

// authentication routers
router.get('/auth/facebook', passport.authenticate('facebook'),
  (req, res) => { });

router.get('/auth/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG,
          data: err
        });
      }
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG
      });
    });
  })(req, res, next);
});

router.post('/auth/register', [
  // Check validity
  check('email').isEmail().withMessage('Email address should be valid'),
  check('username')
    .isLength({
      min: 1
    }).withMessage('Username is a required field.')
    .isAlphanumeric().withMessage('Username must be alphanumeric.'),

  check('password')
    .isLength({
      min: 8,
      max: 16
    }).withMessage('password must be at 6-8 characters in length.')
    .matches('[0-9]')
    .matches('[a-z]')
    .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number.')
    .custom((value, {
      req,
      loc,
      path
    }) => {
      if (value !== req.body.confirmPassword) {
        return false;
      } else {
        return value;
      }
    }).withMessage("Passwords don't match."),
], (req, res) => {
  var errors = validationResult(req).formatWith(response.ERROR.REGISTER_FAILURES.FORMAT);
  if (!errors.isEmpty()) {
    res.json({
      status: response.ERROR.REGISTER_FAILURES.CODE,
      msg: response.ERROR.REGISTER_FAILURES.MSG,
      data: errors.array()
    });
  } else {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.json({
          status: response.ERROR.SERVER_ERROR.CODE,
          msg: response.ERROR.SERVER_ERROR.MSG,
          data: err
        })
      }
      console.log(user);
      if (user) {
        return res.json({
          status: response.ERROR.EMAIL_ADDRESS_EXISTS.CODE,
          msg: response.ERROR.EMAIL_ADDRESS_EXISTS.MSG,
        })
      } else {
        User.register(new User({
          username: req.body.username,
          email: req.body.email
        }),
          req.body.password,
          function (err, user) {
            if (err) {
              return res.json({
                status: response.ERROR.SERVER_ERROR.CODE,
                msg: response.ERROR.SERVER_ERROR.MSG,
                data: err
              });
            }
            user.save(function (err, user) {
              passport.authenticate('local')(req, res, function () {
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG
                });
              });
            });
          });
      }
    });
  }
});

router.post('/auth/local', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        status: response.ERROR.NOT_FOUND.CODE,
        msg: response.ERROR.NOT_FOUND.MSG,
        data: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.json({
          status: response.ERROR.SERVER_ERROR.CODE,
          msg: response.ERROR.SERVER_ERROR.MSG,
          data: err
        });
      }
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: user
      });
    });
  })(req, res, next);
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      return res.json({
        status: response.ERROR.SERVER_ERROR.CODE,
        msg: response.ERROR.SERVER_ERROR.MSG,
        data: err
      });
    }
    req.logout();
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG
    });
  });
});


// user data routers
router.all('/profile/*', verification.verifySession, verification.verifyUser, (req, res, next) => {
  next();
});
router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id).populate('privacy_settings').exec(function (err, user) {
    if (err) {
      return res.json({
        status: response.ERROR.NOT_FOUND.CODE,
        msg: response.ERROR.NOT_FOUND.MSG,
        data: err
      });
    }
    let userResult = {
      avatar: user.avatar,
      bio: user.bio,
      gender: user.gender,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      counts: user.counts,
      privacy_settings: user.privacy_settings
    };
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: userResult
    });
  });
});

router.put('profile/update', (req, res) => { });




module.exports = router;