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

PostSchema.statics.getUserPostCount = function (userId) {
	return this.countDocuments({ creator: userId });
}

PostSchema.statics.getUserCreatedPosts = function (userId, lastQueryDataIds, limit) {
	return this.aggregate([
		{
			$match: {
				_id: { $nin: lastQueryDataIds },
				creator: userId
			}
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
		},
	])
}

PostSchema.statics.getUserLikedPosts = function (userId, lastQueryDataIds, limit) {
	return this.aggregate([
		{
			$match: {
				_id: { $nin: lastQueryDataIds },
				likes: userId
			}
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
		},
	]);
}

PostSchema.statics.getUserMentionedPosts = function (userId, lastQueryDataIds, limit) {
	return this.aggregate([
		{
			$match: {
				_id: { $nin: lastQueryDataIds },
				mentioned: userId
			}
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
		},
	]);
}

const Post = mongoose.model('Post', PostSchema);
module.exports = {
	Post: Post,
	Location: LocationSchema,
	Polygon: PolygonSchema
};