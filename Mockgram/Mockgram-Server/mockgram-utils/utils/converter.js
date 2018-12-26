const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
exports.convertStringArrToObjectIdArr = (inputArr) => {
    let outputArr = [];
    inputArr.map((id) => {
        outputArr.push(ObjectId(id));
    });
    return outputArr;
}