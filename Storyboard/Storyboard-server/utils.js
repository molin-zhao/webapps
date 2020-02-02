const qcloudSMS = require("qcloudsms_js");
const { SMS_CONFIG } = require("./config");
const normalizePort = val => {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const sendSMS = (phone, templateId, templateParams = null) => {
  let sms = qcloudSMS(SMS_CONFIG.APP_ID, SMS_CONFIG.APP_KEY);
  let smsSender = sms.SmsSingleSender();
  return new Promise((resolve, reject) => {
    smsSender.sendWithParam(
      86,
      phone,
      templateId,
      templateParams,
      SMS_CONFIG.APP_SIGN,
      "",
      "",
      (err, res) => {
        if (err) return reject();
        return resolve(res.req);
      }
    );
  });
};
module.exports = {
  normalizePort,
  sendSMS
};
