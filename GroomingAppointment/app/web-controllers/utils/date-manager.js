const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const url = "mongodb://localhost:27017/groomingAppointment";
var args = process.argv.splice(2);
var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];

function openBookingDate(year, month){
  var day = {
    0 : true,
    1 : true,
    2 : true,
    3 : true,
    4 : true,
    5 : true
  }
  var dayNum = daysMonth(month, year);
  var dayList = new Array();
  for(var i = 0; i < dayNum; i++){
    dayList.push(day);
  }

  var newBookingDate = {
    year: year,
    month: month,
    dayList: dayList
  }

  // console.log(newBookingDate);

  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    if(err){
			console.log("Connot connect correctly to the database");
			res.sendStatus(500);
			return;
		}
    var db = client.db("groomingAppointment");
    db.collection("timetable").insertOne(newBookingDate, function(err){
      if(err) throw err;
      console.log("update timetable successfully");
      console.log(newBookingDate.year + "." + newBookingDate.month);
    });
    client.close();
  });
}

function daysMonth(month, year) {
  if((year%4==0&&year%100!=0) || (year%100==0&&year%400==0)){
    return month_olympic[month-1];
  }
  return month_normal[month-1];
}

openBookingDate(args[0] >> 0, args[1] >> 0);
