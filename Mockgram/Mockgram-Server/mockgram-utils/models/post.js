var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PointSchema = new Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true
	},
	coordinates: {
		type: [Number],
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
	state: {
		type: String
	},
	city: {
		type: String
	},
	district: {
		type: String
	},
	coordinates: PointSchema
});

var PostSchema = new Schema({
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
	postBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	comments: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	}],
	location: LocationSchema,
	// only record likes count
	// use favorite model to check which user likes this post
	likes: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

const Post = mongoose.model('Post', PostSchema);
module.exports = {
	Post: Post,
	Location: LocationSchema
};