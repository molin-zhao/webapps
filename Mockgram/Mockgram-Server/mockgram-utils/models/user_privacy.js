const mongoose = require('mongoose');
const LocationSchema = require('./post').Location;
const Schema = mongoose.Schema;

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

// UserPrivacy is used for storing user privacy settings, like position, etc.
const UserPrivacy = new Schema({
    // activity_area is used for collecting posts within this area
    activity_area: PolygonSchema,
    // location is used for positioning the user and the user can manually change it 
    location: LocationSchema
});

module.exports = mongoose.model('UserPrivacy', UserPrivacy);