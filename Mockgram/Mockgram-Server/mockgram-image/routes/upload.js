const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const agent = require("superagent");
const gm = require("gm");

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
  deleteFileAsync,
  uploadImageThumbnail
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
  // authenticate.verifyAuthorization,
  multipart(),
  async (req, res) => {
    /**
     * post is file array
     */
    try {
      let files = req.files.post;
      let fileNamePromises = files.map(async file => {
        const fileName = await getFileName();
        return { name: fileName, type: file.type.split("/")[0] };
      });
      let fileInfo = await Promise.all(fileNamePromises);
      let location = JSON.parse(req.body.location);
      let tags = convertStringArrToObjectIdArr(JSON.parse(req.body.tags));
      let creator = convertStringToObjectId(req.user._id);
      await Tag.updateCounts(tags, creator);
      await Location.updateCount(location, creator);
      let saveResultPromises = fileInfo.map(async (info, index) => {
        let fname = info.name;
        let fdest = `${image.post}${fname}`;
        await uploadImage(fdest, files[index]);
      });
      let saveResults = await Promise.all(saveResultPromises);
      console.log(saveResults);
      let queryPathPromises = fileInfo.map(info => ({
        file: `${image.postQuery}${info.fullName}`,
        thumbnail: `${image.thumbnailQuery}${info.fullName}`,
        type: info.type
      }));
      let queryPaths = await Promise.all(queryPathPromises);
      let result = await Post.createPost({
        image: queryPaths,
        description: req.body.description,
        mentioned: convertStringArrToObjectIdArr(JSON.parse(req.body.mention)),
        creator,
        location,
        tags
      });
      if (!result)
        return res.json({
          status: response.SUCCESS.ACCEPTED.CODE,
          msg: response.SUCCESS.ACCEPTED.MSG
        });
      let msgObjs = result[0].mentioned.map(mentionedUser => {
        return {
          receiver: mentionedUser._id,
          sender: result.creator,
          messageType: "PostMentioned",
          postReference: result._id
        };
      });
      if (msgObjs.length > 0) {
        let msgs = await Message.createMessages(msgObjs);
        agent
          .post(`${serverNodes.socketServer}/message/push/batch`)
          .send({
            messages: msgs
          })
          .set("Accept", "application/json")
          .end((err, res) => {
            if (err) console.log(err);
            console.log(res);
          });
      }
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG,
        data: result
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
    let limit = image.limit;
    let bio = req.body.bio;
    let nickname = req.body.nickname;
    let userId = convertStringToObjectId(req.user._id);
    if (avatar) {
      try {
        let fileName = await getFileName(avatar);
        let fileLocation = `${image.avatar}${fileName}`;
        let imageQueryPath = `${image.avatarQuery}${fileName}`;
        User.findOne({ _id: userId })
          .select("avatar")
          .exec((err, user) => {
            if (err) throw new Error(err);
            if (!user) throw new Error(response.ERROR.NOT_FOUND);
            let originalAvatar = user.avatar;
            if (originalAvatar) {
              // original avatar is not null
              // remove avatar file and update
              let originalAvatarFileName = originalAvatar.split("/").pop();
              let originalAvatarFilePath = `${dest}${originalAvatarFileName}`;
              try {
                deleteFileAsync(originalAvatarFilePath);
              } catch (err) {
                throw new Error(err);
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
              async (err, user) => {
                if (err) throw new Error(response.ERROR.DATA_PERSISTENCE_ERROR);
                await uploadImage(limit, fileLocation, imageFile);
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG,
                  data: user
                });
              }
            );
          });
      } catch (err) {
        return handleError(res, err);
      }
    } else {
      try {
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
            if (err) throw new Error(response.ERROR.DATA_PERSISTENCE_ERROR);
            return res.json({
              status: response.SUCCESS.OK.CODE,
              msg: response.SUCCESS.OK.MSG,
              data: user
            });
          }
        );
      } catch (err) {
        return handleError(res, err);
      }
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
