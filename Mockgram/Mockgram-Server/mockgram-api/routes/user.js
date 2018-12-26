const express = require('express');
const router = express.Router();
const passport = require('passport');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const Post = require('../../mockgram-utils/models/post');
const User = require('../../mockgram-utils/models/user');
const verification = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');
const authenticate = require('../../mockgram-utils/utils/authenticate');
const handleError = require('../../mockgram-utils/utils/handleError').handleError;

// basic user register and login routers
router.post('/register', [
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
      if (err) return handleError(res, err);
      if (user) {
        return res.json({
          status: response.ERROR.EMAIL_ADDRESS_EXISTS.CODE,
          msg: response.ERROR.EMAIL_ADDRESS_EXISTS.MSG,
        })
      } else {
        User.findOne({ username: req.body.username }, (err, user) => {
          if (err) return handleError(res, err);
          if (user) {
            return res.json({
              status: response.ERROR.USER_NAME_EXISTS.CODE,
              msg: response.ERROR.USER_NAME_EXISTS.MSG
            })
          } else {
            // email address and username both available
            // create user and save it in database
            let newUser = new User({
              email: req.body.email,
              username: req.body.username,
              password: req.body.password
            });
            newUser.save((err) => {
              if (err) return handleError(res, err);
              return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG
              })
            })
          }
        })
      }
    });
  }
});


router.post('/login', (req, res) => {
  let loginName = req.body.username;
  let criteria = (loginName.indexOf('@') === -1) ? { username: loginName } : { email: loginName };
  return User.login(criteria, req.body.password, res);
});

router.get('/token/verify', verification.verifyAuthorization, (req, res) => {
  return res.json({
    status: response.SUCCESS.OK.CODE,
    msg: response.SUCCESS.OK.MSG
  })
})

router.get('/logout', (req, res) => {
  // TODO
});


// user data routers
router.get('/:id', (req, res) => {
  User.findById(req.params.id).populate('privacySettings').exec(function (err, user) {
    if (err) {
      return res.json({
        status: response.ERROR.NOT_FOUND.CODE,
        msg: response.ERROR.NOT_FOUND.MSG,
        data: err
      });
    }

    let userResult = {
      _id: user._id,
      avatar: user.avatar,
      bio: user.bio,
      gender: user.gender,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      counts: user.counts,
      privacy_settings: user.privacy_settings
    };
    console.log(userResult);
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      user: userResult
    });
  });
});

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

router.put('profile/update', (req, res) => { });




module.exports = router;