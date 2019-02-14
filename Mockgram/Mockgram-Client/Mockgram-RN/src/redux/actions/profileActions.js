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
    })
}

export const getClientProfilePosts = (caller, dataSource, userId, type, limit) => dispatch => {
    const url = `${baseUrl.api}/profile/post`;
    console.log(`fetching data from ${url}`);
    let lastData = dataSource == null ? caller.state.data : dataSource;
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            limit: limit,
            userId: userId,
            lastQueryDataIds: parseIdFromObjectArray(lastData),
            type: type,
            lastQueryDataLastItem: lastData.slice(-1),
        })
    }).then(res => res.json()).then(res => {
        if (dataSource) {
            if (caller.state.loadingMore) {
                dispatch(addClientProfilePosts(type, res.data));
            } else {
                dispatch(reloadClientProfilePosts(type, res.data));
            }
        } else {
            caller.setState({
                data: caller.state.loadingMore === true ? res.data.new.concat(caller.state.data).concat(res.data.old) : res.data.old,
            })
        }
        caller.setState({
            // data only appended when loading more, else refresh data
            error: res.status === 200 ? null : res.msg,
            hasMore: res.data.length < limit ? false : true,
            loading: false,
            refreshing: false,
            loadingMore: false,
        });
    }).catch(err => {
        console.log(err);
        caller.setState({ error: "some err", loading: false, refreshing: false, loadingMore: false });
    })
}

export const addClientProfile = (clientProfile) => ({
    type: ActionTypes.GET_CLIENT_PROFILE,
    payload: { data: clientProfile }
})

export const addClientProfileFailed = (err) => ({
    type: ActionTypes.GET_CLIENT_PROFILE_FAILED,
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
