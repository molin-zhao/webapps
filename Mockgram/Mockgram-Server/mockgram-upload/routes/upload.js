const express = require('express');
const router = express.Router();
const uploadImage = require('../../mockgram-utils/utils/file-upload').uploadImage;
const verification = require('../../mockgram-utils/utils/verify');
const Post = require('../../mockgram-utils/models/post').Post;
const response = require('../../mockgram-utils/utils/response');

router.all('*', verification.verifySession, (req, res, next) => {
    next();
});

router.post('/post', uploadImage('./public/upload/image/post/').single('post'), (req, res) => {
    if (req.file) {
        let imagePath = `http://localhost:3032/${req.file.path}`;
        let userId = req.body.postBy;
        if (userId) {
            Post.create({
                postBy: userId,
                image: imagePath,
                description: req.body.description,
                label: req.body.label,
                location: req.body.location
            }, (err, post) => {
                if (err) {
                    return res.json({
                        status: response.ERROR.DATA_PERSISTENCE_ERROR.CODE,
                        msg: response.ERROR.DATA_PERSISTENCE_ERROR.MSG
                    });
                }
                return res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG
                });
            });
        } else {
            return res.json({
                status: response.ERROR.USER_UNSPECIFIED.CODE,
                msg: response.ERROR.USER_UNSPECIFIED.MSG
            });
        }
    } else {
        return res.json({
            status: response.ERROR.NO_IMAGE_PROVIDED.CODE,
            msg: response.ERROR.NO_IMAGE_PROVIDED.MSG
        });
    }
});
module.exports = router;