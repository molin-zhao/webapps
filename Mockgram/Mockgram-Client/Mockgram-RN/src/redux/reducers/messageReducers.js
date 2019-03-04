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
            // message should be an array!
            let message = action.payload;
            let filteredMessage = state.message.slice();
            let _lastMessageId = state.lastMessageId;
            for (let i = 0; i < filteredMessage.length; i++) {
                let messageId = filteredMessage[i]._id;
                if (message.includes(messageId)) {
                    filteredMessage.splice(i, 1);
                    if (messageId === _lastMessageId) {
                        _lastMessageId = filteredMessage[i];
                    }
                }
            }

            return { ...state, lastMessageId: _lastMessageId, message: filteredMessage };
        default:
            return state
    }
}