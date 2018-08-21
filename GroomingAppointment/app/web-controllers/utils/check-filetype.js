const path = require('path');
module.exports = function(file, callback){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extname){
    return callback(null, true);
  }else{
    callback("Error: only image can be uploaded.");
  }
}
