const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// check file type is image
checkImageType = function (file, callback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback("Error: only image can be uploaded.");
    }
}

exports.uploadImage = function (dest, filesize = 1024 * 1024) {
    // set storage engine
    const storage = multer.diskStorage({
        destination: dest,
        filename: function (req, file, callback) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if (err) return callback(err);
                callback(null, raw.toString('hex') + path.extname(file.originalname));
            });
        }
    });
    return multer({
        storage: storage,
        limits: {
            filesize: filesize
        },
        fileFilter: function (req, file, cb) {
            checkImageType(file, cb);
        }
    });
};

exports.uploadFile = function (dest, filesize = 1024 * 1024) {
    // set storage engine
    const storage = multer.diskStorage({
        destination: dest,
        filename: function (req, file, callback) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if (err) return callback(err);
                callback(null, raw.toString('hex') + path.extname(file.originalname));
            });
        }
    });
    return multer({
        storage: storage,
        limits: {
            filesize: filesize
        }
    });
}