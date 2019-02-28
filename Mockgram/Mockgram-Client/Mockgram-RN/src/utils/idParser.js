export const parseIdFromObjectArray = (inputArr) => {
    if (inputArr.constructor === Array) {
        let outputArr = [];
        inputArr.map((item) => {
            outputArr.push(item._id);
        })
        return outputArr;
    }
    return [];
}