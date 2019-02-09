import * as ActionTypes from '../actions/ActionTypes';

export const message = (state = {
    socket: null,
    message: []
}, action) => {
    switch (action.type) {
        case ActionTypes.CONNECT_SOCKET:
            return { ...state, socket: action.payload }
        case ActionTypes.RECEIVE_MESSAGE:
            let newMessage = action.payload;
            let concatenatedMessage = newMessage.concat(state.message);
            return { ...state, message: concatenatedMessage };
        case ActionTypes.READ_MESSAGE:
            return {};
        case ActionTypes.DISCONNECT_SOCKET:
            state.socket.disconnect();
            return { ...state, socket: null };
        default:
            return state
    }
}