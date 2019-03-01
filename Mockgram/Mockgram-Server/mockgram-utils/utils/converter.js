const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
exports.convertStringArrToObjectIdArr = (inputArr) => {
    let outputArr = [];
    inputArr.map((id) => {
        outputArr.push(ObjectId(id));
    });
    return outputArr;
}

exports.convertStringToObjectId = (inputString) => {
    if (inputString) {
        return ObjectId(inputString);
    }
    return null;
}

exports.arrSeparateByDate = (inputFlagItem, inputItemArr) => {
    if (!inputFlagItem) {
        return {
            new: [],
            old: inputItemArr,
            length: inputItemArr.length,
        }
    }
    let dateFlag = new Date(inputFlagItem.createdAt);
    let index = -1;
    for (let i = 0; i < inputItemArr.length; i++) {
        let compareDate = new Date(inputItemArr[i].createdAt);
        if (compareDate > dateFlag) {
            index = i + 1;
        } else {
            break;
        }
    }
    if (index === -1) {
        // there are not any new posts
        return {
            new: [],
            old: inputItemArr,
            length: inputItemArr.length
        }
    } else {
        return {
            new: inputItemArr.slice(0, index),
            old: inputItemArr.slice(index),
            length: inputItemArr.length
        }
    }

}