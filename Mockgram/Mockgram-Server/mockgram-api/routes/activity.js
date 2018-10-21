const express = require('express');
const router = express.Router();
const verification = require('../../mockgram-utils/utils/verify');
const User = require('../../mockgram-utils/models/user');
const Post = require('../../mockgram-utils/models/post').Post;
const UserRelation = require('../../mockgram-utils/models/user_relation');
const handleError = require('../../mockgram-utils/utils/handleError').handleError;
const response = require('../../mockgram-utils/utils/response');

// var celebrity = FindCelebrity();

router.get('/search/people/:value', (req, res) => {
  let search = req.params.value;
  User.find({ $or: [{ username: { $regex: '.*' + search + '.*' } }, { nickname: { $regex: '.*' + search + '.*' } }] }, { password: 0 }, (err, user) => {
    if (err) return handleError(res, err);
    res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: user
    })
  })
})

router.get('/search/tag/:value', (req, res) => {
  let search = req.params.value;
  Post.find({
    $or: [
      { description: { $regex: '.*' + search + '.*' } },
      {
        label: { $regex: '.*' + search + '.*' }
      }]
  }).populate('postBy').exec((err, post) => {
    if (err) return handleError(res, err);
    res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: post
    })
  })

})

router.get('/search/place/:value', (req, res) => {
  let search = req.params.value;
  Post.find({
    $or: [
      { 'location.name': { $regex: '.*' + search + '.*' } },
      { 'location.street': { $regex: '.*' + search + '.*' } },
      { 'location.city': { $regex: '.*' + search + '.*' } },
      { 'location.region': { $regex: '.*' + search + '.*' } }
    ]
  }).populate('postBy').exec((err, post) => {
    if (err) return handleError(res, err);
    res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: post
    })
  })

})

router.get('/suggest/people/:id', (req, res) => {
  var userId = req.params.id;
  UserRelation.find({ user: userId }, function (err, friends) {
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
    queryFriend = []
    intersection.forEach(function (friend) {
      var friendId = friend.id;
      queryFriend.push(friendId);
      //likes: { $in: ['vaporizing', 'talking'] }
    });

    UserRelation.find({ user: { $in: queryFriend } }, function (err, newFriends) {
      if (err) {

      }

      suggestList = [];
      for (var i = 0; i < newFriends.length; i++) {
        var friend_followers = newFriends[i].followers;
        var friend_following = newFriends[i].following;
        var intersect = friend_following.filter(v => friend_followers.includes(v));
        intersect.forEach(function (newFriend) {
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

function FindCelebrity() {
  User.find({}, function (err, users) {

    if (err) {
      console.log("can't get all users from mongodb.");
      var emptyList = [];
      return emptyList;
    }
    var influenceList = [];
    users.forEach(function (user) {
      var userInf = 0;
      var followers = user.counts.followers;
      var following = user.counts.following;
      if (following != 0)
        userInf = followers / following;
      var influObj = {
        _id: user._id,
        inf: userInf,
        avatar: user.avatar,
        username: user.username,
        nickname: user.nickname
      };
      influenceList.push(influObj);
    });

    influenceList.sort(function (a, b) { return b.inf - a.inf });
    var top10 = influenceList.slice(0, 10);
    return top10;
  });
}

router.post('/like/post/:id', (req, res) => { });
router.post('/like/comment/:id', (req, res) => { });

module.exports = router;