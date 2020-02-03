const express = require("express");
const routers = express.Router();
const { SMS_CONFIG } = require("../../config");
const { sendSMS } = require("../../utils");

routers.post("/sms", (req, res) => {
  let phone = req.body.phone;
  let templateId = SMS_CONFIG.TEMPLATE.REGISTER;
  let params = ["1234", "3"];
  sendSMS(phone, templateId, params)
    .then(resp => {
      if (resp) console.log(resp.body);
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "error sending message"
      });
    });
});

module.exports = routers;
