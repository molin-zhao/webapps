const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const { uploadImage } = require('../../mockgram-utils/utils/fileUpload');
const { verifyAuthorization, verifyUser } = require('../../mockgram-utils/utils/verify');
const User = require('../../mockgram-utils/models/user');
const { Post } = require('../../mockgram-utils/models/post');
const response = require('../../mockgram-utils/utils/response');
const { image } = require('../../config');
const { handleError } = require('../../mockgram-utils/utils/handleError');

router.all('*', verifyAuthorization, (req, res, next) => {
    next();
});

router.post('/post', multipart(), verifyUser, (req, res) => {
    uploadImage({
        dest: image.post,
        limit: image.limit
    }, req.files.post, (err, fileName) => {
        if (err) return handleError(res, err);
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
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: post
            });
        });
    });
});


router.post('/profile', multipart(), verifyUser, (req, res) => {
    uploadImage({
        dest: image.avatar,
        limit: image.limit
    }, req.files.avatar, (err, fileName) => {
        if (err) return handleError(res, err);
        // everything is ok, save it to the database
        let imagePersistencePath = `${image.avatarQuery}${fileName}`;
        let userId = req.user._id || req.body.id;
        User.updateOne({ _id: userId }, { $set: { avatar: imagePersistencePath, bio: req.body.bio, nickname: req.body.nickname } }, { new: true, select: { 'password': 0 } }, (err, user) => {
            if (err) return handleError(res, err, response.ERROR.DATA_PERSISTENCE_ERROR);
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: user
            })
        });
    });
});

router.post('/profile/remove/avatar', multipart(), verifyUser, (req, res) => {
    let userId = req.user._id || req.body.id;
    User.updateOne({ _id: userId }, { $set: { avatar: '' } }, { new: true, select: { 'password': 0 } }, (err, user) => {
        if (err) return handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: user
        })
    })
})


module.exports = router;