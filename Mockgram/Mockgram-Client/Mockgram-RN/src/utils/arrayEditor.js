export const concatArrayWithData = (originalArr, data) => {
    return data.new.concat(originalArr).concat(data.old);
}

export const removeItemFromArrayWithItemId = (originalArr, id) => {
    for (let i = 0; i < originalArr.length; i++) {
        if (originalArr[i]._id === id) {
            originalArr.splice(i, 1);
            break;
        }
    }
}