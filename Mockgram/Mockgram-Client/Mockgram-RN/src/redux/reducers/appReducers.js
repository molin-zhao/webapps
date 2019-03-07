import * as ActionTypes from '../actions/ActionTypes';

export const app = (state = {
    initialized: false,
    inputPoppedUp: false,
    messageReceiver: {
        _id: '',
        username: '',
        messageType: ''
    },
}, action) => {
    switch (action.type) {
        case ActionTypes.APP_FINISH_INIT:
            return { ...state, initialized: action.payload }
        case ActionTypes.POP_UP_TEXT_INPUT:
            return { ...state, inputPoppedUp: true }
        case ActionTypes.DISMISS_TEXT_INPUT:
            return { ...state, inputPoppedUp: false }
        default:
            return state
    }
}
