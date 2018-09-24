var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	},
	users: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		}
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);