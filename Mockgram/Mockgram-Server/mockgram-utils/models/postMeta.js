const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const handleError = require('../utils/handleError').handleError;

const PostMetaSchema = new Schema({
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	likes: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	},
	comments: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}],
		default: []
	},
	shared: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	}
}, {
		timestamps: true
	});

PostMetaSchema.statics.findLikePostRecord = async function (postId, userId, res) {
	return await this.findOne({ post: postId, likes: mongoose.Schema.ObjectId(userId) }).then(function (err, record) {
		if (err) return handleError(res, err);
		return record ? true : false;
	});
}

PostMetaSchema.statics.getPostLikesCount = async function (postId) {
	return await this.findOne({ post: postId }).then(function (err, record) {
		if (err) return handleError(res, err);
		return record.likes.count();
	})
}

PostMetaSchema.statics.getPostCommentsCount = async function (postId) {
	return await this.findOne({ post: postId }).then(function (err, record) {
		if (err) return handleError(res, err);
		return record.comments.count();
	})
}

PostMetaSchema.statics.getPostSharedCount = async function (postId) {
	return await this.findOne({ post: postId }).then(function (err, record) {
		if (err) return handleError(res, err);
		return record.shared.count();
	})
}

module.exports = mongoose.model('PostMeta', PostMetaSchema);