const my_ip = require('./ipaddress.js');
const sendTime = Date.now();
const toWhom = '363704885@qq.com'
// need impovement!
var activationLink = "http://"+my_ip+":3000/active?email="+toWhom+"&time="+sendTime;
const content = 'Please activate your email account via following link: \t'+activationLink;

const sendEmail = require('./sendemail.js');
sendEmail({
  to: toWhom,
  subject:'Account Activation',
  text: content
});
