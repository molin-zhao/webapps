const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const agent = require('superagent');
const uploadImage = require('../../mockgram-utils/utils/file-upload').uploadImage;
const verification = require('../../mockgram-utils/utils/verify');
const Post = require('../../mockgram-utils/models/post').Post;
const response = require('../../mockgram-utils/utils/response');
const image = require('../../config').image;
const serverAddress = require('../../config').serverNodes;

router.all('*', verification.verifySession, (req, res, next) => {
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
            Post.create({
                postBy: req.body.id,
                image: imagePersistencePath,
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
                agent.post(serverAddress.socketServer + '/message/post').send({
                    newPost: post
                }).set('accept', 'json').end((err, resp) => {
                    if (err) {
                        return res.json({
                            status: response.ERROR.DATA_PERSISTENCE_ERROR.CODE,
                            msg: response.ERROR.DATA_PERSISTENCE_ERROR.MSG,
                        });
                    }
                    return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG
                    });
                });
            });
        }
    });
});
module.exports = router;