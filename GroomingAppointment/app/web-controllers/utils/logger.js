module.exports.logger = function(err, message){
  console.log(message);
  console.log(err);
  throw err;
}
module.exports.errors = {
  NO_USER_FOUND = "error on finding user.",
  NO_APPOINTMENT_FOUND = "error on finding appointment."
}
