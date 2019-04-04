const express = require("express");
const router = express.Router();

// models
const User = require("../../models/user");
const Post = require("../../models/post").Post;

// utils
const { verifyAuthorization } = require("../../utils/authenticate")(User);
const response = require("../../utils/response");
const { handleError } = require("../../utils/handleError");

router.get("/user", verifyAuthorization, (req, res) => {
  let userId = req.user._id;
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
      console.log(result);
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

router.get("/post", verifyAuthorization, (req, res) => {});

module.exports = router;
