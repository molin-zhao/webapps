const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const response = require('./response');

checkImageType = (file) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalFilename).toLowerCase());
    const mimetype = filetypes.test(file.type);
    if (mimetype && extname) {
        return true;
    } else {
        return false;
    }
};

exports.uploadImage = (options, file, cb) => {
    if (checkImageType(file)) {
        if (file.size > options.limit) {
            return cb(response.ERROR.FILE_SIZE_EXCEEDED, null);
        }
        crypto.pseudoRandomBytes(16, (err, raw) => {
            if (err) return cb(response.ERROR.SAVING_FILE_ERROR, null);
            let fileName = Date.now() + "-" + raw.toString('hex') + path.extname(file.originalFilename);
            let fileLocation = options.dest + fileName;
            // connect-multiparty will creates temp files on server
            // we should manually clean it after saving file to target path
            let tmpPath = file.path;
            fs.rename(tmpPath, fileLocation, (err) => {
                if (err) return cb(response.ERROR.SAVING_FILE_ERROR, null);
                fs.unlink(tmpPath, () => {
                    if (err) return cb(response.ERROR.SAVING_FILE_ERROR, null);
                    // if everything ok, return the file name to the router 
                    // data persistence needs file name
                    return cb(null, fileName);
                });
            });
        });
    } else {
        return cb(response.ERROR.FILE_TYPE_ERROR, null);
    }
};