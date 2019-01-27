import * as ActionTypes from '../actions/ActionTypes';

export const client = (state = {
    client: null,
    errMsg: null,
    profile: null,
    created: [],
    liked: [],
    mentioned: []
}, action) => {
    let { data, type, error } = action.payload ? action.payload : {};
    switch (action.type) {
        case ActionTypes.CLIENT_LOGIN:
            return { ...state, client: data, errMsg: null };
        case ActionTypes.CLIENT_LOGIN_FAILED:
            return { ...state, client: null, errMsg: error };
        case ActionTypes.CLIENT_LOGOUT:
            return {};
        case ActionTypes.GET_CLIENT_PROFILE:
            return { ...state, profile: data, errMsg: null };
        case ActionTypes.GET_CLIENT_PROFILE_FAILED:
            return { ...state, profile: null, errMsg: error };
        case ActionTypes.ADD_CLIENT_INFO:
            return { ...state, profile: null, errMsg: null, client: data }
        case ActionTypes.REMOVE_CLIENT_INFO:
            return { ...state, client: null, errMsg: null };
        case ActionTypes.ADD_CLIENT_PROFILE_POST:
            if (data && type === 'CREATED') {
                let newData = data.new.concat(state.created).concat(data.old);
                console.log(newData);
                return { ...state, created: newData }
            } else if (data && type === 'LIKED') {
                let newData = data.new.concat(state.liked).concat(data.old);
                console.log(newData);
                return { ...state, liked: newData }
            } else if (data && type === 'MENTIONED') {
                let newData = data.new.concat(state.mentioned).concat(data.old);
                console.log(newData);
                return { ...state, mentioned: newData }
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