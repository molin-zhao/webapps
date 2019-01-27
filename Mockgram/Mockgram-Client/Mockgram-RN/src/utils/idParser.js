export const parseIdFromObjectArray = (inputArr) => {
    let outputArr = [];
    inputArr.map((item) => {
        outputArr.push(item._id);
    })
    return outputArr;
}