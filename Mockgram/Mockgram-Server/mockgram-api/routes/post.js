const express = require("express");
const router = express.Router();
const agent = require("superagent");
const nodeGeocoder = require("node-geocoder");
const geocode = nodeGeocoder({
  provider: "openstreetmap",
  httpAdapter: "https"
});

// models
const Post = require("../../models/post");
const User = require("../../models/user");
const CommentModel = require("../../models/comment");
const Reply = require("../../models/reply");
const Message = require("../../models/message");
const Tag = require("../../models/tag");
const Location = require("../../models/location");

// utils
const response = require("../../utils/response");
const { handleError } = require("../../utils/handleError");
const {
  convertStringArrToObjectIdArr,
  convertStringToObjectId
} = require("../../utils/converter");
const authenticate = require("../../utils/authenticate")(User);

// configs
const { serverNodes } = require("../../config");

/**
 * POST and GET methods for query posts, comments and replies
 */

/**
 * get posts with limit, say 10~20, query params are included in the request body
 * request body contains last query's post id array
 */
router.post("/", (req, res) => {
  let limit = parseInt(req.body.limit);
  let userId = convertStringToObjectId(req.body.userId); //client id, who sent the request
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  /**
   * if client is a loggin user, then send back the follower posts.
   * else send back hot posts.
   */
  if (userId) {
    // find client's all following users
    User.findOne({ _id: userId })
      .select("following")
      .exec((err, user) => {
        let followings = user.following;
        followings.push(userId);
        if (err) return handleError(res, err);
        Post.getPosts(userId, lastQueryDataIds, limit, followings).exec(
          (err, posts) => {
            if (err) return handleError(res, err);
            return res.json({
              status: response.SUCCESS.OK.CODE,
              msg: response.SUCCESS.OK.MSG,
              data: posts
            });
          }
        );
      });
  } else {
    // client is not a loggin user, then send back hot posts
    Post.getPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
      if (err) return handleError(res, err);
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: posts
      });
    });
  }
});

// get a post with a certain post id
router.get("/:id", (req, res) => {
  Post.find({ _id: req.params.id })
    .populate("creator")
    .exec((err, post) => {
      if (err) return handleError(res, err);
      res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: post
      });
    });
});

// get post detail
router.post("/detail", (req, res) => {
  let postId = convertStringToObjectId(req.body.postId);
  let userId = convertStringToObjectId(req.body.userId);
  Post.getPostDetail(postId, userId)
    .then(post => {
      let data = post.shift();
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: data
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

// get comments
router.post("/comment", (req, res) => {
  let postId = convertStringToObjectId(req.body.postId);
  let creatorId = convertStringToObjectId(req.body.creatorId);
  let limit = req.body.limit;
  let userId = convertStringToObjectId(req.body.userId);
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  Post.getAllComment(postId, lastQueryDataIds, userId, limit).exec(
    async (err, comments) => {
      if (err) return handleError(res, err);
      const promises = comments.map(async comment => {
        let result = await CommentModel.getPostCreatorReply(
          comment._id,
          creatorId,
          userId
        );
        comment.replyByPostCreator = result.shift();
        return comment;
      });
      const data = await Promise.all(promises);
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: data
      });
    }
  );
});

/**
 * get comment's all replies
 */
router.post("/comment/reply", (req, res) => {
  let commentId = convertStringToObjectId(req.body.commentId);
  let lastDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
  let limit = req.body.limit;
  let clientId = convertStringToObjectId(req.body.userId);
  CommentModel.getAllReply(commentId, lastDataIds, clientId, limit).exec(
    (err, replies) => {
      if (err) return handleError(res, err);
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: replies
      });
    }
  );
});

/**
 * PUT methods for updating posts, comments and replies
 */

/**
 * add a reply to the comment
 */
router.put("/comment/reply", authenticate.verifyAuthorization, (req, res) => {
  let commentId = req.body.commentId;
  let content = req.body.content;
  let from = req.user._id;
  let to = req.body.to;
  let mentioned = req.body.mentioned;
  let reply = {
    commentId: commentId,
    content: content,
    from: from,
    to: to,
    mentioned: mentioned
  };
  Reply.createReply(reply, (err, replyResultArr) => {
    if (err) return handleError(res, err);
    if (replyResultArr) {
      let replyResult = replyResultArr.shift();
      if (replyResult) {
        CommentModel.findOneAndUpdate(
          { _id: commentId },
          {
            $addToSet: { replies: replyResult._id }
          }
        )
          .then(async comment => {
            let message = {
              receiver: replyResult.to._id,
              sender: replyResult.from._id,
              messageType: "ReplyComment",
              postReference: comment.postId,
              commentReference: comment._id,
              replyReference: replyResult._id
            };
            try {
              let result = await Message.createMessage(message);
              return agent
                .post(`${serverNodes.socketServer}/message/push`)
                .send({
                  message: result
                })
                .set("Accept", "application/json")
                .end(err => {
                  if (err) throw new Error(err);
                  let liked = false;
                  let postId = comment.postId;
                  replyResult.liked = liked;
                  replyResult.postId = postId;
                  return res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG,
                    data: replyResult
                  });
                });
            } catch (err) {
              return handleError(res, err);
            }
          })
          .catch(err => {
            return handleError(res, err);
          });
      } else {
        return handleError(res, err, response.ERROR.SERVER_ERROR);
      }
    } else {
      return handleError(res, err, response.ERROR.SERVER_ERROR);
    }
  });
});

/**
 * add a comment to the post
 */
router.put("/comment", authenticate.verifyAuthorization, (req, res) => {
  let content = req.body.content;
  let commentBy = req.user._id;
  let postId = req.body.postId;
  let mentioned = req.body.mentioned;
  let comment = {
    content: content,
    commentBy: commentBy,
    postId: postId,
    mentioned: mentioned
  };
  CommentModel.createComment(comment, (err, commentResultArr) => {
    if (err) return handleError(res, err);
    if (commentResultArr) {
      let commentResult = commentResultArr.shift();
      if (commentResult) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: { comments: commentResult._id }
          }
        ).then(async post => {
          let message = {
            receiver: post.creator,
            sender: commentBy,
            messageType: "CommentPost",
            postReference: post._id,
            commentReference: commentResult._id
          };
          try {
            let result = await Message.createMessage(message);
            return agent
              .post(`${serverNodes.socketServer}/message/push`)
              .send({
                message: result
              })
              .set("Accept", "application/json")
              .end(err => {
                if (err) throw new Error(err);
                let commentByPostCreator =
                  post.creator === commentBy ? true : false;
                let liked = false;
                commentResult.commentByPostCreator = commentByPostCreator;
                commentResult.liked = liked;
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG,
                  data: commentResult
                });
              });
          } catch (err) {
            return handleError(res, err);
          }
        });
      } else {
        return handleError(res, err, response.ERROR.SERVER_ERROR);
      }
    } else {
      return handleError(res, err, response.ERROR.SERVER_ERROR);
    }
  });
});

/**
 * add like or dislike to a post
 */
router.put("/liked", authenticate.verifyAuthorization, (req, res) => {
  let userId = convertStringToObjectId(req.user._id);
  let postId = req.body.postId;
  let addLike = req.body.addLike;
  let update = addLike
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };
  Post.findOneAndUpdate({ _id: postId }, update).exec(async (err, post) => {
    if (err) handleError(res, err);
    /**
     * if user like the post, create a message and send it to socket server for notification
     * otherwise delete the message already stored in the database
     */
    let message = {
      receiver: post.creator,
      sender: userId,
      messageType: "LikePost",
      postReference: post._id
    };
    if (addLike) {
      try {
        let msg = await Message.createMessage(message);
        return agent
          .post(`${serverNodes.socketServer}/message/push`)
          .send({
            message: msg
          })
          .set("Accept", "application/json")
          .end(err => {
            if (err) throw new Error(err);
            return res.json({
              status: response.SUCCESS.OK.CODE,
              msg: response.SUCCESS.OK.MSG
            });
          });
      } catch (err) {
        return handleError(res, err);
      }
    } else {
      try {
        let msg = await Message.deleteMessage(message);
        return agent
          .post(`${serverNodes.socketServer}/message/recall`)
          .send({
            message: msg
          })
          .set("Accept", "application/json")
          .end(err => {
            if (err) throw new Error(err);
            return res.json({
              status: response.SUCCESS.OK.CODE,
              msg: response.SUCCESS.OK.MSG
            });
          });
      } catch (err) {
        return handleError(res, err);
      }
    }
  });
});

router.put("/shared", authenticate.verifyAuthorization, (req, res) => {
  let userId = convertStringToObjectId(req.user._id);
  let postId = convertStringToObjectId(req.body.postId);
  Post.findOne({ _id: postId, shared: userId }).exec((err, doc) => {
    if (err) return handleError(res, err);
    if (doc) {
      return res.json({
        status: response.SUCCESS.ACCEPTED.CODE,
        msg: response.SUCCESS.ACCEPTED.MSG
      });
    } else {
      Post.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { shared: userId } }
      ).exec(async (err, post) => {
        if (err) return handleError(res, err);
        let message = {
          receiver: post.creator,
          sender: userId,
          messageType: "SharePost",
          postReference: post._id
        };
        try {
          let msg = await Message.createMessage(message);
          return agent
            .post(`${serverNodes.socketServer}/message/push`)
            .send({
              message: msg
            })
            .set("Accept", "application/json")
            .end(err => {
              if (err) throw new Error(err);
              return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG
              });
            });
        } catch (err) {
          return handleError(res, err);
        }
      });
    }
  });
});

/**
 * add like or dislike to a comment
 */
router.put("/comment/liked", authenticate.verifyAuthorization, (req, res) => {
  let userId = convertStringToObjectId(req.user._id);
  let commentId = req.body.commentId;
  let addLike = req.body.addLike;
  let update = addLike
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };
  CommentModel.findOneAndUpdate({ _id: commentId }, update).exec(
    async (err, comment) => {
      if (err) handleError(res, err);
      let message = {
        receiver: comment.commentBy,
        sender: userId,
        messageType: "LikeComment",
        postReference: comment.postId,
        commentReference: comment._id
      };
      if (addLike) {
        try {
          let result = await Message.createMessage(message);
          return agent
            .post(`${serverNodes.socketServer}/message/push`)
            .send({
              message: result
            })
            .set("Accept", "application/json")
            .end(err => {
              if (err) throw new Error(err);
              return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG
              });
            });
        } catch (err) {
          return handleError(res, err);
        }
      } else {
        try {
          let result = await Message.deleteMessage(message);
          return agent
            .post(`${serverNodes.socketServer}/message/recall`)
            .send({
              message: result
            })
            .set("Accept", "application/json")
            .end(err => {
              if (err) throw new Error(err);
              return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG
              });
            });
        } catch (err) {
          return handleError(res, err);
        }
      }
    }
  );
});

/**
 * add like or dislike to a reply
 */
router.put(
  "/comment/reply/liked",
  authenticate.verifyAuthorization,
  (req, res) => {
    let userId = convertStringToObjectId(req.user._id);
    let replyId = req.body.replyId;
    let postId = req.body.postId;
    let addLike = req.body.addLike;
    let update = addLike
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };
    Reply.findOneAndUpdate({ _id: replyId }, update).exec(
      async (err, reply) => {
        if (err) handleError(res, err);
        let commentId = reply.commentId;
        let message = {
          receiver: reply.from,
          sender: userId,
          messageType: "LikeReply",
          commentReference: commentId,
          replyReference: reply._id,
          postReference: postId
        };
        if (addLike) {
          try {
            let result = await Message.createMessage(message);
            return agent
              .post(`${serverNodes.socketServer}/message/push`)
              .send({
                message: result
              })
              .set("Accept", "application/json")
              .end(err => {
                if (err) throw new Error(err);
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG
                });
              });
          } catch (err) {
            return handleError(res, err);
          }
        } else {
          try {
            let result = await Message.deleteMessage(message);
            return agent
              .post(`${serverNodes.socketServer}/message/recall`)
              .send({
                message: result
              })
              .set("Accept", "application/json")
              .end(err => {
                if (err) throw new Error(err);
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG
                });
              });
          } catch (err) {
            return handleError(res, err);
          }
        }
      }
    );
  }
);

/**
 * tag and topic related logic
 */
router.post("/create/tag", authenticate.verifyAuthorization, (req, res) => {
  let tagName = req.body.name;
  let creator = convertStringToObjectId(req.user._id);
  Tag.create({
    name: tagName,
    creator,
    type: "Tag"
  })
    .then(doc => {
      if (doc) {
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG
        });
      } else {
        return res.json({
          status: response.SUCCESS.ACCEPTED.CODE,
          msg: response.SUCCESS.ACCEPTED.MSG
        });
      }
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/create/topic", authenticate.verifyAuthorization, (req, res) => {
  let topicName = req.body.name;
  let topicDescription = req.body.description;
  let creator = convertStringToObjectId(req.user._id);
  Tag.create({
    name: topicName,
    description: topicDescription,
    creator,
    type: "Topic"
  })
    .then(doc => {
      if (doc) {
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG
        });
      } else {
        return res.json({
          status: response.SUCCESS.ACCEPTED.CODE,
          msg: response.SUCCESS.ACCEPTED.MSG
        });
      }
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post(
  "/create/location",
  authenticate.verifyAuthorization,
  (req, res) => {
    let name = req.body.name;
    let address = req.body.address;
    let coordinates = req.body.coordinates;
    let creator = convertStringArrToObjectIdArr(req.user._id);
    let polygons = req.body.polygons;
    geocode
      .reverse({
        lat: coordinates[1],
        lon: coordinates[0]
      })
      .then(async geoRes => {
        let geoInfo = geoRes[0];
        // polygons must be closed rings
        // the first and the last coordinate of the polygon must be same
        let polygonRings = await polygons.map(polygon => {
          return polygon.concat([polygon[0]]);
        });
        let newLocation = {
          name,
          address,
          creator,
          meta: {
            country: geoInfo.country,
            city: geoInfo.city,
            street: geoInfo.streetName,
            state: geoInfo.state,
            zipcode: geoInfo.zipcode,
            isoCountryCode: geoInfo.countryCode,
            formattedAddress: geoInfo.formattedAddress
          },
          loc: {
            type: "Point",
            coordinates: coordinates
          }
        };
        if (polygonRings.length > 0) {
          newLocation.area = {
            type: "Polygon",
            coordinates: polygonRings
          };
        }
        Location.create(newLocation)
          .then(doc => {
            if (doc) {
              return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG
              });
            } else {
              return res.json({
                status: response.SUCCESS.ACCEPTED.CODE,
                msg: response.SUCCESS.ACCEPTED.MSG
              });
            }
          })
          .catch(err => {
            return handleError(res, err);
          });
      })
      .catch(err => {
        return handleError(res, err);
      });
  }
);

router.post("/search/tag", (req, res) => {
  let searchValue = req.body.value;
  let limit = parseInt(req.body.limit);
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  Tag.searchTags(searchValue, lastQueryDataIds, limit)
    .then(doc => {
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: doc,
        value: searchValue
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

// search location by string value
router.post("/search/location/name", (req, res) => {
  let searchValue = req.body.value;
  let limit = parseInt(req.body.limit);
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  Location.searchLocationsByName(searchValue, lastQueryDataIds, limit)
    .then(doc => {
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: doc,
        value: searchValue
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/search/location/coordinate", (req, res) => {
  let coordinate = req.body.coordinate;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  let limit = parseInt(req.body.limit);
  let maxDistance = parseInt(req.body.maxDistance);
  Location.searchLocationsByCoords(
    coordinate,
    lastQueryDataIds,
    limit,
    maxDistance
  )
    .then(doc => {
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: doc,
        value: coordinate
      });
    })
    .catch(err => {
      return handleError(res, err);
    });
});

router.post("/search/following", async (req, res) => {
  let searchValue = req.body.value;
  let limit = req.body.limit;
  let lastQueryDataIds = convertStringArrToObjectIdArr(
    req.body.lastQueryDataIds
  );
  let userId = convertStringToObjectId("5bc9fa9387f14a5d7d10531a");
  try {
    let searchedUsers = await User.searchFollowingUser(
      userId,
      searchValue,
      lastQueryDataIds,
      limit
    );
    res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG,
      data: searchedUsers,
      value: searchValue
    });
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = router;
