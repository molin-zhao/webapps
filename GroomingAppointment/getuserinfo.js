const ajax = require('./ajax.js');
module.exports = function(userId){
  var urlData = "email=" + userId;
  ajax({
    trigger: null,
    method: 'get',
    url: '/getinfo',
    data: urlData,
    contentType: null,
    callbackFunction: function(feedback){
      renderProfile(feedback.message);
    },
    sendListener: null,
    receiverListener: function(trigger, feedback, callbackFunction){
      if(feedback.status === 1){
        callbackFunction(feedback);
      }else{
        console.log(feedback.message);
      }
    }
  });
}
