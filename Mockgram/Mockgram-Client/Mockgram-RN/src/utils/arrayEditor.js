export const concatArrayWithData = (originalArr, data) => {
  return data.new.concat(originalArr).concat(data.old);
};

export const removeItemFromArrayWithItemId = (originalArr, id) => {
  return originalArr.filter(val => val._id !== id);
};

export const getNewMessageCount = (messages, lastMessageId) => {
  if (messages && messages.length > 0) {
    let count = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i]._id === lastMessageId) {
        break;
      }
      count++;
    }

    return count;
  }
  return 0;
};

export const normalizeData = (data, numColumns) => {
  let newData = [...data];
  if (newData.length > 0 && newData.length < numColumns) {
    while (newData.length < numColumns) {
      newData.push({
        _id: `empty-${data.length}`,
        type: "empty"
      });
    }
    return newData;
  }
  return newData;
};

export const clone = obj => {
  if (null == obj || typeof obj !== "object") return obj;
  let copy = obj.constructor();
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};
