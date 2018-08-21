var nodemailer = require('nodemailer');
var emailconfig = require('../../config/email-conf');

module.exports = function(to_subject_text){
  var mailOptions = {
    from: emailconfig.email,
    to: to_subject_text.to,
    subject: to_subject_text.subject,
    text: to_subject_text.text
  };

  var transporter = nodemailer.createTransport({
    service: emailconfig.service,
    auth: {
      user: emailconfig.email,
      pass: emailconfig.password
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent to: '+ to_subject_text.to + "\t" + info.response);
    }
  });
}
