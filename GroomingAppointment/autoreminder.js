const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const url = "mongodb://localhost:27017/groomingAppointment";
const sendEmail = require('./sendemail.js');

function autoReminder(time_interval){
  console.log("Auto reminder started, sending email every " + time_interval/(1000*60*60) + " hour(s).");
  let interval = setInterval(function(url, time_interval){
    MongoClient.connect(url, function(err, client){
  		assert.equal(null, err);
  		if(err){
  			console.log("Connot connect correctly to the database");
  			res.sendStatus(500);
  			return;
  		}
  		var db = client.db("groomingAppointment");
      var currentDate = new Date();
      var previousDate = new Date(currentDate.getTime() - time_interval);
      var previousYear = previousDate.getFullYear();
      var previousMonth = previousDate.getMonth() + 1;
      var previousDay = previousDate.getDate();
      var previousTimeForQuery = previousYear + " " + previousMonth + " " + previousDay;
  		db.collection("appointment").find({"bookTimeForQuery" : previousTimeForQuery}).toArray(function(err, result){
  		  if(err)throw err;
  		  if(result.length != 0){
        // send email
          for(var i = 0; i < result.length; i++){
            var content = "Here is a reminder that you have booked a grooming service on " + result[i].bookTime + ". Please bring your lovely " + reuslt[i].dogName + " to us and enjoy your customized service."
            sendEmail({
              to: result[i].contactEmail,
              subject: "Auto Reminder",
              text: content
            });
          }
  		  }
  		  client.close();
      });
  	});
  }, time_interval);
}

// function pollingForTime(url, time_interval){
//   MongoClient.connect(url, function(err, client){
// 		assert.equal(null, err);
// 		if(err){
// 			console.log("Connot connect correctly to the database");
// 			res.sendStatus(500);
// 			return;
// 		}
// 		var db = client.db("groomingAppointment");
//     var currentDate = new Date();
//     var previousDate = new Date(currentDate.getTime() - time_interval);
//     var previousYear = previousDate.getFullYear();
//     var previousMonth = previousDate.getMonth() + 1;
//     var previousDay = previousDate.getDate();
//     var previousTimeForQuery = previousYear + " " + previousMonth + " " + previousDay;
// 		db.collection("appointment").find({"bookTimeForQuery" : previousTimeForQuery}).toArray(function(err, result){
// 		  if(err)throw err;
// 		  if(result.length != 0){
//       // send email
//         for(var i = 0; i < result.length; i++){
//           var content = "Here is a reminder that you have booked a grooming service on " + result[i].bookTime + ". Please bring your lovely " + reuslt[i].dogName + " to us and enjoy your customized service."
//           sendEmail({
//             to: result[i].contactEmail,
//             subject: "Auto Reminder",
//             text: content
//           });
//         }
// 		  }
// 		  client.close();
//     });
// 	});
// }

autoReminder(24*1000*60*60);
