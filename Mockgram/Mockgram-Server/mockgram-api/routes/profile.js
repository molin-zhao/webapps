const express = require("express");
const router = express.Router();

// models
const User = require("../../models/user");
const Post = require("../../models/post");

// utils
const authenticate = require("../../utils/authenticate")(User);
const handleError = require("../../utils/handleError").handleError;
const response = require("../../utils/response");
const {
  convertStringToObjectId,
  convertStringArrToObjectIdArr,
  arrSeparateByDate
} = require("../../utils/converter");

// get personal user profile with provided token
router.get("/", authenticate.verifyAuthorization, (req, res) => {
  let clientId = convertStringToObjectId(req.user._id);
  User.getUserProfile(clientId, clientId)
    .then(async user => {
      let userProfile = user.shift();
      let postCount = await Post.getUserPostCount(clientId);
      userProfile.postCount = postCount;
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: userProfile
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

// get a user profile info with certain user id
router.post("/", (req, res) => {
  let userId = convertStringToObjectId(req.body.userId);
  let clientId = convertStringToObjectId(req.body.clientId);
  User.getUserProfile(userId, clientId)
    .then(async user => {
      let userProfile = user.shift();
      let postCount = await Post.getUserPostCount(userId);
      userProfile.postCount = postCount;
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: userProfile
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/post", (req, res) => {
  let userId = convertStringToObjectId(req.body.userId);
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  let lastItem = req.body.lastQueryDataLastItem;
  let limit = req.body.limit;
  let type = req.body.type;
  Post.getUserPosts(userId, lastQueryDataIds, limit, type)
    .then(posts => {
      let result = arrSeparateByDate(lastItem, posts);
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: result
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/user", (req, res) => {
  let userId = convertStringToObjectId(req.body.userId);
  let type = req.body.type;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  let limit = req.body.limit;
  User.getUserList(userId, limit, lastQueryDataIds, type)
    .then(users => {
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: users
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

module.exports = router;
