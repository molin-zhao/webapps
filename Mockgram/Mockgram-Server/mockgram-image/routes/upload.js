const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const agent = require("superagent");

// models
const User = require("../../models/user");
const Post = require("../../models/post");
const Tag = require("../../models/tag");
const Location = require("../../models/location");
const Message = require("../../models/message");

// utils
const { uploadImage, getFileName } = require("../../utils/fileUpload");
const authenticate = require("../../utils/authenticate")(User);
const response = require("../../utils/response");
const { image } = require("../../config");
const { handleError } = require("../../utils/handleError");
const { convertStringArrToObjectIdArr } = require("../../utils/converter");
const { serverNodes } = require("../../config");

router.all("*", authenticate.verifyAuthorization, (req, res, next) => {
  next();
});

router.post("/post", multipart(), async (req, res) => {
  let file = req.files.post;
  let dest = image.post;
  let limit = image.limit;
  const result = await getFileName(dest, file);
  if (result.err) {
    return handleError(res, result.err);
  }
  let fileName = result.fileName;
  let fileLocation = result.fileLocation;
  let imagePersistencePath = `${image.postQuery}${fileName}`;
  let location = JSON.parse(req.body.location);
  let mentioned = convertStringArrToObjectIdArr(JSON.parse(req.body.mention));
  let tags = convertStringArrToObjectIdArr(JSON.parse(req.body.tags));
  let post = {
    creator: req.user._id,
    image: imagePersistencePath,
    description: req.body.description,
    location,
    tags,
    mentioned
  };
  try {
    let result = await Post.createPost(post);
    if (!result) {
      return res.json({
        status: response.SUCCESS.ACCEPTED.CODE,
        msg: response.SUCCESS.ACCEPTED.MSG
      });
    }
    let tagUpdateRes = await Tag.updateCounts(tags, result.creator);
    let locationUpdateRes = await Location.updateCount(
      result.location._id,
      result.creator
    );
    console.log(tagUpdateRes);
    console.log(locationUpdateRes);
    let msgObjs = result.mentioned.map(mentionedUser => {
      return {
        receiver: mentionedUser._id,
        sender: result.creator,
        messageType: "PostMentioned",
        postReference: result._id
      };
    });
    let msgs = await Message.createMessages(msgObjs);
    agent
      .post(`${serverNodes.socketServer}/message/push/batch`)
      .send({
        messages: msgs
      })
      .set("Accept", "application/json")
      .end(err => {
        if (err) return handleError(res, err);
        uploadImage(limit, fileLocation, file, err => {
          if (err) return handleError(res, err);
          return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: result
          });
        });
      });
  } catch (err) {
    return handleError(res, err);
  }
});

router.post("/profile", multipart(), authenticate.verifyUser, (req, res) => {
  uploadImage(
    {
      dest: image.avatar,
      limit: image.limit
    },
    req.files.avatar,
    (err, fileName) => {
      if (err) return handleError(res, err);
      // everything is ok, save it to the database
      let imagePersistencePath = `${image.avatarQuery}${fileName}`;
      let userId = req.user._id || req.body.id;
      User.updateOne(
        { _id: userId },
        {
          $set: {
            avatar: imagePersistencePath,
            bio: req.body.bio,
            nickname: req.body.nickname
          }
        },
        { new: true, select: { password: 0 } },
        (err, user) => {
          if (err)
            return handleError(res, err, response.ERROR.DATA_PERSISTENCE_ERROR);
          return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: user
          });
        }
      );
    }
  );
});

router.post(
  "/profile/remove/avatar",
  multipart(),
  authenticate.verifyUser,
  (req, res) => {
    let userId = req.user._id || req.body.id;
    User.updateOne(
      { _id: userId },
      { $set: { avatar: "" } },
      { new: true, select: { password: 0 } },
      (err, user) => {
        if (err) return handleError(res, err);
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG,
          data: user
        });
      }
    );
  }
);

module.exports = router;
