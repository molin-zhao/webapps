let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Days = new Schema({
  period_1: {type: Boolean, required: true},
  period_2: {type: Boolean, required: true},
  period_3: {type: Boolean, required: true},
  period_4: {type: Boolean, required: true},
  period_5: {type: Boolean, required: true},
});
let TimetableSchema = new Schema({
  year: {type: Number, required: true}
  month: {type: Number, required: true},
  dayList: [Days]
});

let Timetable = module.exports = mongoose.model('Timetable', TimetableSchema);
