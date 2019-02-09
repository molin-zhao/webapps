import * as ActionTypes from '../actions/ActionTypes';

export const client = (state = {
    client: null,
    errMsg: null
}, action) => {
    switch (action.type) {
        case ActionTypes.CLIENT_LOGIN:
            return { client: action.payload, errMsg: null };
        case ActionTypes.CLIENT_LOGIN_FAILED:
            return { client: null, errMsg: action.payload };
        case ActionTypes.CLIENT_LOGOUT:
            return {};
        case ActionTypes.ADD_CLIENT_INFO:
            return { client: action.payload, errMsg: null }
        case ActionTypes.REMOVE_CLIENT_INFO:
            return { client: null, errMsg: null };
        default:
            return state
    }
}