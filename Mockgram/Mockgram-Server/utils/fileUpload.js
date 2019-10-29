const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const response = require("./response");
const gm = require("gm");
const ffmpeg = require("fluent-ffmpeg");
const config = require("../config");

checkImageType = file => {
  const filetypes = /jpeg|jpg|png|gif|mov|mp4/;
  const extname = filetypes.test(
    path.extname(file.originalFilename).toLowerCase()
  );
  const mimetype = filetypes.test(file.type);
  return mimetype && extname;
};

exports.getFileName = () => {
  return new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return reject(err);
      let fileName = Date.now() + "-" + raw.toString("hex");
      return resolve(fileName);
    });
  });
};

exports.uploadImage = (fileDest, file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(response.ERROR.NO_IMAGE_PROVIDED);
    if (checkImageType(file)) {
      let ftype = file.type.split("/")[0];
      if (ftype === "image" && file.size > config.image.limit)
        return reject(response.ERROR.FILE_SIZE_EXCEEDED);
      // connect-multiparty will creates temp files on server
      // we should manually clean it after saving file to target path
      try {
        let tmpPath = file.path;
        if (
          ftype === "video" &&
          path.extname(file.originalFilename) !== ".mp4"
        ) {
          // convert other video format to .mp4
          ffmpeg(tmpPath)
            .format("mp4")
            .save(fileDest)
            .on("end", () => {
              fs.unlinkSync(tmpPath);
            });
        } else {
          fs.renameSync(tmpPath, fileDest);
          fs.unlinkSync(tmpPath);
        }
      } catch (err) {
        console.log(err);
        throw new Error(response.ERROR.SAVING_FILE_ERROR.MSG);
      } finally {
        return resolve(`saved file to ${fileLocation}`);
      }
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

exports.getFileBaseName = file => {
  return { fileName: path.basename(file.originalFilename) };
};
