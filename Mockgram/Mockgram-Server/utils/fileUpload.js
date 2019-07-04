const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const response = require("./response");
const gm = require("gm");

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

exports.getFileName = file => {
  return new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return reject(err);
      let fileName =
        Date.now() +
        "-" +
        raw.toString("hex") +
        path.extname(file.originalFilename);
      return resolve(fileName);
    });
  });
};

exports.getFileBaseName = file => {
  return { fileName: path.basename(file.originalFilename) };
};

exports.uploadImage = (limit, fileLocation, file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(response.ERROR.NO_IMAGE_PROVIDED);
    if (checkImageType(file)) {
      if (file.size > limit) return reject(response.ERROR.FILE_SIZE_EXCEEDED);
      // connect-multiparty will creates temp files on server
      // we should manually clean it after saving file to target path
      let tmpPath = file.path;
      fs.rename(tmpPath, fileLocation, err => {
        if (err) return reject(response.ERROR.SAVING_FILE_ERROR);
        try {
          fs.unlinkSync(tmpPath);
        } catch (e) {
          //pass
        } finally {
          return resolve(`saved file to ${fileLocation}`);
        }
      });
    } else {
      return reject(response.ERROR.FILE_TYPE_ERROR);
    }
  });
};

exports.uploadImageThumbnail = (fileLocation, thumbnailLocation, size) => {
  return new Promise((resolve, reject) => {
    return gm(fileLocation)
      .resize(size, size)
      .write(thumbnailLocation, err => {
        if (err) return reject({ error: err });
        return resolve(`saved thumbnail to ${thumbnailLocation}`);
      });
  });
};

exports.getFileAsync = async path => {
  return await fs.readFileSync(path);
};

exports.deleteFileAsync = async path => {
  return await fs.unlinkSync(path);
};
