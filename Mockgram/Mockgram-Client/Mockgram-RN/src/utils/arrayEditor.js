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
}