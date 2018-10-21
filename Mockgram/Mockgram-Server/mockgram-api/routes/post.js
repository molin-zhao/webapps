const express = require('express');
const router = express.Router();
const verification = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');
const Post = require('../../mockgram-utils/models/post').Post;
const handleError = require('../../mockgram-utils/utils/handleError').handleError;


router.get('/', (req, res) => {
    Post.find({}).populate('comments').populate('postBy').sort({ createAt: -1 }).exec((err, post) => {
        if (err) return handleError(res, err);
        console.log(post);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
})

module.exports = router;