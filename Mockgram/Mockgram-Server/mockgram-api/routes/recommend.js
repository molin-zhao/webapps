const express = require("express");
const router = express.Router();

// models
const User = require("../../models/user");
const Post = require("../../models/post");

// utils
const { verifyAuthorization } = require("../../utils/authenticate")(User);
const response = require("../../utils/response");
const { handleError } = require("../../utils/handleError");
const {
  convertStringToObjectId,
  convertStringArrToObjectIdArr
} = require("../../utils/converter");

router.get("/user", verifyAuthorization, (req, res) => {
  let userId = convertStringToObjectId(req.user._id);
  let limit = parseInt(req.query.limit);
  User.aggregate([
    {
      $match: {
        _id: {
          $ne: userId
        },
        followers: {
          $ne: userId
        }
      }
    },
    {
      $project: {
        _id: 1,
        nickname: 1,
        followerCount: {
          $size: "$followers"
        },
        username: 1,
        avatar: 1,
        bio: 1
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        followerCount: -1,
        username: -1,
        nickname: -1
      }
    }
  ])
    .then(async users => {
      const promises = users.map(async user => {
        let postsResult = await Post.getRecommendUserPost(user._id, 4);
        if (postsResult.err) {
          user.posts = [];
        } else {
          user.posts = postsResult.data;
        }
        user.followed = false;
        return user;
      });
      const result = await Promise.all(promises);
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

// query for recommended posts
router.post("/post", (req, res) => {
  let userId = convertStringToObjectId(req.body.userId);
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  let limit = parseInt(req.body.limit);
  // TODO - for test
  if (userId) {
    return Post.getPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
      if (err) return handleError(res, err);
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: posts
      });
    });
  }
  return Post.find({}).exec((err, doc) => {
    if (err) return handleError(res, err);
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: doc
    });
  });
});

module.exports = router;
