const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const agent = require("superagent");
const ObjectId = require("mongoose").Types.ObjectId;

// models
const User = require("../../models/user");
const Post = require("../../models/post");
const Tag = require("../../models/tag");
const Location = require("../../models/location");
const Message = require("../../models/message");

// utils
const {
  uploadImage,
  getFileName,
  deleteFileAsync
} = require("../../utils/fileUpload");
const authenticate = require("../../utils/authenticate")(User);
const response = require("../../utils/response");
const { image } = require("../../config");
const { handleError } = require("../../utils/handleError");
const {
  convertStringArrToObjectIdArr,
  convertStringToObjectId
} = require("../../utils/converter");
const { serverNodes } = require("../../config");

router.post(
  "/post",
  authenticate.verifyAuthorization,
  multipart(),
  async (req, res) => {
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
  }
);

router.post(
  "/profile",
  authenticate.verifyAuthorization,
  multipart(),
  async (req, res) => {
    let avatar = req.files.avatar;
    let dest = image.avatar;
    let limit = image.limit;
    let bio = req.body.bio;
    let nickname = req.body.nickname;
    let userId = convertStringToObjectId(req.user._id);
    if (avatar) {
      const result = await getFileName(dest, avatar);
      if (result.err) return handleError(res, result.err);
      let fileName = result.fileName;
      let fileLocation = result.fileLocation;
      let imageQueryPath = `${image.avatarQuery}${fileName}`;
      User.findOne({ _id: userId })
        .select("avatar")
        .exec((err, user) => {
          if (err) return handleError(res, err);
          if (!user) return handleError(res, response.ERROR.NOT_FOUND);
          let originalAvatar = user.avatar;
          if (originalAvatar) {
            // original avatar is not null
            // remove avatar file and update
            let originalAvatarFileName = originalAvatar.split("/").pop();
            let originalAvatarFilePath = `${dest}${originalAvatarFileName}`;
            try {
              deleteFileAsync(originalAvatarFilePath);
            } catch (err) {
              console.log(err);
              return handleError(res, err);
            }
          }
          User.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                avatar: imageQueryPath,
                bio,
                nickname
              }
            },
            {
              new: true,
              select: {
                avatar: 1,
                nickname: 1,
                bio: 1
              }
            },
            (err, user) => {
              if (err)
                return handleError(
                  res,
                  err,
                  response.ERROR.DATA_PERSISTENCE_ERROR
                );
              return uploadImage(limit, fileLocation, imageFile, err => {
                if (err) return handleError(res, err);
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG,
                  data: user
                });
              });
            }
          );
        });
    } else {
      User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            nickname,
            bio
          }
        },
        {
          new: true,
          select: {
            avatar: 1,
            nickname: 1,
            bio: 1
          }
        },
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
  }
);

router.get(
  "/profile/remove/avatar",
  authenticate.verifyAuthorization,
  (req, res) => {
    let userId = convertStringToObjectId(req.user._id);
    let dest = image.avatar;
    User.findOne({ _id: userId })
      .select("avatar")
      .exec((err, user) => {
        if (err) return handleError(res, err);
        if (!user) return handleError(res, response.ERROR.NOT_FOUND);
        let originalAvatar = user.avatar;
        if (originalAvatar) {
          // original avatar is not null
          // remove avatar file and update
          let originalAvatarFileName = originalAvatar.split("/").pop();
          let originalAvatarFilePath = `${dest}${originalAvatarFileName}`;
          try {
            deleteFileAsync(originalAvatarFilePath);
            User.findOneAndUpdate(
              { _id: userId },
              {
                $set: {
                  avatar: ""
                }
              },
              {
                new: true,
                select: {
                  avatar: 1,
                  nickname: 1,
                  bio: 1
                }
              },
              (err, user) => {
                if (err)
                  return handleError(
                    res,
                    err,
                    response.ERROR.DATA_PERSISTENCE_ERROR
                  );
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG,
                  data: user
                });
              }
            );
          } catch (err) {
            console.log(err);
            return handleError(res, err);
          }
        } else {
          res.json({
            status: response.SUCCESS.ACCEPTED.CODE,
            msg: response.SUCCESS.ACCEPTED.MSG
          });
        }
      });
  }
);

module.exports = router;
