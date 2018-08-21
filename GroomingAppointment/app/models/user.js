let mongoose = require('mongoose');
var bcrypt = require('bcrypt')
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let path = require('../config/static-path');
let Dog = require('./dog');
let user_path = path.default_user_image;


let UserSchema = new Schema({
  email:  {type: String, required: true, unique: true},
  password: {type: String, required: true},
  address: {type: String},
  homeNumber: {type: Number},
  mobileNumber: {type: Number},
  workNumber: {type: Number},
  name: {type: String},
  selfIntro: {type: String},
  imagePath: {type: String, default: user_path},
  dogs: [{_id: {type: ObjectId, ref: 'Dog'}}]
});


UserSchema.pre('save', function(next){
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(this.password, salt, function(err, hash){
      if(err) return next(err);
      this.password = hash;
      next();
    })
  })
});

UserSchema.methods = {
  comparePassword: function(password, next){
    bcrypt.compare(password, this.password, function(err, ifMatch){
      if(err) return next(err);
      next(null, ifMatch);
    });
  },
}

UserSchema.statics = {
  deleteDog: function(userEmail, dogId, next){
    return this.findOne({email: userEmail}, function(err, user){
      if(err) return next(err);
      user.dogs.id(dogId).remove();
      Dog.deleteOne({_id: dogId}, function(err){
        if(err) return next(err);
      });
    })
    .exec(next);
  }
  editDog: function(dogId, newDog, next){
    return Dog.where({_id: dogId}).updateOne({
      $set : {
        dogName: newDog.dogName,
        dogBreed: newDog.dogBreed,
        dogDoB: newDog.dogDoB
      }
    }, next);
  },
  fetchAllDogs: function(userId, next){
    return Dog.find({user: userId}, function(err, dogs){
      if(err) return next(err);
    })
    .sort('dogName')
    .exec(next);
  }
}

let User = module.exports = mongoose.model('User', userSchema);
