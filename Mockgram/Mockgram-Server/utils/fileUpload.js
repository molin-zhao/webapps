const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const response = require("./response");

checkImageType = file => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalFilename).toLowerCase()
  );
  const mimetype = filetypes.test(file.type);
  if (mimetype && extname) {
    return true;
  } else {
    return false;
  }
};

exports.getFileName = (dest, file) => {
  return new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return reject({ err });
      if (typeof dest === "string") {
        let fileName =
          Date.now() +
          "-" +
          raw.toString("hex") +
          path.extname(file.originalFilename);
        let fileLocation = `${dest}${fileName}`;
        return resolve({
          fileName,
          fileLocation
        });
      }
      return reject({
        err: "file destination expected a string"
      });
    });
  });
};

exports.getFileBaseName = (dest, file) => {
  return new Promise((resolve, reject) => {
    if (typeof dest === "string") {
      let fileName = path.basename(file.originalFilename);
      let fileLocation = `${dest}${fileName}`;
      return resolve({
        fileName,
        fileLocation
      });
    }
    return reject({
      err: "file destination must be a string"
    });
  });
};

exports.uploadImage = (limit, fileLocation, file, cb) => {
  if (file) {
    if (checkImageType(file)) {
      if (file.size > limit) return cb(response.ERROR.FILE_SIZE_EXCEEDED);
      // connect-multiparty will creates temp files on server
      // we should manually clean it after saving file to target path
      let tmpPath = file.path;
      fs.rename(tmpPath, fileLocation, err => {
        if (err) {
          console.log(err);
          return cb(response.ERROR.SAVING_FILE_ERROR);
        }
        try {
          fs.unlinkSync(tmpPath);
        } catch (e) {
          //pass
        } finally {
          return cb(null);
        }
      });
    } else {
      return cb(response.ERROR.FILE_TYPE_ERROR);
    }
  } else {
    return cb(response.ERROR.NO_IMAGE_PROVIDED);
  }
};

exports.getFileAsync = async path => {
  return await fs.readFileSync(path);
};

exports.deteleFileAsync = async path => {
  return await fs.unlinkSync(path);
};
