const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const agent = require('superagent');
const uploadImage = require('../../mockgram-utils/utils/fileUpload').uploadImage;
const verification = require('../../mockgram-utils/utils/verify');
const User = require('../../mockgram-utils/models/user');
const Post = require('../../mockgram-utils/models/post').Post;
const response = require('../../mockgram-utils/utils/response');
const image = require('../../config').image;
const serverAddress = require('../../config').serverNodes;
const handleError = require('../../mockgram-utils/utils/handleError').handleError;

router.all('*', verification.verifyAuthorization, (req, res, next) => {
    next();
});

router.post('/post', multipart(), verification.verifyUser, (req, res) => {
    uploadImage({
        dest: image.post,
        limit: image.limit
    }, req.files.post, (err, fileName) => {
        if (err) {
            res.json({
                status: err.CODE,
                msg: err.MSG
            });
        } else {
            // everything is ok, save it to the database
            let imagePersistencePath = `${image.postQuery}${fileName}`;
            let locationJson = JSON.parse(req.body.location);
            Post.create({
                creator: req.body.id,
                image: imagePersistencePath,
                description: req.body.description,
                label: req.body.label,
                location: locationJson
            }, (err, post) => {
                if (err) return handleError(res, err);
                agent.post(serverAddress.socketServer + '/message/post').send({
                    newPost: post
                }).set('accept', 'json').end((err, resp) => {
                    if (err) return handleError(res, err);
                    return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG
                    });
                });
            });
        }
    });
});


router.post('/profile', multipart(), verification.verifyUser, (req, res) => {
    uploadImage({
        dest: image.avatar,
        limit: image.limit
    }, req.files.avatar, (err, fileName) => {
        if (err) {
            res.json({
                status: err.CODE,
                msg: err.MSG
            });
        } else {
            // everything is ok, save it to the database
            let imagePersistencePath = `${image.avatarQuery}${fileName}`;
            let userId = req.user._id || req.body.id;
            User.findOneAndUpdate({ _id: userId }, { $set: { avatar: imagePersistencePath, bio: req.body.bio, nickname: req.body.nickname } }, { new: true, select: { 'password': 0 } }, (err, user) => {
                if (err) {
                    return res.json({
                        status: response.ERROR.DATA_PERSISTENCE_ERROR.CODE,
                        msg: response.ERROR.DATA_PERSISTENCE_ERROR.MSG
                    });
                }
                return res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG,
                    user: user
                })
            });
        }
    });
});

router.post('/profile/remove/avatar', multipart(), verification.verifyUser, (req, res) => {
    let userId = req.user._id || req.body.id;
    User.findOneAndUpdate({ _id: userId }, { $set: { avatar: '' } }, { new: true, select: { 'password': 0 } }, (err, user) => {
        if (err) return handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            user: user
        })
    })
})


module.exports = router;