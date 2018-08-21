let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let Replies = new Schema({
  content: {type: String, required: true},
  createTime: {type: Date, default: Date.now()},
  from: {type: ObjectId, ref: 'User'},
  to: {type: ObjectId, ref: 'User'}
});

let Comments = new Schema({
  createTime: {type: Date, default: Date.now()},
  content: {type: String, required: true},
  replies: [Replies]
});

let AppointmentSchema = new Schema({
  userEmail:  {type: String},
  contactEmail: {type: String, required: true},
  contactMobileNumber: {type: Number, required: true},
  contactAddress: {type: String},
  contactName: {type: String},
  createTime: {type: Date, default: Date.now()},
  bookTime: {type: String},
  bookTimeForQuery: {type: String},
  status: {type: String},
  groomDetail: {
    dogName: {type: String},
    dogBreed: {type: String},
    groomOption: {type: String},
    additionalDescription: {type: String}
  },
  meta:{
    rating: {type: Number},
    comments: [Comments]
  }
});

let Appointment = module.exports = mongoose.model('Appointment', AppointmentSchema);
