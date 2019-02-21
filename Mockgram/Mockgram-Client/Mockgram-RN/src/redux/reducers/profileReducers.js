import * as ActionTypes from '../actions/ActionTypes';
import { concatArrayWithData, removeItemFromArrayWithItemId } from '../../utils/arrayEditor';

export const profile = (state = {
    profile: null,
    errMsg: null,
    created: [],
    liked: [],
    mentioned: []
}, action) => {
    let { data, type, error } = action.payload ? action.payload : {};
    switch (action.type) {
        case ActionTypes.ADD_CLIENT_PROFILE:
            return { ...state, profile: data, errMsg: null };
        case ActionTypes.ADD_CLIENT_PROFILE_FAILED:
            return { ...state, profile: null, errMsg: error };
        case ActionTypes.ADD_CLIENT_PROFILE_POST:
            if (data && type === 'CREATED') {
                return { ...state, created: concatArrayWithData(state.created, data) }
            } else if (data && type === 'LIKED') {
                return { ...state, liked: concatArrayWithData(state.liked, data) }
            } else if (data && type === 'MENTIONED') {
                return { ...state, mentioned: concatArrayWithData(state.mentioned, data) }
            } else {
                return state
            }
        case ActionTypes.REMOVE_CLIENT_PROFILE_POST:
            if (data && type === 'CREATED') {
                return { ...state, created: removeItemFromArrayWithItemId(state.created, data) }
            } else if (data && type === 'LIKED') {
                return { ...state, liked: removeItemFromArrayWithItemId(state.liked, data) }
            } else if (data && type === 'MENTIONED') {
                return { ...state, mentioned: removeItemFromArrayWithItemId(state.mentioned, data) }
            } else {
                return state
            }
        case ActionTypes.RELOAD_CLIENT_PROFILE_POST:
            if (data && type === 'CREATED') {
                return { ...state, created: data.old }
            } else if (data && type === 'LIKED') {
                return { ...state, liked: data.old }
            } else if (data && type === 'MENTIONED') {
                return { ...state, mentioned: data.old }
            } else {
                return state
            }
        default:
            return state
    }
}