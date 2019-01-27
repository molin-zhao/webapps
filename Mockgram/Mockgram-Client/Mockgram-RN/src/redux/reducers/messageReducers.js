import * as ActionTypes from '../actions/ActionTypes';

export const message = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_MESSAGE:
            return {};
        case ActionTypes.READ_MESSAGE:
            return {};
        default:
            return state
    }
}