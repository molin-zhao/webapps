const response = require("./response");
exports.handleError = (res, err, errType = response.ERROR.SERVER_ERROR) => {
  console.log(err);
  if (err.CODE && err.MSG) {
    return res.json({
      status: err.CODE,
      msg: err.MSG
    });
  } else {
    return res.json({
      status: errType.CODE,
      msg: errType.MSG
    });
  }
};
