var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PointSchema = new Schema({
	type: {
		//Point
		type: String,
		required: true
	},
	coords: {
		latitude: {
			type: Number
		},
		longitude: {
			type: Number
		}
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
	postBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	location: LocationSchema
}, {
		timestamps: true
	});

const Post = mongoose.model('Post', PostSchema);
module.exports = {
	Post: Post,
	Location: LocationSchema,
};