const express = require('express');
const router = express.Router();
const response = require('../../mockgram-utils/utils/response');
const HotPosts = require('../../mockgram-utils/models/hotPosts');
const UserRelation = require('../../mockgram-utils/models/userRelation');
const Post = require('../../mockgram-utils/models/post').Post;
const PostMeta = require('../../mockgram-utils/models/postMeta');
const handleError = require('../../mockgram-utils/utils/handleError').handleError;

router.get('/', (req, res) => {

    let query = Post.find({}).populate('postBy').sort({ createdAt: -1 });
    query.exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
})

// get a post with a certain post id
router.get('/:id', (req, res) => {
    Post.find({ _id: req.params.id }).populate('postBy').exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
})


// get posts with limit, say 10~20, query params are included in the request body
router.post('/:limit', async (req, res) => {
    let limit = parseInt(req.params.limit);
    let userId = req.body.userId;//client id, who sent the request
    let lastPost = req.body.lastPost;
    // if client is a loggin user, then send back the follower posts.
    // else send back hot posts.
    if (userId) {
        // find client's all flowers
        UserRelation.find({ user: userId }).select('following').exec(async (err, record) => {
            if (err) return handleError(res, err);
            let query = null;
            if (lastPost) {
                let postId = lastPost._id;
                let timestamp = lastPost.createdAt;
                query = Post.find({
                    postBy: {
                        $in: record.following
                    }, createdAt: {
                        $lte: timestamp
                    }, _id: {
                        $lt: postId
                    }
                }).populate('postBy').sort({ createdAt: -1, _id: -1 }).limit(limit);
            } else {
                query = Post.find({
                    postBy: {
                        $in: record.followers
                    },
                }).populate('postBy').sort({ createdAt: -1, _id: -1 }).limit(limit);
            }
            query.then(async function (err, posts) {
                if (err) handleError(res, err);
                const promises = posts.map(async post => {
                    let liked = await PostMeta.findLikePostRecord(post._id, userId, res);
                    let likes = await PostMeta.getPostLikesCount(post._id);
                    let comments = await PostMeta.getPostCommentsCount(post._id);
                    let shared = await PostMeta.getPostSharedCount(post._id);

                    post.set('liked', liked, { strict: false });
                    post.set('likes', likes, { strict: false });
                    post.set('comments', comments, { strict: false });
                    post.set('shared', shared, { strict: false });

                    return post;
                })
                posts = await Promise.all(promises);
                res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG,
                    data: posts
                })
            })
        })
    } else {
        // client is not a loggin user, then send back hot posts
        let query = null;
        if (lastPost && lastPost.rank) {
            query = HotPosts.find({
                rank: { $lt: lastPost.rank }
            }).populate('post').populate('post.postBy').sort({ rank: -1 }).select('post').limit(limit);
        } else {
            query = HotPosts.find().populate('post').populate('post.postBy').sort({ rank: -1 }).select('post').limit(limit);
        }
        query.exec(async (err, posts) => {
            if (err) return handleError(res, err);
            const promises = posts.map(async post => {
                let likes = await PostMeta.getPostLikesCount(post._id);
                let comments = await PostMeta.getPostCommentsCount(post._id);
                let shared = await PostMeta.getPostSharedCount(post._id);

                post.post.set('liked', false, { strict: false });
                post.post.set('likes', likes, { strict: false });
                post.post.set('comments', comments, { strict: false });
                post.post.set('shared', shared, { strict: false });
                post.post.set('rank', post.rank, { strick: false });
                return post.post;
            });
            posts = await Promise.all(promises);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: posts
            })
        })
    }
})


module.exports = router;