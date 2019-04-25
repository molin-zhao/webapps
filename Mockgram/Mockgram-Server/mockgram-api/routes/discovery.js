const express = require("express");
const router = express.Router();

// models
const User = require("../../models/user");
const Post = require("../../models/post");
const Tag = require("../../models/tag");

// utils
const authenticate = require("../../utils/authenticate")(User);
const { handleError } = require("../../utils/handleError");
const response = require("../../utils/response");
const {
  convertStringToObjectId,
  convertStringArrToObjectIdArr
} = require("../../utils/converter");

router.post("/search/people", (req, res) => {
  let search = req.body.searchValue;
  let userId = convertStringToObjectId(req.body.userId);
  let limit = req.body.limit;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  User.searchUser(search, userId, limit, lastQueryDataIds)
    .then(user => {
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: user
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/search/tag", (req, res) => {
  let search = req.body.searchValue;
  let limit = req.body.limit;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  Post.searchPostByTag(search, limit, lastQueryDataIds)
    .then()
    .catch();
});

router.post("/search/place", (req, res) => {
  let search = req.body.searchValue;
  let limit = req.body.limit;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  Post.searchPostByPlace(search, limit, lastQueryDataIds)
    .then()
    .catch();
});

router.post("/suggest/people/:id", (req, res) => {
  var userId = req.params.id;
  User.find({ user: userId }, function(err, friends) {
    if (err) {
      //if the user has no friend
      //userResult shows the data of celebrity list, including image, username, userIntro
      let userResult = celebrity;
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        users: userResult
      });
    }

    //find the common friends
    var followers = friends[0].followers;
    var following = friends[0].following;
    //find the friends that you are following and followed by
    let intersection = following.filter(v => followers.includes(v));

    //find the friends of my friends
    queryFriend = [];
    intersection.forEach(function(friend) {
      var friendId = friend.id;
      queryFriend.push(friendId);
      //likes: { $in: ['vaporizing', 'talking'] }
    });

    User.find({ user: { $in: queryFriend } }, function(err, newFriends) {
      if (err) {
      }

      suggestList = [];
      for (var i = 0; i < newFriends.length; i++) {
        var friend_followers = newFriends[i].followers;
        var friend_following = newFriends[i].following;
        var intersect = friend_following.filter(v =>
          friend_followers.includes(v)
        );
        intersect.forEach(function(newFriend) {
          if (userId != newFriend.id) {
            let newFriendInfo = {
              _id: newFriend._id,
              avatar: newFriend.avatar,
              username: newFriend.username,
              nickname: newFriend.nickname
            };
            suggestList.push(newFriendInfo);
          }
        });
      }

      let allSuggest = celebrity.concat(suggestList);

      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        users: allSuggest
      });
    });
  });
});

router.get("/recommend/tag", (req, res) => {
  let limitParam = parseInt(req.query.limit);
  let limit = limitParam ? limitParam : 10;
  //TODO
  res.json({
    status: response.SUCCESS.OK.CODE,
    msg: response.SUCCESS.OK.MSG,
    data: []
  });
});

router.get("/tag/hot", async (req, res) => {
  let limitParam = parseInt(req.query.limit);
  let limit = limitParam ? limitParam : 10;
  let result = await Tag.getHotTags(limit);
  res.json({
    status: response.SUCCESS.OK.CODE,
    msg: response.SUCCESS.OK.MSG,
    tag: result
  });
});

router.get("/topic/hot", async (req, res) => {
  let limitParam = parseInt(req.query.limit);
  let limit = limitParam ? limitParam : 10;
  let result = await Tag.getHotTopics(limit);
  res.json({
    status: response.SUCCESS.OK.CODE,
    msg: response.SUCCESS.OK.MSG,
    topic: result
  });
});

router.get("/tag/available", (req, res) => {
  let tagName = req.query.value;
  Tag.findOne({
    name: tagName,
    type: "Tag"
  }).exec((err, doc) => {
    if (err) return handleError(res, err);
    if (doc) {
      return res.json({
        status: response.SUCCESS.ACCEPTED.CODE,
        msg: response.SUCCESS.ACCEPTED.MSG
      });
    }
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG
    });
  });
});

router.get("/topic/available", (req, res) => {
  let topicName = req.query.value;
  Tag.findOne({
    name: topicName,
    type: "Topic"
  }).exec((err, doc) => {
    if (err) return handleError(res, err);
    if (doc) {
      return res.json({
        status: response.SUCCESS.ACCEPTED.CODE,
        msg: response.SUCCESS.ACCEPTED.MSG
      });
    }
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG
    });
  });
});

module.exports = router;
