const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const my_ip = require('./ipaddress.js');
const config = JSON.parse(fs.readFileSync("./emailconfig.json"));

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port:25,
  auth: {
    user: config.email,
    pass: config.password
  },
  tls: {
    rejectUnauthorized: false,
  }
});

module.exports = function(toWhom, subCode){
  var content;
  var sub;
  // 0 -> activation
  if(subCode === 0){
    var sendTime = Date.now();
    // need impovement!
    var activationLink = "http://"+my_ip+":3000/active?email="+toWhom+"&time="+sendTime;
    content = '<h1>Please activate your email account via following link</h1><a href=\"'+activationLink+'\">'+activationLink+'</a>';
    sub = 'Account Activation';
  }else{
    return;
  }
  var mailOptions = {
    from: 'Molin <zhaomolin9333@gmail.com>',
    to: toWhom,
    subject: sub,
    text: content
  }
  transporter.sendMail(mailOptions, function(err, res){
    if(err){
      console.log("sending mail error, cannot send to " + toWhom);
    }else{
      console.log("sent mail to " + toWhom);
    }
  });
}
