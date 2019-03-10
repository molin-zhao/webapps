import * as ActionTypes from '../actions/ActionTypes';

export const app = (state = {
    initialized: false
}, action) => {
    switch (action.type) {
        case ActionTypes.APP_FINISH_INIT:
            return { ...state, initialized: action.payload }
        default:
            return state
    }
}
