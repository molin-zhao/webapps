const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentMetaSchema = new Schema({
	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	},
	users: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	}]
}, {
		timestamps: true
	});

CommentMetaSchema.statics.getCommentLikesCount = async function (commentId) {
	return await this.findOne({ comment: commentId }).then(function (err, record) {
		if (err) return handleError(res, err);
		return record.users.count();
	})
}
module.exports = mongoose.model('CommentMeta', CommentMetaSchema);