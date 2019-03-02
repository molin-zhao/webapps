var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PointSchema = new Schema({
	type: {
		//Point
		type: String,
		required: true
	},
	coordinates: {
		latitude: {
			type: Number
		},
		longitude: {
			type: Number
		}
	}
});

const PolygonSchema = new Schema({
	type: {
		type: String,
		enum: ['Polygon'],
		required: true
	},
	coordinates: {
		// rectangular area with four coordinates
		type: [
			[Number]
		],
		required: true
	}
});

// location should be a name with longitude and latitude
const LocationSchema = new Schema({
	name: {
		type: String,
	},
	country: {
		type: String
	},
	city: {
		type: String
	},
	region: {
		type: String
	},
	postalCode: {
		type: String
	},
	isoCountryCode: {
		type: String
	},
	street: {
		type: String
	},
	coordinates: PointSchema
});

const PostSchema = new Schema({
	image: {
		type: String,
		required: true
	},
	label: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	location: LocationSchema,
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
	},
	mentioned: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	},
}, {
		timestamps: true
	});


PostSchema.statics.getPosts = function (userId, lastQueryDataIds, limit, followings = null) {
	if (followings) {
		return this.aggregate([
			{
				$match: {
					_id: { $nin: lastQueryDataIds },
					creator: { $in: followings }
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'creator',
					foreignField: '_id',
					as: 'postUser'
				}
			},
			{
				$unwind: "$postUser"
			},
			{
				$project: {
					"liked": {
						$in: [userId, "$likes"]
					},
					"likeCount": {
						$size: "$likes"
					},
					"commentCount": {
						$size: "$comments"
					},
					"sharedCount": {
						$size: "$shared"
					},
					"image": 1,
					"label": 1,
					"description": 1,
					"location": 1,
					"createdAt": 1,
					"creator": 1,
					"postUser.username": 1,
					"postUser.avatar": 1,
					"postUser._id": 1
				}
			},
			{
				$sort: { "createdAt": -1, "_id": -1 }
			},
			{
				$limit: limit
			}
		])
	}
	return this.aggregate([
		{
			$match: {
				_id: { $nin: lastQueryDataIds }
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'creator',
				foreignField: '_id',
				as: 'postUser'
			}
		},
		{
			$unwind: "$postUser"
		},
		{
			$project: {
				"liked": {
					$in: [userId, "$likes"]
				},
				"likeCount": {
					$size: "$likes"
				},
				"commentCount": {
					$size: "$comments"
				},
				"sharedCount": {
					$size: "$shared"
				},
				"image": 1,
				"label": 1,
				"description": 1,
				"location": 1,
				"createdAt": 1,
				"creator": 1,
				"postUser.username": 1,
				"postUser.avatar": 1,
			}
		},
		{
			$sort: { "createdAt": -1, "_id": -1 }
		},
		{
			$limit: limit
		}
	])
}

PostSchema.statics.getUserPostCount = function (userId) {
	return this.countDocuments({ creator: userId });
}

PostSchema.statics.getUserPosts = function (userId, lastQueryDataIds, limit, type) {
	let criteria = {
		_id: { $nin: lastQueryDataIds }
	};
	if (type === 'LIKED') {
		criteria.likes = userId;
	} else if (type === 'CREATED') {
		criteria.creator = userId;
	} else {
		// 'MENTIONED'
		criteria.mentioned = userId
	}

	return this.aggregate([
		{
			$match: criteria
		},
		{
			$project: {
				"_id": 1,
				"image": 1,
				"likeCount": {
					$size: "$likes"
				},
				"createdAt": 1
			}
		},
		{
			$sort: { "createdAt": -1, "_id": -1 }
		},
		{
			$limit: limit
		}
	])
}

PostSchema.statics.getAllComment = function (postId, lastComments, userId, limit) {
	return this.aggregate([
		{
			$match: {
				_id: postId
			}
		},
		{
			$project: {
				"creator": 1,
				"comments": {
					$setDifference: ["$comments", lastComments]
				}
			}
		},
		{
			$lookup: {
				from: "comments",
				localField: "comments",
				foreignField: '_id',
				as: "comments"
			}
		},
		{ $unwind: "$comments" },
		{
			$lookup: {
				from: 'replies',
				localField: 'comments.replies',
				foreignField: '_id',
				as: 'comments.replies'
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'mentioned',
				foreignField: '_id',
				as: 'comments.mentioned'
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'comments.commentBy',
				foreignField: '_id',
				as: 'comments.commentBy'
			}
		},
		{ $unwind: "$comments.commentBy" },
		{
			$project: {
				"comments.commentByPostCreator": {
					$eq: ["$comments.commentBy._id", "$creator"]
				},
				"comments": {
					"_id": 1,
					"createdAt": 1,
					"content": 1,
					"likeCount": {
						$size: "$comments.likes"
					},
					"replyCount": {
						$size: "$comments.replies"
					},
					"commentBy": {
						"username": 1,
						"avatar": 1,
						"_id": 1,
					},
					"mentioned": {
						"_id": 1,
						"username": 1,
						"avatar": 1
					},
					"liked": {
						$in: [userId, "$comments.likes"]
					}
				}
			}
		},
		{
			$sort: {
				"comments.comentByPostCreator": -1,
				"comments.likeCount": -1,
				"comments.replyCount": -1,
				"comments.createdAt": -1,
				"comments._id": -1,
			}
		},
		{ $limit: limit },
		{ $replaceRoot: { newRoot: "$comments" } }
	])
}

exports.Post = mongoose.model('Post', PostSchema);
exports.Location = LocationSchema;
exports.Polygon = PolygonSchema;
