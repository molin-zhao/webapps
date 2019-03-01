import * as ActionTypes from './ActionTypes';

import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/idParser';

export const getClientProfile = (token) => (dispatch) => {
    return fetch(`${baseUrl.api}/profile/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
    }).then(res => res.json()).then(resJson => {
        if (resJson.status === 200) {
            let profile = resJson.data;
            dispatch(addClientProfile(profile));
            return Promise.resolve(profile);
        } else {
            let errMsg = resJson.msg;
            dispatch(addClientProfileFailed(errMsg));
            return Promise.reject(errMsg);
        }
    }).catch(err => {
        dispatch(addClientProfileFailed(err));
        return Promise.reject(err);
    })
}

export const getClientProfilePosts = (caller, dataSource, userId, type, limit) => dispatch => {
    const url = `${baseUrl.api}/profile/post`;
    let lastData = dataSource ? dataSource : caller.state.data;
    let lqDataIds = caller.state.loadingMore ? parseIdFromObjectArray(lastData) : [];
    let lqDataLastItem = caller.state.loadingMore ? lastData.slice(-1) : null;
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            limit: limit,
            userId: userId,
            lastQueryDataIds: lqDataIds,
            type: type,
            lastQueryDataLastItem: lqDataLastItem,
        })
    }).then(res => res.json()).then(res => {
        /**
         * if dataSource exists, use dataSource from props
         * else use dataSource from component state itself
         */
        if (dataSource) {
            if (caller.state.loadingMore) {
                dispatch(addClientProfilePosts(type, res.data));
            } else {
                dispatch(reloadClientProfilePosts(type, res.data));
            }
        } else {
            caller.setState({
                data: caller.state.loadingMore === true ? res.data.new.concat(caller.state.data).concat(res.data.old) : res.data.old,
            });
        }
        caller.setState({
            // data only appended when loading more, else refresh data
            error: res.status === 200 ? null : res.msg,
            hasMore: res.data.length < limit ? false : true
        });
    }).then(() => {
        caller.setState({
            loading: false,
            refreshing: false,
            loadingMore: false
        });
    }).catch(err => {
        caller.setState({
            error: err,
        }, () => {
            console.log(err)
        });
    })
}

export const addClientProfile = (clientProfile) => ({
    type: ActionTypes.ADD_CLIENT_PROFILE,
    payload: { data: clientProfile }
})

export const addClientProfileFailed = (err) => ({
    type: ActionTypes.ADD_CLIENT_PROFILE_FAILED,
    payload: { error: err }
})

export const addClientProfilePosts = (type, data) => ({
    type: ActionTypes.ADD_CLIENT_PROFILE_POST,
    payload: { type: type, data: data }
})

export const removeClientProfilePost = (type, data) => ({
    type: ActionTypes.REMOVE_CLIENT_PROFILE_POST,
    payload: { type: type, data: data }
})

export const reloadClientProfilePosts = (type, data) => ({
    type: ActionTypes.RELOAD_CLIENT_PROFILE_POST,
    payload: { type: type, data: data }
})
