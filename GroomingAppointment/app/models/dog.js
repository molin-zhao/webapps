let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let path = require('../config/static-path');
let dog_path = path.default_dog_image;

let DogSchema = new Schema({
  dogName: {type: String},
  dogBreed: {type: String},
  dogDoB: {type: String},
  dogImagePath: {type: String, default: dog_path},
  user: {type: ObjectId, ref: 'User'}
});

DogSchema.statics = {

}
let Dog = module.exports = mongoose.model('Dog', userSchema);
