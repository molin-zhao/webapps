const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const { uploadImage, getFileName } = require('../../utils/fileUpload');
const { verifyAuthorization, verifyUser } = require('../../utils/verify');
const User = require('../../models/user');
const { Post } = require('../../models/post');
const response = require('../../utils/response');
const { image } = require('../../config');
const { handleError } = require('../../utils/handleError');

router.all('*', verifyAuthorization, (req, res, next) => {
    next();
});

router.post('/post', multipart(), async (req, res) => {
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
    let locationJson = JSON.parse(req.body.location);
    let post = {
        creator: req.user._id,
        image: imagePersistencePath,
        description: req.body.description,
        label: req.body.label,
        location: locationJson
    }
    Post.createPost(post, (err, result) => {
        if (err) return handleError(res, err);
        uploadImage(limit, fileLocation, file, err => {
            if (err) return handleError(res, err);
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: result
            })
        })
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