import * as ActionTypes from './ActionTypes';

export const reloadHomeFeed = feeds => ({
    type: ActionTypes.RELOAD_HOME_FEED,
    payload: feeds
})

export const updateHomeFeed = feeds => ({
    type: ActionTypes.UPDATE_HOME_FEED,
    payload: feeds
})

export const addToHeadOfHomeFeed = feed => ({
    type: ActionTypes.ADD_TO_HEAD_HOME_FEED,
    payload: feed
})