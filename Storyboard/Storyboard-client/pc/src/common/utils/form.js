const isAlphanumberic = function(value, errorMsg) {
  if (value) {
    let reg = /^\w+$/;
    if (!reg.test(value)) return errorMsg;
  }
  return "";
};

const isEmailOrPhone = function(value, errorMsg) {
  if (value) {
    if (value.length === 11) {
      // phone
      let reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) return errorMsg;
    } else {
      // email
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!reg.test(value)) return errorMsg;
    }
  }
  return "";
};

const isCode = function(value, errorMsg) {
  if (value.length > 10) return errorMsg;
  if (!value) return "";
  let reg = /^\w+$/;
  if (!reg.test(value)) return errorMsg;
  return "";
};

const isPassword = function(value, errorMsg) {
  if (value) {
    let reg = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*?\(\)+=\[\]\{\}_<>,.;:'"-]).*$/;
    if (!reg.test(value)) return errorMsg;
  }
  return "";
};

export { isAlphanumberic, isEmailOrPhone, isCode, isPassword };
