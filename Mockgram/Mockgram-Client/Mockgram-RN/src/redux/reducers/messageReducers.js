import * as ActionTypes from '../actions/ActionTypes';

export const message = (state = {
    socket: null,
    message: [],
    lastMessageId: null
}, action) => {
    switch (action.type) {

        case ActionTypes.CONNECT_SOCKET:
            return { ...state, socket: action.payload }

        case ActionTypes.RECEIVE_MESSAGE:
            // insert message at the beginning of the message array
            let newMessage = action.payload;
            let concatenatedMessage = newMessage.concat(state.message);
            return { ...state, message: concatenatedMessage };

        case ActionTypes.UPDATE_LAST_MESSAGE_ID:
            let lastMessage = state.message[0];
            let lastMessageId = lastMessage ? lastMessage._id : null;
            return { ...state, lastMessageId: lastMessageId }

        case ActionTypes.DISCONNECT_SOCKET:
            state.socket.disconnect();
            return { ...state, socket: null };

        case ActionTypes.RECALL_MESSAGE:
            let message = action.payload;
            let messageId = message._id;
            let messageCopy = state.message.slice();
            let lastMessageIdCopy = state.lastMessageId
            for (let i = 0; i < messageCopy.length; i++) {
                if (messageCopy[i]._id === messageId) {
                    // remove this message
                    messageCopy.splice(i, 1);
                    if (messageId === lastMessageIdCopy) {
                        lastMessageIdCopy = messageCopy[i];
                    }
                }
            }
            return { ...state, lastMessageId: lastMessageIdCopy, message: messageCopy };
        default:
            return state
    }
}