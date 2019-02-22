import * as ActionTypes from '../actions/ActionTypes';

export const message = (state = {
    socket: null,
    message: [],
    lastMessageId: ''
}, action) => {
    switch (action.type) {

        case ActionTypes.CONNECT_SOCKET:
            return { ...state, socket: action.payload }

        case ActionTypes.RECEIVE_MESSAGE:
            let newMessage = action.payload;
            let concatenatedMessage = newMessage.concat(state.message);
            return { ...state, message: concatenatedMessage };

        case ActionTypes.UPDATE_LAST_MESSAGE_ID:
            let lastMessageId = state.message[0]._id;
            return { ...state, lastMessageId: lastMessageId }

        case ActionTypes.DISCONNECT_SOCKET:
            state.socket.disconnect();
            return { ...state, socket: null };

        default:
            return state
    }
}