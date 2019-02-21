const express = require('express');
const router = express.Router();
const agent = require('superagent');

// utils
const response = require('../../mockgram-utils/utils/response');
const { handleError } = require('../../mockgram-utils/utils/handleError');
const { convertStringArrToObjectIdArr, convertStringToObjectId } = require('../../mockgram-utils/utils/converter');
const { verifyAuthorization } = require('../../mockgram-utils/utils/verify');

// models
const { Post } = require('../../mockgram-utils/models/post');
const User = require('../../mockgram-utils/models/user');
const CommentModel = require('../../mockgram-utils/models/comment');
const Reply = require('../../mockgram-utils/models/reply');
const Message = require('../../mockgram-utils/models/message');

// configs
const { serverNodes } = require('../../config');


/**
 * POST and GET methods for query posts, comments and replies
 */


/**
* get posts with limit, say 10~20, query params are included in the request body
* request body contains last query's post id array
*/
router.post('/', (req, res) => {
    let limit = parseInt(req.body.limit);
    let userId = convertStringToObjectId(req.body.userId);//client id, who sent the request
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    /**
     * if client is a loggin user, then send back the follower posts.
     * else send back hot posts.
     */
    if (userId) {
        // find client's all following users
        User.findOne({ _id: userId }).select('following').exec((err, user) => {
            let followings = user.following;
            followings.push(userId);
            if (err) return handleError(res, err);
            Post.getPosts(userId, lastQueryDataIds, limit, followings).exec((err, posts) => {
                if (err) return handleError(res, err);
                return res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG,
                    data: posts
                })
            })
        })
    } else {
        // client is not a loggin user, then send back hot posts
        Post.getPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
            if (err) return handleError(res, err);
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: posts
            })
        })
    }
});

// get a post with a certain post id
router.get('/:id', (req, res) => {
    Post.find({ _id: req.params.id }).populate('creator').exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
});


// get comments
router.post('/comment', (req, res) => {
    let postId = convertStringToObjectId(req.body.postId);
    let creatorId = convertStringToObjectId(req.body.creatorId);
    let limit = req.body.limit;
    let userId = req.body.userId;//client id, who sent the request
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    Post.getAllComment(postId, lastQueryDataIds, userId, limit).exec(async (err, comments) => {
        if (err) return handleError(res, err);
        const promises = comments.map(async (comment) => {
            let result = await CommentModel.getPostCreatorReply(comment._id, creatorId);
            comment.replyByPostCreator = result.shift();
            return comment;
        });
        const data = await Promise.all(promises);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: data
        });
    });
})

/**
 * get comment's all replies
 */
router.post('/comment/reply', (req, res) => {
    let commentId = convertStringToObjectId(req.body.commentId);
    let lastDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    let limit = req.body.limit;
    let clientId = req.body.userId;
    CommentModel.getAllReply(commentId, lastDataIds, clientId, limit).exec((err, replies) => {
        if (err) return handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: replies
        })
    })
})



/**
 * PUT methods for updating posts, comments and replies
 */

/**
 * add a reply to the comment  
 */
router.put('/comment/reply', verifyAuthorization, (req, res) => {
    let commentId = req.body.commentId;
    let content = req.body.content;
    let from = req.body.from;
    let to = req.body.to;
    let mentioned = req.body.mentioned;
    Reply.create({
        commentId: commentId,
        content: content,
        from: from,
        to: to,
        mentioned: mentioned
    }).then((reply) => {
        CommentModel.updateOne({ _id: commentId }, {
            $addToSet: { replies: reply._id }
        }).exec((err, comment) => {
            if (err) return handleError(res, err);
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: reply
            });
        })
    })
})

/**
 * add like or dislike to a post
 */
router.put('/liked', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let postId = req.body.postId;
    let addLike = req.body.addLike;
    let update = addLike ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };
    Post.findOneAndUpdate({ _id: postId }, update).exec((err, post) => {
        if (err) handleError(res, err);
        /**
         * if user like the post, create a message and send it to socket server for notification
         * otherwise delete the message already stored in the database
         */
        let message = {
            receiver: post.creator,
            sender: userId,
            messageType: 'LikePost',
            postReference: post._id
        }
        if (addLike) {
            return Message.createMessage(message, (err, msg) => {
                if (err) return handleError(res, err);
                if (msg) {
                    agent.post(`${serverNodes.socketServer}/message/post/liked`).send({
                        message: msg
                    }).set('Accept', 'application/json').end((err) => {
                        if (err) return handleError(res, err);
                        return res.json({
                            status: response.SUCCESS.OK.CODE,
                            msg: response.SUCCESS.OK.MSG
                        })
                    });
                } else {
                    return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG
                    })
                }
            });
        } else {
            return Message.deleteOne(message).then(() => {
                return res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG
                })
            }).catch(err => {
                return handleError(res, err);
            })

        }
    })
})

/**
 * add like or dislike to a comment
 */
router.put('/comment/liked', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let commentId = req.body.commentId;
    let addLike = req.body.addLike;
    let update = addLike ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };
    CommentModel.updateOne({ _id: commentId }, update).exec((err, comment) => {
        if (err) handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
        })
    })
})

/**
 * add like or dislike to a reply
 */
router.put('/comment/reply/liked', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let replyId = req.body.replyId;
    let addLike = req.body.addLike;
    let update = addLike ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };
    Reply.updateOne({ _id: replyId }, update).exec((err, reply) => {
        if (err) handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
        })
    })
})


module.exports = router;