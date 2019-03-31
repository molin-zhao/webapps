const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check } = require("express-validator/check");
const { validationResult } = require("express-validator/check");
const agent = require("superagent");

const User = require("../../models/user");
const Message = require("../../models/message");
const { verifyAuthorization } = require("../../utils/verify");
const response = require("../../utils/response");
const { handleError } = require("../../utils/handleError");
const { serverNodes } = require("../../config");

const checkFormValidation = [
  // Check validity
  check("email")
    .isEmail()
    .withMessage("Email address should be valid"),
  check("username")
    .isLength({
      min: 1
    })
    .withMessage("Username is a required field.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric."),

  check("password")
    .isLength({
      min: 8,
      max: 16
    })
    .withMessage("password must be at 6-8 characters in length.")
    .matches("[0-9]")
    .matches("[a-z]")
    .matches("[A-Z]")
    .withMessage(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number."
    )
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        return false;
      } else {
        return value;
      }
    })
    .withMessage("Passwords don't match.")
];
// basic user register and login routers
router.post("/register", checkFormValidation, (req, res) => {
  let errors = validationResult(req).formatWith(
    response.ERROR.REGISTER_FAILURES.FORMAT
  );
  if (!errors.isEmpty()) {
    res.json({
      status: response.ERROR.REGISTER_FAILURES.CODE,
      msg: response.ERROR.REGISTER_FAILURES.MSG,
      data: errors.array()
    });
  } else {
    User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    })
      .then(user => {
        if (user) {
          return res.json({
            status: response.ERROR.EMAIL_ADDRESS_OR_USERNAME_EXISTS.CODE,
            msg: response.ERROR.EMAIL_ADDRESS_OR_USERNAME_EXISTS.MSG
          });
        } else {
          // email address and username both available
          // create user and save it in database
          let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
          });
          newUser.save(err => {
            if (err) return handleError(res, err);
            return res.json({
              status: response.SUCCESS.OK.CODE,
              msg: response.SUCCESS.OK.MSG
            });
          });
        }
      })
      .catch(err => {
        return handleError(res, err, response.ERROR.REGISTER_FAILURES);
      });
  }
});

// user login and authentication routers
router.post("/login", (req, res) => {
  let loginName = req.body.username;
  let criteria =
    loginName.indexOf("@") === -1
      ? { username: loginName }
      : { email: loginName };
  return User.login(criteria, req, res);
});

router.get("/logout", (req, res) => {
  // TODO
});

/**
 * third party login auth
 * facebook
 * google
 */
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["profile"]
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {}
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {}
);

/**
 * util routers
 */
router.put("/follow", verifyAuthorization, (req, res) => {
  let followerId = req.user._id;
  let followingId = req.body.followingId;
  let type = req.body.type;
  console.log(req.body);
  if (type === "Follow" || type === "Unfollow") {
    let followingUpdate =
      type === "Follow"
        ? { $addToSet: { followers: followerId } }
        : { $pull: { followers: followerId } };
    let followerUpdate =
      type === "Follow"
        ? { $addToSet: { following: followingId } }
        : { $pull: { following: followingId } };
    User.updateOne({ _id: followingId }, followingUpdate)
      .then(msg => {
        if (msg.nModified === 1 && msg.ok === 1) {
          User.updateOne({ _id: followerId }, followerUpdate)
            .then(msg => {
              if (msg.nModified === 1 && msg.ok === 1) {
                /**
                 * create message after both accounts have been updated successfully
                 */
                let message = {
                  sender: followerId,
                  receiver: followingId,
                  messageType: "Follow"
                };
                if (type === "Follow") {
                  return Message.createMessage(message, (err, msg) => {
                    if (err) return handleError(res, err);
                    if (msg) {
                      agent
                        .post(`${serverNodes.socketServer}/message/push`)
                        .send({
                          message: msg
                        })
                        .set("Accept", "application/json")
                        .end(err => {
                          if (err) return handleError(res, err);
                          return res.json({
                            status: response.SUCCESS.OK.CODE,
                            msg: response.SUCCESS.OK.MSG
                          });
                        });
                    } else {
                      return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG
                      });
                    }
                  });
                } else {
                  return Message.deleteOne(message)
                    .then(() => {
                      return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG
                      });
                    })
                    .catch(err => {
                      return handleError(res, err);
                    });
                }
              } else {
                return res.json({
                  status: response.ERROR.SERVER_ERROR.CODE,
                  msg: response.ERROR.SERVER_ERROR.MSG
                });
              }
            })
            .catch(err => {
              return handleError(res, err);
            });
        } else {
          return res.json({
            status: response.ERROR.SERVER_ERROR.CODE,
            msg: response.email.SERVER_ERROR.MSG
          });
        }
      })
      .catch(err => {
        return handleError(res, err);
      });
  } else {
    res.json({
      status: response.ERROR.NOT_FOUND.CODE,
      msg: response.ERROR.NOT_FOUND.MSG
    });
  }
});

router.get("/token/verify", verifyAuthorization, (req, res) => {
  console.log(req.user);
  return res.json({
    status: response.SUCCESS.OK.CODE,
    msg: response.SUCCESS.OK.MSG
  });
});

module.exports = router;
