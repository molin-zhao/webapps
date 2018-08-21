const express = require('express');
const router = express.Router();
const debugger = require('../utils/logger');
const logger = debugger.logger;
const errors = debugger.errors;
let Appointment = require('../../models/appointment');

router.get('/appointment', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
  Appointment.find(function(err, appointments){
    if(err){
      logger(err, errors.NO_APPOINTMENT_FOUND);
      res.end();
      return;
    }
    //TODO
  });
});

module.exports = router;
