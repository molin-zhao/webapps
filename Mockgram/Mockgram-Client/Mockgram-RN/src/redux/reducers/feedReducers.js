import * as ActionTypes from '../actions/ActionTypes';

export const feed = (state = {
    homeFeed: []
}, action) => {
    switch (action.type) {
        case ActionTypes.RELOAD_HOME_FEED:
            return { ...state, homeFeed: action.payload }
        case ActionTypes.UPDATE_HOME_FEED:
            return { ...state, homeFeed: state.homeFeed.concat(action.payload) }
        case ActionTypes.ADD_TO_HEAD_HOME_FEED:
            return { ...state, homeFeed: action.payload.concat(state.homeFeed) }
        default:
            return state
    }
}