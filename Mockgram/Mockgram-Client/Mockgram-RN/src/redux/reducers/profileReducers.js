import * as ActionTypes from '../actions/ActionTypes';

export const profile = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.GET_PROFILE:
            return {};
        default:
            return state
    }
}